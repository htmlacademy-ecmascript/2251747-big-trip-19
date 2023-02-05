import AbstractView from '../framework/view/abstract-view.js';
import { sortDateFrom, sortDateTo } from '../utils/sort.js';
import {humanizeDateMD} from '../utils/point.js';

function createBoardTemplate(points, offersByType) {

  const firstPoint = points?.sort(sortDateFrom)[0];
  const lastPoint = points?.sort(sortDateTo)[0];
  let price = 0;
  points?.forEach((point) => {
    price += point.price;
    const allPointOffers = offersByType.find((offer) => offer.type === point.type).offers;
    const pointActiveOffers = allPointOffers.filter((offer) => point.offers.includes(offer.id));
    pointActiveOffers.forEach((activeOffer) => {
      price += activeOffer.price;
    });
  });
  return (
    `<section class="trip-main__trip-info  trip-info">
      ${points?.length > 0 ? `<div class="trip-info__main">
      <h1 class="trip-info__title">${firstPoint?.name} &mdash; ${points.length === 3 ? points[1].name : '...' } &mdash; ${lastPoint?.name}</h1>

      <p class="trip-info__dates">${humanizeDateMD(firstPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDateMD(lastPoint.dateTo)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>` : ''}
    </section>`
  );
}

export default class BoardView extends AbstractView {
  #points = null;
  #initNewPoint = null;
  #offersByType = null;

  constructor(points, initNewPoint, offersByType) {
    super();
    this.#points = points;
    this.#initNewPoint = initNewPoint;
    this.#offersByType = offersByType;
  }

  init() {
    document.querySelector('.trip-main__event-add-btn').addEventListener('click',this.#initNewPoint);
  }

  destroy() {
    document.querySelector('.trip-main__event-add-btn').removeEventListener('click',this.#initNewPoint);
  }

  get template() {
    return createBoardTemplate(this.#points, this.#offersByType);
  }
}
