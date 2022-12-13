import {createElement} from '../render.js';

const BLANK_POINT = {
  destination: null,
  price: null,
  dateFrom: null,
  dateTo: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: 'Taxi'
};


function createEventEditTemplate({point, allOffersByType, allDestinations}) {
  const destination = allDestinations.find((d) => d.id === point.destination);
  const typesList = allOffersByType.map((item) => item.type);
  const offersForPointType = allOffersByType.find((o) => o.type === point.type);
  const offerList = offersForPointType ? offersForPointType.offers : [];

  const createEventEditTypeListTemplete = typesList.map((type) =>
    `<div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${type === point.type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`
  );
  const citiesList = allDestinations.map((item) => item.name);
  const createEventEditCitiesListTemplete = citiesList.map((name) =>
    `<option value="${name}"></option>`
  );
  const offersList = offerList.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${point.offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
  const picturesList = destination ? destination.pictures : [];
  const createEventEditPicListTemplete = picturesList.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="Event photo">`
  );
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${createEventEditTypeListTemplete.join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.destination || ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createEventEditCitiesListTemplete.join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point.dateFrom || ''}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point.dateTo || ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price || ''}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersList.join('')}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination ? destination.description : ''}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createEventEditPicListTemplete.join('')}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
}

export default class EventEdit {
  constructor({point = BLANK_POINT, allOffersByType, allDestinations}) {
    this.point = point;
    this.allOffersByType = allOffersByType;
    this.allDestinations = allDestinations;
  }

  getTemplate() {
    return createEventEditTemplate({point: this.point, allDestinations: this.allDestinations, allOffersByType: this.allOffersByType});
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
