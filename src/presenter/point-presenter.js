import PointItemView from '../view/point-item.js';
import PointEdit from '../view/point-edit-item.js';
import {render, replace, remove} from '../framework/render.js';
import {getPointOffers, getDestinationById, getOffersByType} from '../utils/point.js';
import { UpdateType, UserAction } from '../const.js';
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #handlePointOpen = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;
  #allOffersByType = null;
  #allDestinations = null;
  #pointOffersByType ;
  #destination ;

  constructor({pointListContainer, onDataChange, onModeChange, onPointOpen}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handlePointOpen = onPointOpen;
  }

  init(point, allOffersByType, allDestinations) {
    this.#point = point;
    this.#allOffersByType = allOffersByType;
    this.#allDestinations = allDestinations;

    this.#pointOffersByType = getPointOffers(this.#point.offers, getOffersByType(this.#point.type, this.#allOffersByType));
    this.#destination = getDestinationById(this.#point.destination, this.#allDestinations);

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointItemView({
      point: this.#point,
      pointOffersByType: this.#pointOffersByType,
      destination: this.#destination,
      onEditClick: this.#arrowEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new PointEdit({
      point: this.#point,
      allOffersByType: this.#allOffersByType,
      allDestinations: this.#allDestinations,
      onFormSubmit: this.#arrowFormSubmit,
      onFormReset: this.#arrowFormReset,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
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
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isSaving: true,
    });
  }

  setDeleting() {
    this.#pointEditComponent.updateElement({
      isDeleting: true,
    });
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointEditComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
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
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #arrowEditClick = () => {
    this.#replaceCardToForm();
    this.#handlePointOpen();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      actionType: UserAction.UPDATE_POINT,
      updateType: UpdateType.MINOR,
      update: {...this.#point, isFavorite: !this.#point.isFavorite}
    });
  };

  #arrowFormSubmit = (update) => {
    const isMinorUpdate =
    !getPointOffers(this.#point.offers, update.offers) || !getOffersByType(this.#point.type, this.#allOffersByType, update.type);

    this.#handleDataChange({
      update: update,
      updateType: isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      actionType: UserAction.UPDATE_POINT
    });
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange({
      actionType: UserAction.DELETE_POINT,
      updateType: UpdateType.MINOR,
      update: point
    });
  };

  #arrowFormReset = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToCard();
  };
}
