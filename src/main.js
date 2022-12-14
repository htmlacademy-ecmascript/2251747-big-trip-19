import PointModel from './model/point-model.js';
import Presenter from './presenter/presenter.js';


const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = document.querySelector('.trip-events');
const pointsModel = new PointModel();
const boardPresenter = new Presenter({boardContainer: siteMainElement, bodyContainer: siteHeaderElement, pointsModel});


boardPresenter.init();
