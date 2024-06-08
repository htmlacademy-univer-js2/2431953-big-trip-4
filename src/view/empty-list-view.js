import AbstractView from '../framework/view/abstract-view';
import { MessagesByFilterType } from '../utils.js';

const createEmptyListTemplate = (filterType) => `<p class="trip-events__msg">${MessagesByFilterType[filterType]}</p>`;

export default class EmptyListView extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
