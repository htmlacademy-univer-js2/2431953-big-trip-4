import { getRandomArrayElement, getRandomPositiveInteger } from '../utils';
import { createRandomDates } from './dates';
import { POINT_TYPES, DESCRIPTIONS, DESTINATIONS_NAMES, tripPrice, offerPrice, OFFER_TITLES } from './constants';

const createPicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomPositiveInteger(0, 10)}`,
  description: getRandomArrayElement(DESCRIPTIONS),
});

const createDestination = (id) => ({
  id,
  description: getRandomArrayElement(DESCRIPTIONS),
  name: getRandomArrayElement(DESTINATIONS_NAMES),
  pictures: Array.from({ length: 4 }, createPicture)
});

const createOffer = (id) => ({
  id,
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomPositiveInteger(offerPrice.MIN, offerPrice.MAX)
});

const createPoint = (id) => {
  const randomDates = createRandomDates();
  return {
    basePrice: getRandomPositiveInteger(tripPrice.MIN, tripPrice.MAX),
    dateFrom: randomDates.dateFrom,
    dateTo: randomDates.dateTo,
    destination: createDestination(),
    id,
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    offers: createOffer(),
    type: getRandomArrayElement(POINT_TYPES)
  };
};

export { createPoint };
