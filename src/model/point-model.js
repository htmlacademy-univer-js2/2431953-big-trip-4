import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointModel extends Observable{
  #pointApiService = null;
  #points = [];

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
  }

  async init () {
    try {
      const points = await this.#pointApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  async addPoint(updateType, newItem) {
    try {
      const response = await this.#pointApiService.createPoint(newItem);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newItem);
    } catch(err) {
      throw new Error('Can\'t add trip event');
    }
  }

  async updatePoint(updateType, updatedItem) {
    const updatedItemIndex = this.#points.findIndex((item) => item.id === updatedItem.id);
    if(updatedItemIndex === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }
    try {
      const response = await this.#pointApiService.updatePoint(updatedItem);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [...this.#points.slice(0, updatedItemIndex), updatedPoint, ...this.#points.slice(updatedItemIndex + 1)];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update trip event');
    }
  }

  async deletePoint(updateType, deletingItem) {
    const updatedItemIndex = this.#points.findIndex((item) => item.id === deletingItem.id);
    if(updatedItemIndex === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }
    try {
      await this.#pointApiService.deletePoint(deletingItem);
      this.#points = [...this.#points.slice(0, updatedItemIndex), ...this.#points.slice(updatedItemIndex + 1)];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete trip event');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    return adaptedPoint;
  }
}

