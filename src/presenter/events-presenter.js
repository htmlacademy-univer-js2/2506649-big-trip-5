import {remove, render} from '../framework/render.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import NoWaypointsView from '../view/no-waypoints.js';
import WaypointPresenter from './waypoint-presenter.js';
import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import {sortByDate, sortByPrice, sortByTime} from '../utils/waypoints.js';
import { filter } from '../utils/filter.js';

export default class EventsPresenter {
  #container = null;
  #tripModel = null;
  #filterModel = null;

  #sortingComponent = null;
  #noWaypointsComponent = null;
  #eventsListComponent = new EventsListView();

  #waypointPresenters = new Map();

  #currentSort = SortType.DAY;
  #currentFilter = FilterType.EVERYTHING;

  constructor({eventsContainer: container, tripModel, filterModel}) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#tripModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderEvents();
  }

  get waypoints() {
    this.#currentFilter = this.#filterModel.filter;
    const waypoints = this.#tripModel.waypoints;
    const filteredWaypoints = filter[this.#currentFilter](waypoints);

    switch (this.#currentSort) {
      case SortType.TIME:
        return filteredWaypoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredWaypoints.sort(sortByPrice);
      default:
        return filteredWaypoints.sort(sortByDate);
    }
  }

  #updateWaypointsData = (updatedWaypoint) => {
    const destinationsList = this.#tripModel.destinations;
    this.#waypointPresenters.get(updatedWaypoint.point.id).init({
      ...updatedWaypoint,
      destinationsList
    });
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#tripModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#tripModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#tripModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, updatedWaypoint) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#updateWaypointsData(updatedWaypoint);
        break;
      case UpdateType.MINOR:
        this.#clearEvents();
        this.#renderEvents();
        break;
      case UpdateType.MAJOR:
        this.#clearEvents({resetSortType: true});
        this.#renderEvents();
        break;
    }
  };

  #resetWaypointsMode = () => {
    this.#waypointPresenters.forEach((waypointPresenter) => waypointPresenter.resetToDefaultWaypoint());
  };

  #clearEvents({resetSortType = false} = {}) {
    this.#waypointPresenters.forEach((waypointPresenter) => waypointPresenter.destroy());
    this.#waypointPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#noWaypointsComponent);

    if (resetSortType) {
      this.#currentSort = SortType.DAY;
    }
  }

  #updateDestination = (updatedName) => {
    const updatedDestination = this.#tripModel.getDestinationByName(updatedName);

    return updatedDestination;
  };

  #updateOffers = (updatedType) => {
    const updatedOffers = this.#tripModel.getOffersByType(updatedType);

    return updatedOffers;
  };

  #renderWaypoint(point, destinationsList, destination, offersList) {
    const waypointPresenter = new WaypointPresenter({
      eventsListComponent: this.#eventsListComponent.element,
      updateWaypointsData: this.#handleViewAction,
      resetWaypointsMode: this.#resetWaypointsMode,
      updateDestination: this.#updateDestination,
      updateOffers: this.#updateOffers,
    });

    waypointPresenter.init({point, destinationsList, destination, offersList});
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #renderWaypoints() {
    const destinationsList = this.#tripModel.destinations;

    this.waypoints.map((point) => {
      const destination = this.#tripModel.getDestinationById(point.destination);
      const offersList = this.#tripModel.getOffersByType(point.type);

      this.#renderWaypoint(point, destinationsList, destination, offersList);
    });
  }

  #renderNoWaypoints() {
    this.#noWaypointsComponent = new NoWaypointsView({filterType: this.#currentFilter});

    render(this.#noWaypointsComponent, this.#container);
  }

  #applySort = (sortType) => {
    if (sortType === this.#currentSort) {
      return;
    }

    this.#currentSort = sortType;
    this.#clearEvents();
    this.#renderEvents();
  };

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      currentSort: this.#currentSort,
      applySort: this.#applySort
    });

    render(this.#sortingComponent, this.#container);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#container);
  }

  #renderEvents() {
    if (!this.waypoints.length) {
      this.#renderNoWaypoints();
      return;
    }

    this.#renderSorting();
    this.#renderEventsList();
    this.#renderWaypoints();
  }
}
