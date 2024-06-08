import { EditType, POINT_DUMMY } from '../const.js';
import {
  RenderPosition,
  remove,
  render,
} from '../framework/render.js';
import CreatePointButtonView from '../view/create-point-button-view.js';
import PointEditorView from '../view/point-editor-view.js';

export default class CreatePointPresenter {
  #container = null;
  #editorContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #createPointButtonComponent = null;
  #pointEditorComponent = null;

  constructor({ container, editorContainer, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#editorContainer = editorContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    if (this.#createPointButtonComponent) {
      throw new Error('Cannot init create point button twice');
    }

    this.#createPointButtonComponent = new CreatePointButtonView({ onClick: this.#createPointClickHandler });
    render(this.#createPointButtonComponent, this.#container);
  }

  destroy() {
    if (!this.#pointEditorComponent) {
      return;
    }

    remove(this.#pointEditorComponent);
    this.#pointEditorComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #createPointClickHandler = () => {
    this.#pointEditorComponent = new PointEditorView({
      point: POINT_DUMMY,
      destinations: this.#destinationsModel.get(),
      offers: this.#offersModel.get(),
      onCloseClick: this.#cancelClickHandler,
      onDeleteClick: this.#cancelClickHandler,
      onSubmitForm: this.#formSubmitHandler,
      mode: EditType.CREATING
    });

    render(this.#pointEditorComponent, this.#editorContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #cancelClickHandler = () => {
    this.destroy();
  };

  #formSubmitHandler = (point) => {
    this.#pointsModel.add(point);
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
