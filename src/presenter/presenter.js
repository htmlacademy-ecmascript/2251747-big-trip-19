import BoardView from '../view/board-view.js';
import {render, RenderPosition} from '../framework/render.js';
import EventEdit from '../view/event-edit-item.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list.js';
import ListEmptyView from '../view/list-empty.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';

export default class Presenter {
  #boardComponent = new BoardView();
  #sortComponent = new SortView();
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

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#allOffersByType, this.#allDestinations);
  };

  #renderSort() {
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
