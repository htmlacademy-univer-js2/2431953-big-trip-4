import AbstractView from '../framework/view/abstract-view.js';
import {humanizeEventTime } from '../utils.js';

const MIDDLE_SHORT_EVENTS_COUNT = 2;
const MAX_SHORT_EVENTS_COUNT = 3;

const getTripTitle = (tripEvents) => {
  switch(tripEvents.length) {
    case 1:
      return tripEvents[0].destination.name;

    case MIDDLE_SHORT_EVENTS_COUNT:
      return `${tripEvents[0].destination.name} &mdash; ${tripEvents[tripEvents.length - 1].destination.name}`;

    case MAX_SHORT_EVENTS_COUNT:
      return `${tripEvents[0].destination.name} &mdash; ${tripEvents[1].destination.name} &mdash; ${tripEvents[tripEvents.length - 1].destination.name}`;

    default:
      return `${tripEvents[0].destination.name} &mdash; . . . &mdash; ${tripEvents[tripEvents.length - 1].destination.name}`;
  }
};

const createTripInfoTemplate = (tripEvents, tripPrice) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripTitle(tripEvents)}</h1>
      <p class="trip-info__dates">${humanizeEventTime(tripEvents[0].dateFrom, 'MMM D')}&nbsp;&mdash;&nbsp;${humanizeEventTime(tripEvents[tripEvents.length - 1].dateTo, 'MMM D')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView{
  #tripEvents = null;
  #tripPrice = null;

  constructor(tripEvents, tripPrice) {
    super();
    this.#tripEvents = tripEvents;
    this.#tripPrice = tripPrice;
  }

  get template() {
    return createTripInfoTemplate(this.#tripEvents, this.#tripPrice);
  }
}
