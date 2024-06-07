import {
  generateDestination,
} from '../mock/destinations.js';
import {
  generateOffer
} from '../mock/offers.js';
import {
  generatePoint
} from '../mock/points.js';

import {
  CITIES,
  EVENT_TYPES,
  MocksMaxCount
} from '../const.js';

import {
  getRandomPositiveNumber,
  getRandomArrayElement,
} from '../utils.js';


export default class MockService {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    this.#destinations = this.#generateDestinations();
    this.#offers = this.#generateOffers();
    this.#points = this.#generatePoints();
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  #generateDestinations(){
    return CITIES.map(generateDestination);
  }

  #generateOffers(){
    return EVENT_TYPES.map((type) => ({
      type,
      offers: Array.from({
        length: getRandomPositiveNumber(1, MocksMaxCount.OFFERS)
      }, () => generateOffer(type))
    }));
  }

  #generatePoints() {
    return Array.from({
      length: getRandomPositiveNumber(0, MocksMaxCount.POINTS)
    }, () => {
      const type = getRandomArrayElement(EVENT_TYPES);
      const destination = getRandomArrayElement(this.#destinations);
      const offersByType = this.#offers.find((offerByType) => offerByType.type === type);

      const randomOffers = Array.from({
        length: getRandomPositiveNumber(0, offersByType.offers.length)
      }, () => getRandomArrayElement(offersByType.offers));

      const uniqueOffersIds = randomOffers.reduce((acc, current) => {
        if (acc.includes(current.id)) {
          return acc;
        }
        return [...acc, current.id];
      }, []);
      return generatePoint(type, destination.id, uniqueOffersIds);
    });
  }
}
