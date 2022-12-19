import {getRandomWaypoint, OffersByType, createDestination} from '../mock/waypoint.js';

const POINT_COUNT = 5;
const DESTINATION_COUNT = 5;

export default class PointModel {
  #points = Array.from({length: POINT_COUNT},(el, i) => getRandomWaypoint(DESTINATION_COUNT, i));
  #destinations = Array.from({length: DESTINATION_COUNT}, createDestination);
  #offersByType = OffersByType;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByType() {
    return this.#offersByType;
  }
}
