import {
  DateFormat,
} from '../const.js';
import {
  calculateDuration,
  formatDate
} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const createOffersListMarkup = (pointOffers, typeOffers) => pointOffers
  .map((pointOfferId) => {
    if (pointOffers.length && typeOffers.length) {
      const selectedOffer = typeOffers.filter((offer) => offer.id === pointOfferId)[0];
      return `<li class="event__offer">
          <span class="event__offer-title">${selectedOffer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${selectedOffer.price}</span>
        </li>`;
    }
  })
  .join('');


function createPointTemplate(eventPoint, typeOffers, destination) {
  const {
    type,
    basePrice,
    isFavorite,
    dateFrom,
    dateTo,
    offers
  } = eventPoint;
  const duration = calculateDuration(dateFrom, dateTo);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${formatDate(dateFrom, DateFormat.SHORT)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${formatDate(dateFrom, DateFormat.TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${formatDate(dateTo, DateFormat.TIME)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${createOffersListMarkup(offers, typeOffers)}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #eventPoint = null;
  #destination = null;
  #offers = null;
  #onEditClick = null;
  #onFavoriteToggle = null;

  constructor({
    point,
    offers,
    destination,
    onEditClick,
    onFavoriteToggle,
  }) {
    super();
    this.#eventPoint = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#onEditClick = onEditClick;
    this.#onFavoriteToggle = onFavoriteToggle;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteToggleHandler);
  }

  get template() {
    return createPointTemplate(this.#eventPoint, this.#offers, this.#destination);
  }


  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteToggleHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteToggle(!this.#eventPoint.isFavorite);
  };
}
