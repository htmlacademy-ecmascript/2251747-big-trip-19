import BoardView from '../view/board-view.js';
import FilterView from '../view/filter-view.js';
import EventItemView from '../view/event-item';
import {RenderPosition, render} from '../render.js';
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

    const pointComponent = new EventItemView({point, pointOffersByType, destination});
    const pointEditComponent = new EventEdit({point, allOffersByType, allDestinations});

    const replaceCardToForm = () => {
      this.#eventsList.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToCard = () => {
      this.#eventsList.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('.event').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('.event').addEventListener('reset', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#eventsList.element);
  }

  #renderContainer() {
    render(this.#boardComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
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
