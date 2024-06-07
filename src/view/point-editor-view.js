import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EVENT_TYPES, CITIES, DateFormat } from '../const.js';
import { toCapitalize, formatDate } from '../utils.js';

const createEventTypeTemplate = (types, currentType) =>
  types.reduce(
    (markup, type) => `${markup}
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${
  type === currentType ? 'checked' : ''
}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${toCapitalize(
  type
)}</label>
  </div>`,
    ''
  );

const createCitiesTemplate = (cities) =>
  cities.reduce(
    (markup, city) =>
      `${markup}<option value="${toCapitalize(city)}"></option>`,
    ''
  );

const createOffersTemplate = (offers, pointOffers) => {
  const items = offers.reduce(
    (markup, { id, title, price }) => `${markup}
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${id}" ${
  pointOffers.find((offer) => offer === id) ? 'checked' : ''
}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`,
    ''
  );
  if (offers.length > 0) {
    return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${items}
      </div>
    </section>
    `;
  } else {
    return '';
  }
};

const createDestinationPhotosTemplate = (destination) => {
  const photos = destination.pictures.reduce(
    (markup, { src, description }) => `${markup}
  <img class="event__photo" src="${src}" alt="${description}">`,
    ''
  );

  if (destination.pictures.length > 0) {
    return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${photos}
      </div>
    </div>
    `;
  } else {
    return '';
  }
};

function createPointEditorTemplate({ point, pointDestination, pointOffers }) {
  const { type, basePrice, dateFrom, dateTo, offers } = point;
  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeTemplate(EVENT_TYPES, type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${toCapitalize(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
  pointDestination.name
}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createCitiesTemplate(CITIES)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(
    dateFrom,
    DateFormat.WITH_DELIMITER
  )}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(
    dateTo,
    DateFormat.WITH_DELIMITER
  )}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersTemplate(pointOffers, offers)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${
  pointDestination.description
}</p>

            ${createDestinationPhotosTemplate(pointDestination)}
          </section>
        </section>
      </form>
    </li>`;
}

export default class PointEditorView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  #onCloseClick = null;
  #onSubmitForm = null;

  constructor({ point, destinations, offers, onCloseClick, onSubmitForm }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onCloseClick = onCloseClick;
    this.#onSubmitForm = onSubmitForm;

    this._setState(this.#point);
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);
    this.element
      .querySelector('.event.event--edit')
      .addEventListener('submit', this.#saveClickHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
  }

  get template() {
    return createPointEditorTemplate({
      point: this._state,
      pointDestination: this.#destinations.find(
        ({ id }) => id === this._state.destination
      ),
      pointOffers: this.#offers.find(({ type }) => type === this._state.type)
        .offers,
    });
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitForm(this._state);
  };

  #eventTypeChangeHandler = (evt) => {
    this.#updatePoint('type', evt.target.value);
  };

  #destinationChangeHandler = (evt) => {
    const currentDestination = this.#destinations.find(
      (pointDestination) => pointDestination.name === evt.target.value
    );
    const currentDestinationId = currentDestination
      ? currentDestination.id
      : this._state.destination;

    this.#updatePoint('destination', currentDestinationId);
  };

  #offersChangeHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this.#updatePoint('offers', checkedOffers.map((offer) => offer.id), true);
  };

  #updatePoint = (key, value, skipRerender = false) => {
    if (skipRerender) {
      this._setState({ ...this._state, [key]: value });
    } else {
      this.updateElement({ ...this._state, [key]: value });
    }
  };
}
