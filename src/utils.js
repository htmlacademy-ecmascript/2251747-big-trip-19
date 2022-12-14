import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const DATE_FORMAT = 'D MMMM';
function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min >= 0 && max > min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } return NaN;
}

function getRandomElements (sourceArray) {
  const result = [];
  for (let i = 0; i < getRandomInt(1, sourceArray.length); i++) {
    result.push(sourceArray[Math.floor(Math.random() * sourceArray.length)]);
  }
  return result;
}

function humanizeDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
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
export {getRandomArrayElement, getRandomInt, getRandomElements, humanizeDate, getDuration, getDestinationById, getOffersByType, getPointOffers};
