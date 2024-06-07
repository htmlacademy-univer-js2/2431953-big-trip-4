import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import {
  MSEC_IN_HOUR,
  MSEC_IN_DAY,
  DateFormat,
  DurationFormat
} from './const.js';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];
const getRandomPositiveNumber = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
const getRandomDate = (start = new Date(2022, 0, 1), end = new Date()) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const formatDate = (currentDate, format = DateFormat.FULL) => dayjs(currentDate).format(format);

const calculateDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration;

  switch (true) {
    case (diff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(diff).format(DurationFormat.DAYS);
      break;
    case (diff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(diff).format(DurationFormat.HOURS);
      break;
    case (diff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(diff).format(DurationFormat.MINS);
      break;
  }

  return pointDuration;
};

const incrementCounter = (START_FROM) => {
  let counterStart = START_FROM;
  return function() {
    return counterStart++;
  };
};

const toCapitalize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

export {
  getRandomArrayElement,
  getRandomPositiveNumber,
  getRandomDate,
  formatDate,
  calculateDuration,
  incrementCounter,
  toCapitalize,
};
