import BoardView from '../view/board-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointEdit from '../view/point-edit-item.js';
import PointsListView from '../view/points-list.js';
import PointPresenter from './point-presenter.js';
import SortView from '../view/sort-view.js';
import ListEmptyView from '../view/list-empty.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { sortTime , sortPrice, sortDateFrom,} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class Presenter {
  #boardComponent = new BoardView();
  #sortComponent = null;
  #pointEditComponent;
  #pointsListComponent = new PointsListView();
  #loadingComponent = new LoadingView();
  #allDestinations = [];
  #allOffersByType = [];
  #boardContainer;
  #bodyContainer;
  #pointsModel;
  #filterModel;
  #noPointComponent = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, bodyContainer, pointsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelPoint);
    this.#filterModel.addObserver(this.#handleModelPoint);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDateFrom);
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

    this.#renderContainer();
  }

  #initNewPointButton = () => {
    if(this.#pointEditComponent) { return; }
    this.#pointEditComponent = new PointEdit({
      allDestinations: this.#allDestinations,
      allOffersByType: this.#allOffersByType,
      onFormSubmit: (newPointState) => {
        this.#handleViewAction({
          update: newPointState,
          updateType:  UpdateType.MINOR,
          actionType: UserAction.ADD_POINT
        });
        this.#hideNewPointForm();
        this.#handleModeChange();
      },
      onFormReset: () => {
        this.#hideNewPointForm();
      },
    });
    this.#showNewPointForm();
    this.createPoint();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #hideNewPointForm = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    if (this.#pointEditComponent) {
      this.#pointEditComponent.reset();
      remove(this.#pointEditComponent);
      this.#pointEditComponent = null;
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hideNewPointForm();
    }
  };

  #showNewPointForm = () => {
    render(this.#pointEditComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
  };

  #handleViewAction = async ({actionType, updateType, update}) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointEditComponent.updateElement({
          isSaving: true,
        });
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.#allOffersByType, this.#allDestinations);
        this.#renderContainer();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderContainer();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
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

  #renderLoading() {
    render(this.#loadingComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onPointOpen: this.#hideNewPointForm
    });
    pointPresenter.init(point, this.#allOffersByType, this.#allDestinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }


  #renderNoPointComponent() {
    this.#noPointComponent = new ListEmptyView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    this.#boardComponent.destroy();
    remove(this.#boardComponent);
    this.#boardComponent = new BoardView(
      this.points.map( (point) => ({
        ...point,
        name: this.#allDestinations.find((destination) => destination.id === point.destination).name
      })),
      this.#initNewPointButton,
      this.#allOffersByType
    );
    this.#boardComponent.init();
    render(this.#boardComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderContainer() {
    this.#renderBoard();

    if (this.#isLoading) {
      render(this.#pointsListComponent, this.#bodyContainer);
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPointComponent();
    } else {
      render(this.#pointsListComponent, this.#bodyContainer);
      this.#renderPoints(this.points);
      this.#renderSort();
    }
  }
}
