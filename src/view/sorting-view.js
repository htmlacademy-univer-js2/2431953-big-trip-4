import { SORTING_COLUMNS } from '../const.js';
import RadiosListView from './radios-list-view.js';

function createSortingItemTemplate(column) {
  const { type, label, active, defaultSelected } = column;
  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}" ${!active ? 'disabled' : ''} ${defaultSelected ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${type}">${label}</label>
    </div>`;
}

function createSortingTemplate() {
  return `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${SORTING_COLUMNS.map(createSortingItemTemplate).join('')}
  </form>`;
}

export default class SortingView extends RadiosListView {
  constructor() {
    super({ items: SORTING_COLUMNS });
  }

  get template() {
    return createSortingTemplate();
  }
}
