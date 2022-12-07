import BoardView from '../view/board-view.js';
import FilterBorder from '../view/filter-border.js';
import EventItemView from '../view/event-item';
import {RenderPosition, render,} from '../render.js';
import EventEditList from '../view/event-edit-item.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  filterComponent = new FilterBorder();
  sortComponent = new SortView();
  eventEditListComponent = new EventEditList();
  eventsList = new EventsListView();

  constructor({boardContainer, bodyContainer}) {
    this.boardContainer = boardContainer;
    this.bodyContainer = bodyContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer, RenderPosition.AFTERBEGIN);
    render(this.filterComponent, this.boardContainer,);
    render(this.sortComponent, this.bodyContainer);
    render(this.eventsList, this.bodyContainer);
    render(this.eventEditListComponent, this.eventsList.getElement());
    // render(new EventEditView(), this.taskListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventItemView(), this.eventsList.getElement());
    }

  }
}
