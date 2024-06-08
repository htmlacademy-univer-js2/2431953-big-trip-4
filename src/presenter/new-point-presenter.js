import PointFormEditView from "../view/point-form-edit-view.js";
import { render, remove, RenderPosition } from "../framework/render.js";
import { UpdateType, UserAction, POINT_TYPES } from "../const.js";
import { isEscapeButton } from "../utils.js";
import dayjs from "dayjs";

export default class NewPointPresenter {
  #pointsListContainer = null;
  #addFormComponent = null;
  #offersByType = null;
  #destinations = null;
  #changeData = null;
  #destroyCallback = null;

  constructor(pointsListContainer, offersByType, destinations, changeData) {
    this.#pointsListContainer = pointsListContainer;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#changeData = changeData;
  }

  init(destroyCallback) {
    this.#destroyCallback = destroyCallback;
    this.#renderAddFormComponent();
  }

  destroy() {
    if (this.#addFormComponent === null) {
      remove(this.#addFormComponent);
    }
    this.#destroyCallback?.();
    remove(this.#addFormComponent);
    this.#addFormComponent = null;
    document.removeEventListener("keydown", this.#escapeKeyDownHandler);
  }

  #renderAddFormComponent() {
    if (this.#addFormComponent !== null) {
      return;
    }
    this.#addFormComponent = new PointFormEditView(
      this.#offersByType,
      this.#destinations,
      this.#generateDefaultTripEvent(),
      true
    );
    this.#addFormComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#addFormComponent.setFormDeleteHandler(this.#cancelButtonClickHandler);
    render(
      this.#addFormComponent,
      this.#pointsListContainer,
      RenderPosition.AFTERBEGIN
    );
    document.addEventListener("keydown", this.#escapeKeyDownHandler);
  }

  #generateDefaultTripEvent() {
    return {
      basePrice: 0,
      dateFrom: dayjs().toString(),
      dateTo: dayjs().toString(),
      destination: this.#destinations[0].id,
      isFavorite: false,
      offers: [],
      type: POINT_TYPES[0],
    };
  }

  #formSubmitHandler = (tripEvent) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, tripEvent);
  };

  #escapeKeyDownHandler = (evt) => {
    if (isEscapeButton(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #cancelButtonClickHandler = () => {
    this.destroy();
  };
}
