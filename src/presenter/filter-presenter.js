import FiltersView from '../view/filters-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { sortPoints, filter } from '../utils.js';
import { UpdateType, SortType } from '../const.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #filterModel = null;
  #pointModel = null;
  #offersModel = null;
  #destinationModel = null;

  constructor(filterContainer, tripInfoContainer, filterModel, pointModel, offersModel, destinationModel) {
    this.#filterContainer = filterContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationModel = destinationModel;
    this.#filterModel.addObserver(this.#modelDataChangeHandler);
    this.#pointModel.addObserver(this.#modelDataChangeHandler);
  }

  init() {
    const previousFilterComponent = this.#filterComponent;
    this.#filterComponent = new FiltersView(this.filters, this.#filterModel.filterType);
    this.#filterComponent.setFilterTypeChangeHandler(this.#filterTypeChangeHandler);
    this.#renderTripInfo();
    if(!previousFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  }

  get filters() {
    return Array.from(Object.entries(filter), ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(this.#pointModel.points).length,
    }));
  }

  get points() {
    return sortPoints[SortType.DAY](this.#pointModel.points);
  }

  #renderTripInfo() {
    const previousInfoComponent = this.#tripInfoComponent;
    const points = this.points;
    if(points.length && this.#offersModel.offersByType.length && this.#destinationModel.destinations.length) {
      this.#tripInfoComponent = new TripInfoView(points, this.#getOverallTripPrice(points), this.#destinationModel.destinations);
    }
    if(previousInfoComponent) {
      replace(this.#tripInfoComponent, previousInfoComponent);
      remove(previousInfoComponent);
    } else if (this.#tripInfoComponent) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #getOverallTripPrice(points) {
    let sum = 0;
    points.forEach((point) => {
      sum += point.basePrice;
      const currentOffers = this.#offersModel.offersByType.find((offer) => offer.type === point.type).offers;
      point.offers.forEach((offer) => {
        sum += currentOffers.find((currentOffer) => currentOffer.id === offer).price;
      });
    });
    return sum;
  }

  #modelDataChangeHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if(this.#filterModel.filterType === filterType) {
      return;
    }
    this.#filterModel.setFilterType(UpdateType.MAJOR, filterType);
  };
}
