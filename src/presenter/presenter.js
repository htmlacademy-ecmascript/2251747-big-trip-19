import BoardView from '../view/board-view.js';
import FilterView from '../view/filter-view.js';
import EventItemView from '../view/event-item';
import {RenderPosition, render} from '../render.js';
import EventEdit from '../view/event-edit-item.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list.js';
import { getPointOffers, getDestinationById, getOffersByType } from '../utils.js';

export default class Presenter {
  boardComponent = new BoardView();
  filterComponent = new FilterView();
  sortComponent = new SortView();
  eventEditComponent;
  eventsList = new EventsListView();
  allDestionations = [];
  points = [];
  allOffersByType = [];

  constructor({boardContainer, bodyContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.bodyContainer = bodyContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];
    this.allDestinations = [...this.pointsModel.getDestinations()];
    this.allOffersByType = [...this.pointsModel.getOffersByType()];
    this.eventEditComponent = new EventEdit({allDestinations: this.allDestinations, allOffersByType: this.allOffersByType});

    render(this.boardComponent, this.boardContainer, RenderPosition.AFTERBEGIN);
    render(this.filterComponent, this.boardContainer,);
    render(this.sortComponent, this.bodyContainer);
    render(this.eventsList, this.bodyContainer);
    render(this.eventEditComponent, this.eventsList.getElement());

    this.points.forEach((point) => {
      const pointOffersByType = getPointOffers(point.offers, getOffersByType(point.type, this.allOffersByType));
      const destination = getDestinationById(point.destination, this.allDestinations);
      render(new EventItemView({point: point, pointOffersByType: pointOffersByType, destination: destination}), this.eventsList.getElement());
    });
  }
}
