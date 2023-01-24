import {getRandomWaypoint, OffersByType, createDestination} from '../mock/waypoint.js';
import Observable from '../framework/observable.js';

const POINT_COUNT = 5;
const DESTINATION_COUNT = 5;

export default class PointModel extends Observable{
  #points = Array.from({length: POINT_COUNT},(el, i) => getRandomWaypoint(DESTINATION_COUNT, i));
  #destinations = Array.from({length: DESTINATION_COUNT}, createDestination);
  #offersByType = OffersByType;

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByType() {
    return this.#offersByType;
  }
}
