import {createElement} from '../render.js';
import {getDuration, humanizeDate} from '../utils.js';

function createEventItemTemplate(point, offers, destination) {

  const {dateFrom, dateTo, type, price} = point;

  const fromDate = humanizeDate(dateFrom);
  const toDate = humanizeDate(dateTo);
  const duration = getDuration(dateFrom, dateTo);

  const offersList = offers.map((offer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  );

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${fromDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${fromDate}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${toDate}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersList.join('')}
        </ul>
        <button class="event__favorite-btn event__favorite-btn--active" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}
export default class EventItemView {
  #element = null;
  #point = null;
  #offers = null;
  #destination = null;

  constructor({point, pointOffersByType, destination}) {
    this.#point = point;
    this.#offers = pointOffersByType;
    this.#destination = destination;
  }

  get template() {
    return createEventItemTemplate(this.#point, this.#offers, this.#destination);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
