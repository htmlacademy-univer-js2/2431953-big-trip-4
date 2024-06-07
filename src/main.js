import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import RoutePresenter from './presenter/route-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import MockService from './service/mock-service.js';

const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const offersModel = new OffersModel(mockService);
const destinationsModel = new DestinationsModel(mockService);

const container = document.querySelector('.trip-events');

const routePresenter = new RoutePresenter({
  container,
  pointsModel,
  offersModel,
  destinationsModel
});

const filtersPresenter = new FiltersPresenter({ pointsModel });
const tripInfoPresenter = new TripInfoPresenter();

routePresenter.init();
filtersPresenter.init();
tripInfoPresenter.init();
