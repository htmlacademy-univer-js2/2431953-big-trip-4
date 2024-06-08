import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createSortingTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((sortType) => {
    const isDisabled = sortType === SortType.EVENT || sortType === SortType.OFFER ? 'disabled' : '';
    const isChecked = sortType === currentSortType ? 'checked' : '';
    return `<div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" data-sort-type="${sortType}" type="radio" name="trip-sort" value="sort-${sortType}" ${isDisabled} ${isChecked}>
        <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
      </div>`;}).join('')}
  </form>`
);

export default class SortingView extends AbstractView{
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
