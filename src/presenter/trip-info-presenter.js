import {
  render,
  RenderPosition
} from '../framework/render.js';

import TripInfoView from '../view/trip-info-view.js';

const tripMainContainer = document.querySelector('.trip-main');

export default class TripInfoPresenter {
  init() {
    render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
  }
}
