import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filterType = null;

  constructor() {
    super();
    this.#filterType = FilterType.EVERYTHING;
  }

  get filterType() {
    return this.#filterType;
  }

  setFilterType(updateType, filterType) {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  }
}
