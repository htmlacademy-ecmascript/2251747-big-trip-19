//import NewEventButtonView from './view/new-event-button-view.js';
//import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';


const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: siteMainElement, bodyContainer: siteHeaderElement});

boardPresenter.init();
