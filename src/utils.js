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

const isPast = (date, dateFrom = dayjs()) => dayjs(dateFrom).isAfter(dayjs(date));

const isFuture = (date) => dayjs().isBefore(dayjs(date)) || dayjs().isSame(dayjs(date));

const areDatesSame = (oldDate, newDate) => dayjs(oldDate).isSame(dayjs(newDate));


//Filter
const filter = {
  [FilterType.EVERYTHING] : (points) => points,
  [FilterType.FUTURE] : (points) => points.filter((point) => isFuture(point.dateFrom)),
  [FilterType.PRESENT] : (points) => points.filter((point) => isPast(point.dateFrom) && isFuture(point.dateTo)),
  [FilterType.PAST] : (points) => points.filter((point) => isPast(point.dateTo)),
};


//Sorting
const sortPricePoint = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortDayPoint = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortTimePoint = (pointA, pointB) => {
  const timePointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timePointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timePointB - timePointA;
};

const sortPoints = {
  [SortType.DAY]: (points) => points.sort(sortDayPoint),
  [SortType.TIME]: (points) => points.sort(sortTimePoint),
  [SortType.PRICE]: (points) => points.sort(sortPricePoint),
};

const MessagesByFilterType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

//Other
const isEscapeButton = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export { isEscapeButton, updateItem, areDatesSame, filter, sortPoints, humanizeEventTime, isPast, isFuture, getTimeDifference, FilterType, MessagesByFilterType };
