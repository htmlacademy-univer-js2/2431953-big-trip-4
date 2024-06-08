import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import DestinationModel from './model/destination-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointApiService from './point-api-service.js';

const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';
const AUTHORIZTION_TOKEN = 'Basic eo0w590ik29889a';

const filterContainer = document.querySelector('.trip-controls__filters');
const pointsComponent = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');
const newPointButton = document.querySelector('.trip-main__event-add-btn');
const pointApiService = new PointApiService(END_POINT, AUTHORIZTION_TOKEN);
const offerByTypeModel = new OfferModel(pointApiService);
const destinationModel = new DestinationModel(pointApiService);
const pointModel = new PointModel(pointApiService);
const filterModel = new FilterModel();
const presenter = new BoardPresenter(pointsComponent, pointModel,
  offerByTypeModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, tripMainContainer, filterModel,
  pointModel, offerByTypeModel, destinationModel);
const onAddFormClose = () => {
  newPointButton.disabled = false;
};
const onNewEventButtonClick = () => {
  presenter.createPoint(onAddFormClose);
  newPointButton.disabled = true;
};
filterPresenter.init();
presenter.init();
offerByTypeModel.init().finally(() => {
  destinationModel.init().finally(() => {
    pointModel.init().finally(() => {
      if(offerByTypeModel.offersByType.length && destinationModel.destinations.length) {
        newPointButton.addEventListener('click', onNewEventButtonClick);
      }
    });
  });
});
