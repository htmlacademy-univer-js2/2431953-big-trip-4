import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter) {
  const { type, label, defaultSelected, disabled } = filter;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${defaultSelected ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${label}</label>
    </div>`
  );
}

function createFiltersTemplate(filters) {

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map(createFilterItemTemplate).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #items = [];
  #onFilterChange = null;

  constructor({
    items,
    onFilterChange
  }) {
    super();

    this.#items = items;
    this.#onFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#onFilterChange);
  }

  get template() {
    return createFiltersTemplate(this.#items);
  }
}
