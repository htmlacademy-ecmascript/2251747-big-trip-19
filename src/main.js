import PointModel from './model/point-model.js';
import Presenter from './presenter/presenter.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';


const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointModel();
const filterModel = new FilterModel();
const boardPresenter = new Presenter({boardContainer: tripMainElement, bodyContainer: tripEventsElement, filterModel,pointsModel});

const filterPresenter = new FilterPresenter({
  filterContainer: tripMainElement,
  filterModel,
  pointsModel
});

boardPresenter.init();
filterPresenter.init();
