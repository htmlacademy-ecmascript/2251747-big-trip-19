
import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click «+ New event» to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

function createListEmptyTemplate(filterType) {
  const noEventsTextType = NoEventsTextType[filterType];
  return (
    `
     <p class="trip-events__msg"> ${noEventsTextType}</p>`

  ) ;
}

export default class ListEmptyView extends AbstractView{
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#filterType);
  }
}
