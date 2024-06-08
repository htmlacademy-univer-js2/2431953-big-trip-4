import dayjs from 'dayjs';
import { FilterType, SortType } from './const.js';

const MAX_MINUTES_IN_HOUR = 60;
const MAX_HOURS_IN_DAY = 24;

const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const transformTimeDifference = (difference) => {
  let format = 'DD[D] HH[H] mm[M]';

  if(difference < MAX_MINUTES_IN_HOUR){
    format = 'mm[M]';
  }
  else if (difference / MAX_MINUTES_IN_HOUR < MAX_HOURS_IN_DAY) {
    format = 'HH[H] mm[M]';
  }
  return humanizeEventTime(dayjs()
    .date(difference / (MAX_MINUTES_IN_HOUR * MAX_HOURS_IN_DAY))
    .hour((difference / MAX_MINUTES_IN_HOUR) % MAX_HOURS_IN_DAY)
    .minute(difference % MAX_MINUTES_IN_HOUR), format);
};

const getTimeDifference = (dateFrom, dateTo) => transformTimeDifference(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

const isPast = (date, unit, dateFrom = dayjs()) => dayjs(dateFrom).isAfter(dayjs(date), unit);

const isFuture = (date, unit) => dayjs().isBefore(dayjs(date), unit) || dayjs().isSame(dayjs(date), unit);

const areDatesSame = (oldDate, newDate) => dayjs(oldDate).isSame(dayjs(newDate));

//Random
function getRandomValue (minimum = 1, maximum = 1000) { //нужно всплытие
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
}

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];


//Filter
const filter = {
  [FilterType.EVERYTHING] : (points) => points,
  [FilterType.FUTURE] : (points) => points.filter((point) => isFuture(point.dateFrom, 'D') || isFuture(point.dateTo, 'D')),
  [FilterType.PAST] : (points) => points.filter((point) => isPast(point.dateTo, 'D') || isPast(point.dateFrom, 'D')),
  [FilterType.PRESENT] : (points) => points.filter((point) => isPast(point.dateTo, 'D') && isFuture(point.dateFrom, 'D')),
};


//Sorting
const sortPricePoint = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortDayPoint = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortTimePoint = (pointA, pointB) => {
  const timePointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timePointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timePointB - timePointA;
};

const sortTripEvents = {
  [SortType.DAY]: (points) => points.sort(sortDayPoint),
  [SortType.TIME]: (points) => points.sort(sortTimePoint),
  [SortType.PRICE]: (points) => points.sort(sortPricePoint),
};


//Other
const isEscapeButton = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const capitalizeString = (string) => {
  const capFirstString = string[0].toUpperCase();
  const restOfString = string.slice(1);
  return capFirstString + restOfString;
};


let dates = dayjs().subtract(getRandomValue(0, 31), 'day').toDate();
const getTempDate = ({flag}) => {
  const minsGap = getRandomValue(0, 60 - 1);
  const hoursGap = getRandomValue(0, 24 - 1);
  if (flag) {
    dates = dayjs(dates).add(minsGap, 'minute').add(hoursGap, 'hour').toDate();
  }
  return dates;
};


export {getRandomArrayElement, getRandomValue, isEscapeButton, updateItem,
  sortDayPoint, sortPricePoint, sortTimePoint, capitalizeString,
  getTempDate, areDatesSame, filter, sortTripEvents, humanizeEventTime, isPast, getTimeDifference, FilterType };
