import EventItemView from '../view/event-item.js';
import EventEdit from '../view/event-edit-item.js';
import {render, replace, remove} from '../framework/render.js';
import {getPointOffers, getDestinationById, getOffersByType} from '../utils/event.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;
  #allOffersByType = null;
  #allDestinations = null;
  #pointOffersByType ;
  #destination ;

  constructor({pointListContainer, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, allOffersByType, allDestinations) {
    this.#point = point;
    this.#allOffersByType = allOffersByType;
    this.#allDestinations = allDestinations;

    this.#pointOffersByType = getPointOffers(this.#point.offers, getOffersByType(this.#point.type, this.#allOffersByType));
    this.#destination = getDestinationById(this.#point.destination, this.#allDestinations);

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new EventItemView({
      point: this.#point,
      pointOffersByType: this.#pointOffersByType,
      destination: this.#destination,
      onEditClick: this.#arrowEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new EventEdit({
      point: this.#point,
      allOffersByType: this.#allOffersByType,
      allDestinations: this.#allDestinations,
      onFormSubmit: this.#arrowFormSubmit,
      onFormReset: this.#arrowFormReset
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #arrowEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #arrowFormSubmit = (point, allOffersByType, allDestinations) => {
    this.#handleDataChange(point,allOffersByType, allDestinations);
    this.#replaceFormToCard();
  };

  #arrowFormReset = () => {
    this.#replaceFormToCard();
  };
}
