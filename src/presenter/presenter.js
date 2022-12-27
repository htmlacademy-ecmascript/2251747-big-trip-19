import BoardView from '../view/board-view.js';
import FilterView from '../view/filter-view.js';
import EventItemView from '../view/event-item';
import {render} from '../framework/render.js';
import EventEdit from '../view/event-edit-item.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list.js';
import { getPointOffers, getDestinationById, getOffersByType } from '../utils.js';
import ListEmptyView from '../view/list-empty.js';

export default class Presenter {
  #boardComponent = new BoardView();
  #filterComponent = new FilterView();
  #sortComponent = new SortView();
  #eventEditComponent;
  #eventsList = new EventsListView();
  #allDestinations = [];
  #points = [];
  #allOffersByType = [];
  #boardContainer;
  #bodyContainer;
  #pointsModel;

  constructor({boardContainer, bodyContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#allDestinations = [...this.#pointsModel.destinations];
    this.#allOffersByType = [...this.#pointsModel.offersByType];
    this.#eventEditComponent = new EventEdit({allDestinations: this.#allDestinations, allOffersByType: this.#allOffersByType});

    this.#renderContainer();
  }

  #renderPoint(point, allOffersByType, allDestinations) {
    const pointOffersByType = getPointOffers(point.offers, getOffersByType(point.type, allOffersByType));
    const destination = getDestinationById(point.destination, allDestinations);


    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new EventItemView({point, pointOffersByType, destination,
      onEditClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }});

    const pointEditComponent = new EventEdit({point, allOffersByType, allDestinations,
      onFormSubmit: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormReset: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }});

    function replaceCardToForm() {
      this.#eventsList.element.replaceChild(pointEditComponent.element, pointComponent.element);
    }

    function replaceFormToCard() {
      this.#eventsList.element.replaceChild(pointComponent.element, pointEditComponent.element);
    }

    render(pointComponent, this.#eventsList.element);
  }

  #renderContainer() {
    render(this.#boardComponent, this.#boardContainer);
    if (this.#points.every((point) => point.isArchive)) {
      render(new ListEmptyView(), this.#bodyContainer);
    } else {
      render(this.#filterComponent, this.#boardContainer,);
      render(this.#sortComponent, this.#bodyContainer);
      render(this.#eventsList, this.#bodyContainer);

      this.#points.forEach((point) => {
        this.#renderPoint(point, this.#allOffersByType, this.#allDestinations);
      });
    }
  }
}
