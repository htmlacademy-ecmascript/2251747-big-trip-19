import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const DATE_FORMAT_HM = 'HH[:]mm';
const DATE_FORMAT_MD = 'MMM D';

function humanizeDateHM(date) {
  return date ? dayjs(date).format(DATE_FORMAT_HM) : '';
}

function humanizeDateMD(date) {
  return date ? dayjs(date).format(DATE_FORMAT_MD) : '';
}

function durationMinimized (dateFrom, dateTo) {
  const to = dayjs(dateFrom);
  const from = dayjs(dateTo);
  return dayjs.duration(from.diff(to)).format('D[D] HH[H] mm[M]').replace('0D ', '').replace('00H ', '').replace('00M', '');
}

function isPointPresent(dateFrom, dateTo) {
  return (dayjs(dateFrom).isSame(dayjs(), 'D') || dayjs(dateFrom).isBefore(dayjs(), 'D')) && (dayjs(dateTo).isSame(dayjs(), 'D') || dayjs(dateTo).isAfter(dayjs(), 'D'));
}

function isPointFuture(date) {
  return date && dayjs(date).isAfter(dayjs(), 'D');
}

function isPointPast(date) {
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


export {humanizeDateHM, humanizeDateMD, getDuration, getDestinationById, getOffersByType, getPointOffers, isPointFuture, isPointPresent, isPointPast, durationMinimized};
