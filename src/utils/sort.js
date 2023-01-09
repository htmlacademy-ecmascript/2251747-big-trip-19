import dayjs from 'dayjs';

function sortDay(pointA, pointB) {
  return dayjs(pointB.dateFrom).valueOf() - dayjs(pointA.dateFrom).valueOf();
}

function sortTime(pointA, pointB) {

  return (dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)));
}

function sortPrice(pointA,pointB) {
  return pointB.price - pointA.price;
}

export {sortDay, sortTime, sortPrice};
