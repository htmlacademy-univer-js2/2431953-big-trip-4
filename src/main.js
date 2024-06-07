import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsPresenter from './presenter/points-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import MockService from './service/mock-service.js';

const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const offersModel = new OffersModel(mockService);
const destinationsModel = new DestinationsModel(mockService);

const pointsContainer = document.querySelector('.trip-events');

const pointsPresenter = new PointsPresenter({
  pointsContainer,
  pointsModel,
  offersModel,
  destinationsModel
});

const filtersPresenter = new FiltersPresenter();
const tripInfoPresenter = new TripInfoPresenter();

pointsPresenter.init();
filtersPresenter.init();
tripInfoPresenter.init();
