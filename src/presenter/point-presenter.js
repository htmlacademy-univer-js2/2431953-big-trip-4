import { remove, render, replace } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { PointMode } from '../const.js';

export default class PointPresenter {
  #container = null;
  #pointComponent = null;
  #pointEditorComponent = null;
  #point = null;
  #onPointChange = null;
  #onPointDelete = null;
  #onEditorOpen = null;
  #destinationsModel = null;
  #offersModel = null;
  #mode = PointMode.IDLE;

  constructor({
    container,
    destinationsModel,
    offersModel,
    onPointChange,
    onPointDelete,
    onEditorOpen,
  }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onPointChange = onPointChange;
    this.#onPointDelete = onPointDelete;
    this.#onEditorOpen = onEditorOpen;
  }

  init(point) {
    this.#point = point;

    this.#pointComponent = this.#createPointView();

    this.#pointEditorComponent = this.#createPointEditorView();

    if (this.#mode === PointMode.EDITABLE) {
      render(this.#pointEditorComponent, this.#container);
      return;
    }

    render(this.#pointComponent, this.#container);
  }

  update(point) {
    this.#point = point;

    const updatedPointComponent = this.#createPointView();

    const updatedEditorComponent = this.#createPointEditorView();

    if (this.#mode === PointMode.EDITABLE) {
      replace(updatedEditorComponent, this.#pointEditorComponent);
    } else {
      replace(updatedPointComponent, this.#pointComponent);
    }

    this.#pointComponent = updatedPointComponent;
    this.#pointEditorComponent = updatedEditorComponent;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditorComponent);
  }

  resetView() {
    if (this.#mode !== PointMode.IDLE) {
      this.#replaceEditorByPoint();
    }
  }

  #createPointView() {
    return new PointView({
      point: this.#point,
      destination: this.#destinationsModel.getById(this.#point.destination),
      offers: this.#offersModel.getByType(this.#point.type),
      onEditClick: this.#pointEditHandler,
      onFavoriteToggle: this.#pointFavoriteToggleHandler,
    });
  }

  #createPointEditorView() {
    return new PointEditorView({
      point: this.#point,
      destinations: this.#destinationsModel.get(),
      offers: this.#offersModel.get(),
      onCloseClick: this.#pointCloseHandler,
      onDeleteClick: this.#pointDeleteHandler,
      onSubmitForm: this.#pointSubmitHandler,
    });
  }

  #replacePointByEditor() {
    replace(this.#pointEditorComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.EDITABLE;
  }

  #replaceEditorByPoint() {
    replace(this.#pointComponent, this.#pointEditorComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.IDLE;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditorByPoint();
    }
  };

  #pointEditHandler = () => {
    this.#onEditorOpen();
    this.#replacePointByEditor();
  };

  #pointSubmitHandler = (point) => {
    this.#onPointChange(point);
    this.#replaceEditorByPoint();
  };

  #pointCloseHandler = () => {
    this.#replaceEditorByPoint();
  };

  #pointDeleteHandler = (point) => {
    this.#onPointDelete(point);
  };

  #pointFavoriteToggleHandler = (isFavorite) => {
    this.#onPointChange({ ...this.#point, isFavorite });
  };
}
