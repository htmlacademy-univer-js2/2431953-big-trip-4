import {getRandomOffers} from '../mock/offer-point-town.js';

export default class OfferModel {
  #offers = getRandomOffers();

  constructor() {
    this.#offers = getRandomOffers();
  }

  get offers() {
    return this.#offers;
  }
}
