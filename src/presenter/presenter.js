import TripListView from '../view/trip-list-view.js';
import SortingView from '../view/sorting-view.js';
import { remove, render } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { filter, sortTripEvents } from '../utils.js';
import TripEventNewPresenter from './trip-event-new-presenter.js';


export default class Presenter {
  #tripEventsModel;
  #tripEventsComponent;
  #tripEventsList;
  #tripEventsPresenters;
  #tripEventNewPresenter;
  #offersModel;
  #destinationModel;
  #filterModel;
  #noEventsMessage = null;
  #sortComponent;
  #currentSortType;

  constructor (container, pointModel, offerModel, destinationModel, filterModel) {
    this.#tripEventsModel = pointModel;

    this.#offersModel = offerModel;
    this.#destinationModel = destinationModel;

    this.#tripEventsComponent = container;
    this.#tripEventsList = new TripListView();

    this.#tripEventsPresenters = new Map();
    this.#tripEventNewPresenter = new TripEventNewPresenter(this.#tripEventsList.element, this.#offersModel.offersByType,
      this.#destinationModel.destinations, this.#handleViewAction);

    this.#filterModel = filterModel;

    this.#sortComponent = null;
    this.#currentSortType = SortType.DAY;

    this.#tripEventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get tripEvents() {
    const filteredTripEvents = filter[this.#filterModel.filterType]([...this.#tripEventsModel.tripEvents]);
    return sortTripEvents[this.#currentSortType](filteredTripEvents);
  }

  createTripEvent(destroyCallback) {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilterType(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#tripEventNewPresenter.init(destroyCallback);
  }

  #renderBoard() {
    if(this.tripEvents.length === 0){
      this.#renderNoEventsMessage();
      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
  }

  #renderSort = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
    render(this.#sortComponent, this.#tripEventsComponent);
  };

  #renderTripEventsList() {
    render(this.#tripEventsList, this.#tripEventsComponent);

    this.#renderTripEvents();
  }

  #renderTripEvents() {
    this.tripEvents.forEach((tripEvent) => this.#renderTripEvent(tripEvent));
  }

  #renderTripEvent = (tripEvent) => {
    const tripEventPresenter = new PointPresenter(this.#tripEventsList.element, this.#offersModel.offersByType, this.#handleViewAction, this.#onTripEventModeChange);
    tripEventPresenter.init(tripEvent);
    this.#tripEventsPresenters.set(tripEvent.id, tripEventPresenter);
  };


  #renderNoEventsMessage = () => {
    this.#noEventsMessage = new EmptyListView(this.#filterModel.filterType);
    render(this.#noEventsMessage, this.#tripEventsComponent);
  };

  #clearBoard(sortType) {
    this.#tripEventNewPresenter.destroy();

    this.#tripEventsPresenters.forEach((point) => point.destroy());
    this.#tripEventsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noEventsMessage);

    if(this.#noEventsMessage) {
      remove(this.#noEventsMessage);
    }

    this.#currentSortType = sortType;
  }

  #handleViewAction = (userActionType, updateType, updatedItem) => {
    switch(userActionType) {
      case UserAction.ADD_TRIP_EVENT:
        this.#tripEventsModel.addTripEvent(updateType, updatedItem);
        break;
      case UserAction.UPDATE_TRIP_EVENT:
        this.#tripEventsModel.updateTripEvent(updateType, updatedItem);
        break;
      case UserAction.DELETE_TRIP_EVENT:
        this.#tripEventsModel.deleteTripEvent(updateType, updatedItem);
        break;
    }
  };

  #handleModelEvent = (updateType, updatedItem) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#tripEventsPresenters.get(updatedItem.id).init(updatedItem);
        break;
      case UpdateType.MINOR:
        this.#clearBoard(this.#currentSortType);
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(SortType.DAY);
        this.#renderBoard();
        break;
    }
  };

  #onSortTypeChange = (sortType) => {
    if(sortType === this.#currentSortType) {
      return;
    }

    this.#clearBoard(sortType);
    this.#renderBoard();
  };

  #onTripEventModeChange = () => {
    this.#tripEventNewPresenter.destroy();

    this.#tripEventsPresenters.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };
}


