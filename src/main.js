import PointModel from './model/point-model.js';
import Presenter from './presenter/presenter.js';
import {generateFilter} from './mock/filter.js';
import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';


const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = document.querySelector('.trip-events');
const siteFiltersElement = document.querySelector('.trip-controls__filters');
const pointsModel = new PointModel();
const boardPresenter = new Presenter({boardContainer: siteMainElement, bodyContainer: siteHeaderElement, pointsModel});

const filters = generateFilter(pointsModel.points);

render(new FilterView({filters}), siteFiltersElement);


boardPresenter.init();
