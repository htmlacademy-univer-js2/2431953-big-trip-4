import AbstractView from '../framework/view/abstract-view.js';
import {humanizeEventTime } from '../utils.js';

const TWO_TITLE_EVENTS_COUNT = 2;
const THREE_TITLE_EVENTS_COUNT = 3;

const getTripTitle = (points, destinations) => {
  const firstDestinationName = destinations.find((place) => place.id === points[0].destination).name;
  const lastDestinationName = destinations.find((place) => place.id === points[points.length - 1].destination).name;
  switch(points.length) {
    case 1:
      return firstDestinationName;
    case TWO_TITLE_EVENTS_COUNT:
      return `${firstDestinationName} &mdash; ${lastDestinationName}`;
    case THREE_TITLE_EVENTS_COUNT:
      return `${firstDestinationName} &mdash; ${destinations.find((place) => place.id === points[1].destination).name} &mdash; ${lastDestinationName}`;
    default:
      return `${firstDestinationName} &mdash; . . . &mdash; ${lastDestinationName}`;
  }
};

const createTripInfoTemplate = (points, tripPrice, destinations) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripTitle(points, destinations)}</h1>
      <p class="trip-info__dates">${humanizeEventTime(points[0].dateFrom, 'MMM D')}&nbsp;&mdash;&nbsp;${humanizeEventTime(points[points.length - 1].dateTo, 'MMM D')}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView {
  #points;
  #tripPrice;
  #destinations;

  constructor(points, tripPrice, destinations) {
    super();
    this.#points = points;
    this.#tripPrice = tripPrice;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#tripPrice, this.#destinations);
  }
}
