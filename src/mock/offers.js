import {
  Price
} from '../const.js';

import {
  getRandomPositiveNumber,
} from '../utils.js';

const generateOffer = (type) => ({
  id: crypto.randomUUID(),
  title: `Offer ${type}`,
  price: getRandomPositiveNumber(Price.MIN, Price.MAX),
});

export {
  generateOffer
};
