import {render} from './render.js';
import FiltersView from './view/filters.js';
import EventsPresenter from './presenter/events-presenter.js';
import TripModel from './model/trip-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter(eventsContainer, new TripModel());

render(new FiltersView(), filtersContainer);
eventsPresenter.init();

