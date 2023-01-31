import AbstractView from '../framework/view/abstract-view.js';
import { sortDateFrom, sortDateTo } from '../utils/sort.js';
import {humanizeDate} from '../utils/event.js';

function createBoardTemplate(points) {
  const firstPoint = points?.sort(sortDateFrom)[0];
  const lastPoint = points?.sort(sortDateTo)[points.length - 1];
  let price = 0;
  points?.forEach((element) => {
    price += element.price;
  });
  return (
    `<section class="trip-main__trip-info  trip-info">
      ${points?.length > 0 ? `<div class="trip-info__main">
      <h1 class="trip-info__title">${firstPoint?.name} &mdash; ${points.length === 3 ? points[1].name : '...' } &mdash; ${lastPoint?.name}</h1>

      <p class="trip-info__dates">${humanizeDate(firstPoint.dateFrom)}&nbsp;&mdash;&nbsp;${humanizeDate(firstPoint.dateTo)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>` : ''}
    </section>`
  );
}

export default class BoardView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createBoardTemplate(this.#points);
  }
}
