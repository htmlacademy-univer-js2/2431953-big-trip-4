import Presenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';
import OfferModel from './model/offer-model.js';
import TownModel from './model/town-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';


const filtersContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');
const newEventButton = tripMainContainer.querySelector('.trip-main__event-add-btn');
const offerByTypeModel = new OfferModel();
const destinationModel = new TownModel();
const tripEventModel = new PointModel(offerByTypeModel.offers, destinationModel.towns);
const filterModel = new FilterModel();
const tripEventsPresenter = new Presenter(tripContainer, tripEventModel, offerByTypeModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(filtersContainer, tripMainContainer, filterModel, tripEventModel, offerByTypeModel);

const onAddFormClose = () => {
  newEventButton.disabled = false;
};

const onNewEventButtonClick = () => {
  tripEventsPresenter.createTripEvent(onAddFormClose);
  newEventButton.disabled = true;
};

newEventButton.addEventListener('click', onNewEventButtonClick);

filterPresenter.init();
tripEventsPresenter.init();
