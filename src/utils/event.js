import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const DATE_FORMAT = 'D MMMM';

function humanizeDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function isEventPresent(dateFrom, dateTo) {
  return (dayjs(dateFrom).isSame(dayjs(), 'D') || dayjs(dateFrom).isBefore(dayjs(), 'D')) && (dayjs(dateTo).isSame(dayjs(), 'D') || dayjs(dateTo).isAfter(dayjs(), 'D'));
}

function isEventFuture(date) {
  return date && dayjs(date).isAfter(dayjs(), 'D');
}

function isEventPast(date) {
  return date && dayjs(date).isBefore(dayjs(), 'D');
}

function getDuration(fromDate, toDate) {
  const to = dayjs(toDate);
  const from = dayjs(fromDate);
  return dayjs.duration(to.diff(from)).humanize();
}

function getDestinationById(id, allDestinations) {
  return allDestinations.find((d) => d.id === id);
}

function getOffersByType(type, allOffers) {
  return allOffers.find((offer) => offer.type === type).offers;
}

function getPointOffers(pointOfferIds, offersByType) {
  return offersByType.filter((offer) => pointOfferIds.includes(offer.id));
}

export {humanizeDate, getDuration, getDestinationById, getOffersByType, getPointOffers, isEventFuture, isEventPresent, isEventPast};
