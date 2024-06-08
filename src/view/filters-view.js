import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) =>
  `<div class="trip-filters__filter">
    <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    ${filter.type === currentFilterType ? 'checked' : ''} ${filter.count === 0 ? 'disabled' : ''} value="${filter.name}">
    <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
  </div>`;

const createFiltersTemplate = (filterItems, currentFilterType) =>
  `<form class="trip-filters" action="#" method="get">
    ${filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#onFilterTypeChange);
  }

  #onFilterTypeChange = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
