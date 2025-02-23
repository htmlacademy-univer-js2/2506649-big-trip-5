import {render} from './render.js';
import FiltersView from './view/filters.js';
import EventsPresenter from './presenter/events-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter(eventsContainer);

render(new FiltersView(), filtersContainer);
eventsPresenter.init();

