import BoardView from '../view/board-view.js';
import {render, RenderPosition} from '../framework/render.js';
import EventEdit from '../view/event-edit-item.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../const.js';
import { sortDay, sortTime , sortPrice,} from '../utils/sort.js';

export default class Presenter {
  #boardComponent = new BoardView();
  #sortComponent = null;
  #eventEditComponent;
  #eventsList = new EventsListView();
  #allDestinations = [];
  #points = [];
  #allOffersByType = [];
  #boardContainer;
  #bodyContainer;
  #pointsModel;
  #noTaskComponent = new ListEmptyView();
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];

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
    this.#sourcedPoints = [...this.#pointsModel.points];

    this.#renderContainer();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#allOffersByType, this.#allDestinations);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort(sortDay);
        break;
      case SortType.TIME:
        this.#points.sort(sortTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPrice);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventsList.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point, this.#allOffersByType, this.#allDestinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(from, to) {
    this.#points
      .slice(from, to)
      .forEach((point) => {
        this.#renderPoint(point);
      });
  }

  #renderNoTaskComponent() {
    render(this.#noTaskComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderPointList() {
    render(this.#eventsList, this.#bodyContainer);
    this.#renderPoints();
  }

  #renderContainer() {
    render(this.#boardComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
    if (this.#points.length === 0) {
      render( this.#renderNoTaskComponent(), this.#bodyContainer);
    } else {
      this.#renderPointList();

    }
    this.#renderSort();
  }
}
