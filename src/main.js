import EventsPresenter from './presenter/events-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const newWaypointButtonContainer = document.querySelector('.trip-main');

const tripModel = new TripModel();
const filterModel = new FilterModel();

const eventsPresenter = new EventsPresenter({
  eventsContainer,
  tripModel,
  filterModel,
  newWaypointButtonContainer
});
const filterPresenter = new FilterPresenter({filtersContainer, filterModel, tripModel});

filterPresenter.init();
eventsPresenter.init();
