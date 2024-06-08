import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#points = this.#service.points;
  }

  get() {
    return this.#points;
  }

  add(point) {
    this.#points.push(point);
    this._notify(point);
  }

  delete(point) {
    this.#points = this.#points.filter((item) => item.id !== point.id);
    this._notify(point);
  }
}

