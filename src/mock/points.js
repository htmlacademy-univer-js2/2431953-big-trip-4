import {
  Price,
} from '../const.js';

import {
  getRandomDate,
  getRandomPositiveNumber,
} from '../utils.js';

const generatePoint = (type, destinationId, offerIds) => {
  const dateFrom = getRandomDate();
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomPositiveNumber(Price.MIN, Price.MAX),
    dateFrom: dateFrom.toISOString(),
    dateTo: getRandomDate(dateFrom).toISOString(),
    destination: destinationId,
    isFavorite: Boolean(getRandomPositiveNumber(0, 1)),
    offers: offerIds,
    type
  };
};

export {
  generatePoint,
};
