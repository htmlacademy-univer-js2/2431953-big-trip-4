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
  #destinationsModel = null;
  #offersModel = null;
  #mode = PointMode.IDLE;

  constructor({ container, destinationsModel, offersModel, onPointChange }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onPointChange = onPointChange;
  }

  init(point) {
    this.#point = point;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onEditClick: this.#pointEditHandler,
    });

    this.#pointEditorComponent = new PointEditorView({
      point: this.#point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onCloseClick: this.#pointCloseHandler,
      onSubmitForm: this.#pointSubmitHandler,
    });

    if (this.#mode === PointMode.EDITABLE) {
      render(this.#pointEditorComponent, this.#container);
      return;
    }

    render(this.#pointComponent, this.#container);
  }

  update(point) {
    this.#point = point;

    const updatedPointComponent = new PointView({
      point: this.#point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onEditClick: this.#pointEditHandler,
    });

    const updatedEditorComponent = new PointEditorView({
      point: this.#point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onCloseClick: this.#pointCloseHandler,
      onSubmitForm: this.#pointSubmitHandler,
    });

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
    this.#replacePointByEditor();
  };

  #pointSubmitHandler = (point) => {
    this.#onPointChange(point);
    this.#replaceEditorByPoint();
  };

  #pointCloseHandler = () => {
    this.#replaceEditorByPoint();
  };
}
