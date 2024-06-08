import TripListView from '../view/trip-list-view.js';
import SortingView from '../view/sorting-view.js';
import { remove, render } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { filter, sortPoints } from '../utils.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

export default class BoardPresenter {
  #pointModel = null;
  #pointsComponent = null;
  #pointsList = new TripListView();
  #pointsPresenters = new Map();
  #pointNewPresenter = null;
  #offerModel = null;
  #destinationModel = null;
  #filterModel = null;
  #noEventsMessage = null;
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #uiBlocker = null;
  #newPointPresenter = null;

  constructor(
    pointsComponent,
    pointModel,
    offerModel,
    destinationModel,
    filterModel
  ) {
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#pointsComponent = pointsComponent;
    this.#filterModel = filterModel;
    this.#pointModel.addObserver(this.#modelDataChangeHandler);
    this.#filterModel.addObserver(this.#modelDataChangeHandler);
    this.#offerModel.addObserver(this.#modelDataChangeHandler);
    this.#destinationModel.addObserver(this.#modelDataChangeHandler);
    this.#newPointPresenter = new NewPointPresenter(
      this.#pointsList.element,
      this.#offerModel.offersByType,
      this.#destinationModel.destinations,
      this.#handleViewAction
    );
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    const filteredPoints = filter[this.#filterModel.filterType]([
      ...this.#pointModel.points,
    ]);
    return sortPoints[this.#currentSortType](filteredPoints);
  }

  createPoint(destroyCallback) {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilterType(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(destroyCallback);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }
    if (!this.points.length) {
      this.#renderNoPointsMessage();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderLoadingMessage() {
    render(this.#loadingComponent, this.#pointsComponent);
  }

  #renderNoPointsMessage() {
    this.#noEventsMessage = new EmptyListView(this.#filterModel.filterType);
    render(this.#noEventsMessage, this.#pointsComponent);
  }

  #renderSort() {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#sortTypeChangeHandler);
    render(this.#sortComponent, this.#pointsComponent);
  }

  #renderPointsList() {
    render(this.#pointsList, this.#pointsComponent);
    this.#renderPoints();
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(
      this.#pointsList.element,
      this.#offerModel.offersByType,
      this.#destinationModel.destinations,
      this.#handleViewAction,
      this.#pointModeChangeHandler
    );
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #clearBoard(sortType) {
    this.#pointNewPresenter.destroy();
    this.#pointsPresenters.forEach((point) => point.destroy());
    this.#pointsPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#noEventsMessage);
    if (this.#noEventsMessage) {
      remove(this.#noEventsMessage);
    }
    this.#currentSortType = sortType;
  }

  #handleViewAction = async (userActionType, updateType, updatedItem) => {
    switch (userActionType) {
      case UserAction.ADD_POINT:
        this.#pointModel.addTripEvent(updateType, updatedItem);
        break;
      case UserAction.UPDATE_POINT:
        this.#pointModel.updateTripEvent(updateType, updatedItem);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deleteTripEvent(updateType, updatedItem);
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelDataChangeHandler = (updateType, updatedItem) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(updatedItem.id).init(updatedItem);
        break;
      case UpdateType.MINOR:
        this.#clearBoard(this.#currentSortType);
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(SortType.DAY);
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        if (
          this.#pointModel.tripEvents.length &&
          this.#offerModel.offersByType.length &&
          this.#destinationModel.destinations.length
        ) {
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderBoard();
        }
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#clearBoard(sortType);
    this.#renderBoard();
  };

  #pointModeChangeHandler = () => {
    this.#pointNewPresenter.destroy();
    this.#pointsPresenters.forEach((point) => point.resetPointMode());
  };
}
