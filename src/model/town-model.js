import {getRandomTowns} from '../mock/offer-point-town.js';

export default class TownModel {
  #towns = getRandomTowns();

  init() {
    this.#towns = getRandomTowns();
  }

  get towns() {
    return this.#towns;
  }
}
