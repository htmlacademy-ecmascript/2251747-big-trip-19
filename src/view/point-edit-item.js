import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const BLANK_POINT = {
  destination: null,
  price: null,
  dateFrom: new Date(),
  dateTo: new Date(),
  id: null,
  isFavorite: false,
  offers: [],
  type: 'taxi'
};


function createPointEditTemplate({point, allOffersByType, allDestinations, isNew,}) {
  const destination = allDestinations.find((d) => d.id === point.destination);
  const typesList = allOffersByType.map((item) => item.type);
  const offersForPointType = allOffersByType.find((o) => o.type === point.type);
  const offerList = offersForPointType ? offersForPointType.offers : [];

  const capitalizeFirstLetter = (string) => (string.charAt(0).toUpperCase() + string.slice(1));

  const createTypeListTemplete = typesList.map((type) =>
    `<div class="event__type-item">
    <input id="event-type-${type}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === point.type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${point.id}">${capitalizeFirstLetter(type)}</label>
    </div>`
  );
  const citiesList = allDestinations.map((item) => item.name);
  const createCitiesListTemplete = citiesList.map((name) =>
    `<option value="${he.encode(name)}">${he.encode(name)}</option>`
  );
  const offersList = offerList.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.title}-${point.id}" type="checkbox" name="event-offer-${offer.title}" ${point.offers.includes(offer.id) ? 'checked' : ''} value="${offer.id}">
      <label class="event__offer-label" for="event-offer-${offer.title}-${point.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
  const picturesList = destination ? destination.pictures : [];
  const createPicListTemplete = picturesList.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="Event photo">`
  );

  let resetButtonText;
  if (isNew) {
    resetButtonText = 'Cancel';
  } else {
    resetButtonText = point.isDeleting ? 'Deleting...' : 'Delete';
  }
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox" >

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${createTypeListTemplete.join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${point.id}">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${allDestinations.find((dest) => dest.id === point.destination)?.name || ''}" list="destination-list-${point.id}" required>
          <datalist id="destination-list-${point.id}">
            ${createCitiesListTemplete.join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${point.dateFrom || ''}" required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${point.dateTo || ''}" required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${point.id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${point.id}" type="number" name="event-price" value="${point.price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${point.isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">${resetButtonText}</button>
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
              ${createPicListTemplete.join('')}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
}

export default class PointEdit extends AbstractStatefulView{
  #datepickerFrom = null;
  #datepickerTo = null;
  #allDestinations = null;
  #allOffersByType = null;
  #arrowFormSubmit = null;
  #arrowFormReset = null;
  #handleDeleteClick = null;
  #isNew = null;

  constructor({point = BLANK_POINT, allOffersByType, allDestinations, onFormSubmit, onFormReset, onDeleteClick}) {
    super();
    this._setState(PointEdit.parsePointToState(point));
    this.#allOffersByType = allOffersByType;
    this.#allDestinations = allDestinations;
    this.#arrowFormSubmit = onFormSubmit;
    this.#arrowFormReset = onFormReset;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNew = point.id === null;
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({point: this._state, allDestinations: this.#allDestinations, allOffersByType: this.#allOffersByType, isNew: this.#isNew});
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      PointEdit.parsePointToState(point || BLANK_POINT),
    );
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.event__type-input').forEach((element) => {
      element.addEventListener('click', this.#typeChangeHandler);
    });
    this.element.querySelectorAll('.event__offer-selector').forEach((element) => {
      element.addEventListener('click', this.#offersChangeHandler);
    });

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('form')
      .addEventListener('reset', this.#formResetHandler);

    this.#setDatepicker();
  }

  #dateFromChangeHandler = (evt) => {
    const date = evt[0];
    this.updateElement({
      dateFrom: date,
    });
    this.#datepickerTo.minDate = date;
    if (dayjs(this._state.dateTo).isBefore(date)) {
      this.updateElement({
        dateTo: date
      });
    }
  };

  #dateToChangeHandler = (evt) => {
    this.updateElement({
      dateTo: evt[0],
    });
  };

  #setDatepicker() {
    if (this._state) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector(`#event-start-time-${this._state.id}`),
        {
          dateFormat: 'j/m/y H:i',
          defaultDate: this._state.dateFrom,
          enableTime: true,
          onChange: this.#dateFromChangeHandler,
        },
      );
      this.#datepickerTo = flatpickr(
        this.element.querySelector(`#event-end-time-${this._state.id}`),
        {
          dateFormat: 'j/m/y H:i',
          defaultDate: this._state.dateTo,
          enableTime: true,
          minDate: this._state.dateFrom,
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  }

  static parsePointToState(point) {
    return {...point,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  #offersChangeHandler = (evt) => {
    if (evt.target.className !== 'event__offer-checkbox visually-hidden') {
      return;
    }
    const selectedId = Number(evt.target.value);
    const newOffers = evt.target.checked ? [...this._state.offers, selectedId] : this._state.offers.filter((offerId) => offerId !== selectedId);
    this.updateElement({
      offers: newOffers
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#allDestinations.find((d) => d.name === evt.target.value).id
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      price: Number(evt.target.value)
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#arrowFormSubmit(this._state);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    if (this.#isNew) {
      this.#arrowFormReset();
    } else {
      this.#handleDeleteClick(this._state);
    }
  };

}
