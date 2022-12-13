import {getRandomWaypoint, OffersByType, createDestination} from '../mock/waypoint.js';

const POINT_COUNT = 5;
const DESTINATION_COUNT = 5;

export default class PointModel {
  points = Array.from({length: POINT_COUNT},(el, i) => getRandomWaypoint(DESTINATION_COUNT, i));
  destinations = Array.from({length: DESTINATION_COUNT}, createDestination);
  offersByType = OffersByType;

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType() {
    return this.offersByType;
  }
}
