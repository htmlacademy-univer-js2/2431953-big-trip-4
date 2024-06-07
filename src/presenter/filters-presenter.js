import {
  render
} from '../framework/render.js';

import FiltersView from '../view/filters-view.js';

const filtersContainer = document.querySelector('.trip-controls__filters');

export default class FiltersPresenter {

  init() {
    render(new FiltersView(), filtersContainer);
  }
}
