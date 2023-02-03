import dayjs from 'dayjs';

function sortDateFrom(pointA, pointB) {
  return dayjs(pointA.dateFrom).valueOf() - dayjs(pointB.dateFrom).valueOf();
}

function sortDateTo(pointA, pointB) {
  return dayjs(pointB.dateTo).valueOf() - dayjs(pointA.dateTo).valueOf();
}

function sortTime(pointA, pointB) {

  return (dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)));
}

function sortPrice(pointA,pointB) {
  return pointB.price - pointA.price;
}

export {sortDateFrom, sortDateTo, sortTime, sortPrice};
