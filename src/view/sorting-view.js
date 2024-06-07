import AbstractView from '../framework/view/abstract-view.js';

function createSortingItemTemplate(column) {
  const { type, label, active, defaultSelected } = column;
  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}" ${!active ? 'disabled' : ''} ${defaultSelected ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${type}">${label}</label>
    </div>`;
}

function createSortingTemplate(items) {
  return `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${items.map(createSortingItemTemplate).join('')}
  </form>`;
}

export default class SortingView extends AbstractView {
  #items = [];
  #onSortChange = null;

  constructor({
    items,
    onSortChange
  }) {
    super();

    this.#items = items;
    this.#onSortChange = onSortChange;
    this.element.addEventListener('change', this.#sortingChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#items);
  }

  #sortingChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onSortChange(evt.target.value);
  };
}
