import {
  render,
  RenderPosition
} from '../framework/render.js';

import TripInfoView from '../view/trip-info-view.js';


export default class TripInfoPresenter {
  #container = null;

  constructor(container) {
    this.#container = container;
  }

  init() {
    render(new TripInfoView(), this.#container, RenderPosition.AFTERBEGIN);
  }
}
