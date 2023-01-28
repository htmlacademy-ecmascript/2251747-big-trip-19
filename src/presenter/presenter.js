import BoardView from '../view/board-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import EventEdit from '../view/event-edit-item.js';
import EventsListView from '../view/events-list.js';
import PointPresenter from './point-presenter.js';
import SortView from '../view/sort-view.js';
import ListEmptyView from '../view/list-empty.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { sortDay, sortTime , sortPrice,} from '../utils/sort.js';
import {filter} from '../utils/filter.js';

export default class Presenter {
  #boardComponent = new BoardView();
  #sortComponent = null;
  #eventEditComponent;
  #eventsList = new EventsListView();
  #allDestinations = [];
  #allOffersByType = [];
  #boardContainer;
  #bodyContainer;
  #pointsModel;
  #filterModel;
  #noTaskComponent = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({boardContainer, bodyContainer, pointsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDay);
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }
    return filteredPoints;
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  init() {
    this.#allDestinations = [...this.#pointsModel.destinations];
    this.#allOffersByType = [...this.#pointsModel.offersByType];
    this.#initNewEventButton();

    this.#renderContainer();
  }

  #initNewEventButton = () => {
    this.#boardContainer.querySelector('.trip-main__event-add-btn').addEventListener('click', () => {
      this.#eventEditComponent = new EventEdit({
        allDestinations: this.#allDestinations,
        allOffersByType: this.#allOffersByType,
        onFormSubmit: (newPointState) => {
          this.#handleViewAction({
            update: newPointState,
            updateType:  UpdateType.MINOR,
            actionType: UserAction.ADD_POINT
          });
          this.#hideNewEventForm();
        },
        onFormReset: () => {
          this.#hideNewEventForm();
        },
      });
      this.#showNewEventForm();
    });
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #hideNewEventForm = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#eventEditComponent.reset();
    remove(this.#eventEditComponent);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hideNewEventForm();
    }
  };

  #showNewEventForm = () => {
    render(this.#eventEditComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
  };

  #handleViewAction = ({actionType, updateType, update}) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#allOffersByType, this.#allDestinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderContainer();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedPointCount: true});
    this.#renderContainer();
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noTaskComponent) {
      remove(this.#noTaskComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventsList.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point, this.#allOffersByType, this.#allDestinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderNoTaskComponent() {
    this.#noTaskComponent = new ListEmptyView({
      filterType: this.#filterType
    });
    render(this.#noTaskComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  #renderContainer() {
    render(this.#boardComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);

    if (this.points.length === 0) {
      this.#renderNoTaskComponent();
    } else {
      render(this.#eventsList, this.#bodyContainer);
      this.#renderPoints(this.points);

    }
    this.#renderSort();
  }
}
