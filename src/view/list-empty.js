
import {createElement} from '../render.js';

function createListEmptyTemplate() {
  return (
    `<main class="page-body__page-main  page-main">
      <div class="page-body__container">
        <section class="trip-events">
           <h2 class="visually-hidden">Trip events</h2>
           <p class="trip-events__msg">Click New Event to create your first point</p>
           <!--
             Значение отображаемого текста зависит от выбранного фильтра:
            * Everthing – 'Click New Event to create your first point'
            * Past — 'There are no past events now';
            * Present — 'There are no present events now';
            * Future — 'There are no future events now'.
           -->
        </section>
      </div>
    </main>`
  ) ;
}

export default class ListEmptyView {
  getTemplate() {
    return createListEmptyTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
