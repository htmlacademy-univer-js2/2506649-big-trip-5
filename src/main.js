import {render} from './framework/render.js';
import FiltersView from './view/filters.js';
import EventsPresenter from './presenter/events-presenter.js';
import TripModel from './model/trip-model.js';
import {generateFilters} from './mock/filters.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const tripModel = new TripModel();
const eventsPresenter = new EventsPresenter(eventsContainer, tripModel);
const filters = generateFilters(tripModel.waypoints);

render(new FiltersView({filters}), filtersContainer);
eventsPresenter.init();

