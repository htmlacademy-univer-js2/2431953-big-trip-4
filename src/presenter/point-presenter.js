import PointFormEditView from '../view/point-form-edit-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove, } from '../framework/render.js';
import { Mode, UpdateType, UserAction } from '../const.js';
import { isEscapeButton, areDatesSame } from '../utils.js';

export default class PointPresenter {
  #point = null;
  #pointMode = Mode.DEFAULT;
  #pointsListContainer = null;
  #pointsComponent = null;
  #editFormComponent = null;
  #offersByType = null;
  #destinations = null;
  #detinationNames = null;
  #changeData = null;
  #changePointMode = null;

  constructor(pointsListContainer, offersByType, destinations, destinationNames, changeData, changePointMode) {
    this.#pointsListContainer = pointsListContainer;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#detinationNames = destinationNames;
    this.#changeData = changeData;
    this.#changePointMode = changePointMode;
  }

  init(point) {
    this.#point = point;
    this.#renderPointComponent();
  }

  resetPointMode() {
    if(this.#pointMode === Mode.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointsComponent);
    remove(this.#editFormComponent);
  }

  setSaving() {
    if(this.#pointMode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isSaving: true,
        isDisabled: true,
      });
    }
  }

  setDeleting() {
    if(this.#pointMode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDeleting: true,
        isDisabled: true,
      });
    }
  }

  setAborting() {
    if(this.#pointMode === Mode.EDITING) {
      this.#editFormComponent.shake();
      return;
    }
    const resetEditFormState = () => {
      this.#editFormComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
    };
    this.#editFormComponent.shake(resetEditFormState);
  }

  #renderPointComponent() {
    const previousEventComponent = this.#pointsComponent;
    const previousEditFormComponent = this.#editFormComponent;
    this.#pointsComponent = new PointView(this.#point,
      this.#offersByType.length ? this.#offersByType.find((offer) => offer.type === this.#point.type).offers : [],
      this.#destinations.find((place) => place.id === this.#point.destination));
    this.#renderEditFormComponent();
    this.#pointsComponent.setFormOpenClickHandler(this.#formOpenButtonClickHandler);
    this.#pointsComponent.setFavoriteButtonHandler(this.#favoriteChangeClickHandler);
    if(previousEventComponent === null || previousEditFormComponent === null) {
      render(this.#pointsComponent, this.#pointsListContainer);
      return;
    }
    switch(this.#pointMode) {
      case Mode.DEFAULT:
        replace(this.#pointsComponent, previousEventComponent);
        break;
      case Mode.EDITING:
        replace(this.#pointsComponent, previousEditFormComponent);
        this.#pointMode = Mode.DEFAULT;
        break;
    }
    remove(previousEventComponent);
    remove(previousEditFormComponent);
  }

  #renderEditFormComponent() {
    this.#editFormComponent = new PointFormEditView(this.#offersByType, this.#destinations, this.#detinationNames, this.#point);
    this.#editFormComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#editFormComponent.setFormCloseClickHandler(this.#formCloseButtonClickHandler);
    this.#editFormComponent.setFormDeleteHandler(this.#deleteButtonClickHandler);
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointsComponent);
    document.addEventListener('keydown', this.#escapeKeyDownHandler);
    this.#changePointMode();
    this.#pointMode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    this.#editFormComponent.reset(this.#point);
    replace(this.#pointsComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escapeKeyDownHandler);
    this.#pointMode = Mode.DEFAULT;
  }

  #formOpenButtonClickHandler = () => {
    this.#replacePointToForm();
  };

  #formCloseButtonClickHandler = () => {
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (point) => {
    const isMinorUpdate = !areDatesSame(this.#point.dateFrom, point.dateFrom)
      || !areDatesSame(this.#point.dateTo, point.dateTo)
      || this.#point.basePrice !== point.basePrice;
    this.#changeData(UserAction.UPDATE_POINT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, point);
  };

  #escapeKeyDownHandler = (evt) => {
    if(isEscapeButton(evt)) {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #favoriteChangeClickHandler = () => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #deleteButtonClickHandler = (point) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };
}
