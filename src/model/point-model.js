import TownModel from '../model/town-model.js';
import OfferModel from '../model/offer-model.js';
import Observable from '../framework/observable.js';

export default class PointModel extends Observable{
  #points = [];
  #town = new TownModel().towns;
  #offers = new OfferModel().offers;

  init(points) {
    this.#points = points;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#town;
  }

  get offers() {
    return this.#offers;
  }

  addTripEvent = (updateType, updatedItem) => {
    this.#points = [updatedItem, ...this.#points];

    this._notify(updateType, updatedItem);
  };

  updateTripEvent = (updateType, updatedItem) => {
    const updatedItemIndex = this.#points.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    this.#points = [...this.#points.slice(0, updatedItemIndex), updatedItem, ...this.#points.slice(updatedItemIndex + 1)];

    this._notify(updateType, updatedItem);
  };

  deleteTripEvent = (updateType, updatedItem) => {
    const updatedItemIndex = this.#points.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    this.#points = [...this.#points.slice(0, updatedItemIndex), ...this.#points.slice(updatedItemIndex + 1)];

    this._notify(updateType);
  };
}

