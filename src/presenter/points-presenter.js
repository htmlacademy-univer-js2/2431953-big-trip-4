import {
  render,
  replace
} from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import EventsListEmptyView from '../view/events-list-empty-view.js';
import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import SortingView from '../view/sorting-view.js';

export default class PointsPresenter {
  #pointsContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

  #listComponent = new EventsListView();
  #sortingComponent = new SortingView();

  constructor({
    pointsContainer,
    pointsModel,
    offersModel,
    destinationsModel
  }) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#points = [...this.#pointsModel.get()];
  }

  init() {
    if (this.#points.length === 0) {
      render(new EventsListEmptyView(), this.#pointsContainer);
      return;
    }

    render(this.#sortingComponent, this.#pointsContainer);
    render(this.#listComponent, this.#pointsContainer);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new PointView({
      point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onEditClick: pointEditHandler,
    });

    const pointEditorComponent = new PointEditorView({
      point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onCloseClick: pointCloseHandler,
      onSubmitForm: pointSubmitHandler
    });

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditorToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function replacePointToEditor() {
      replace(pointEditorComponent, pointComponent);
    }

    function replaceEditorToPoint() {
      replace(pointComponent, pointEditorComponent);
    }

    function pointEditHandler () {
      replacePointToEditor();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function pointSubmitHandler() {
      replaceEditorToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function pointCloseHandler() {
      replaceEditorToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#listComponent.element);
  };
}
