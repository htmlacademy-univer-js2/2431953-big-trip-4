import FormEditView from '../view/form-edit-view.js';
import TripPointView from '../view/trip-point-view.js';
import { render, replace, remove, } from '../framework/render.js';
import { Mode, UpdateType, UserAction } from '../const.js';
import { isEscapeButton, areDatesSame } from '../utils.js';

export default class PointPresenter {
  #changeData = null;
  #changeMode = null;
  #container = null;
  #offersByType = null;
  #destinations = null;
  #offers = null;
  #point = null;
  #previewPointComponent = null;
  #editingPointComponent = null;
  #mode = Mode.DEFAULT;
  #tripEventComponent = null;
  #editFormComponent = null;

  constructor (container, offersByType, onDataChange, onModeChange) {
    this.#container = container;
    this.#offersByType = offersByType;
    this.#changeData = onDataChange;
    this.#changeMode = onModeChange;
    this.#mode = Mode.DEFAULT;
  }

  init(point) {
    this.#point = point;
    this.#renderTripEventComponent();
  }

  #renderTripEventComponent() {
    const prevPreviewPointComponent = this.#tripEventComponent;
    const prevEditingPointComponent = this.#editFormComponent;

    this.#previewPointComponent = new TripPointView(this.#point, this.#offersByType);
    this.#renderEditFormComponent();
    this.#tripEventComponent.setFormOpenClickHandler(this.#onFormOpenButtonClick);
    this.#tripEventComponent.setFavoriteButtonHandler(this.#onFavoriteChangeClick);

    if (prevPreviewPointComponent === null || prevEditingPointComponent === null) {
      render(this.#previewPointComponent, this.#container);
      return;
    }

    switch (this.#mode) {
      case Mode.DEFAULT:
        replace(this.#previewPointComponent, prevPreviewPointComponent);
        break;
      case Mode.EDITING:
        replace(this.#editingPointComponent, prevEditingPointComponent);
        break;
    }

    remove(prevPreviewPointComponent);
    remove(prevEditingPointComponent);
  }

  destroy = () => {
    remove(this.#previewPointComponent);
    remove(this.#editingPointComponent);
  };

  resetView = () => {
    if (this.#mode === Mode.EDITING) {
      this.#replaceEditingPointToPreviewPoint();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeButton(evt)) {
      evt.preventDefault();
      this.#editingPointComponent.reset(this.#point);
      this.#replaceEditingPointToPreviewPoint();
    }
  };

  #renderEditFormComponent() {
    this.#editFormComponent = new FormEditView(this.#offersByType, this.#point);

    this.#editFormComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#editFormComponent.setFormCloseClickHandler(this.#onFormCloseButtonClick);
    this.#editFormComponent.setFormDeleteHandler(this.#onDeleteButtonClick);
  }

  #replacePreviewPointToEditingPoint = () => {
    replace(this.#editingPointComponent, this.#previewPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditingPointToPreviewPoint = () => {
    this.#editFormComponent.reset(this.#point);
    replace(this.#previewPointComponent, this.#editingPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #onFormOpenButtonClick = () => {
    this.#replacePreviewPointToEditingPoint();
  };

  #onFormCloseButtonClick = () => {
    this.#replaceEditingPointToPreviewPoint();
  };

  #onFormSubmit = (point) => {
    const isMinorUpdate = !areDatesSame(this.#point.dateFrom, point.dateFrom)
      || !areDatesSame(this.#point.dateTo, point.dateTo)
      || this.#point.basePrice !== point.basePrice;
    this.#changeData(UserAction.UPDATE_TRIP_EVENT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, point);
    this.#renderEditFormComponent();
  };

  #onFavoriteChangeClick = () => {
    this.#changeData(UserAction.UPDATE_TRIP_EVENT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onDeleteButtonClick = (tripEvent) => {
    this.#changeData(UserAction.DELETE_TRIP_EVENT, UpdateType.MINOR, tripEvent);
  };
}
