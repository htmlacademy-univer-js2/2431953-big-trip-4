import TripEventEditView from '../view/form-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction, POINT_TYPES } from '../const.js';
import { isEscapeButton } from '../utils.js';
import dayjs from 'dayjs';

export default class TripEventNewPresenter {
  #tripEventsListContainer;
  #addFormComponent = null;

  #offersByType;
  #destinations;

  #changeData;
  #destroyCallback = null;

  constructor(tripEventsListContainer, offersByType, destinations, changeData) {
    this.#tripEventsListContainer = tripEventsListContainer;

    this.#offersByType = offersByType;
    this.#destinations = destinations;

    this.#changeData = changeData;
  }

  init(destroyCallback) {
    this.#destroyCallback = destroyCallback;

    this.#renderAddFormComponent();
  }

  destroy() {
    if(this.#addFormComponent === null) {
      remove(this.#addFormComponent);
    }

    this.#destroyCallback?.();

    remove(this.#addFormComponent);
    this.#addFormComponent = null;

    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  }

  #getDefaultTripEvent() {
    return {
      id: 0,
      basePrice: 0,
      dateFrom: dayjs().toString(),
      dateTo: dayjs().toString(),
      destination: this.#destinations[0],
      isFavorite: false,
      offers: [],
      type: POINT_TYPES[0],
    };
  }

  #renderAddFormComponent() {
    if(this.#addFormComponent !== null) {
      return;
    }

    this.#addFormComponent = new TripEventEditView(this.#offersByType, this.#getDefaultTripEvent(), true);

    this.#addFormComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#addFormComponent.setFormDeleteHandler(this.#onCancelButtonClick);

    render(this.#addFormComponent, this.#tripEventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscapeKeyDown);
  }

  #onFormSubmit = (tripEvent) => {
    this.#changeData(UserAction.ADD_TRIP_EVENT, UpdateType.MINOR, {id: crypto.randomUUID(), ...tripEvent});
    this.destroy();
  };

  #onEscapeKeyDown = (evt) => {
    if(isEscapeButton(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onCancelButtonClick = () => {
    this.destroy();
  };
}
