import {FilterType} from '../const.js';
import {isEventFuture, isEventPresent, isEventPast} from '../utils/event.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.dateFrom)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventPresent(event.dateFrom, event.dateTo)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.dateTo)),
};

export {filter};
