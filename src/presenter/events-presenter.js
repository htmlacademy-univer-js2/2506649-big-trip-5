import {render} from '../framework/render.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import NoWaypointsView from '../view/no-waypoints.js';
import WaypointPresenter from './waypoint-presenter.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../const.js';
import {sortByDate, sortByPrice, sortByTime} from '../utils/waypoints.js';

export default class EventsPresenter {
  #container = null;
  #tripModel = null;

  #sortingComponent = null;
  #noWaypointsComponent = new NoWaypointsView();
  #eventsListComponent = new EventsListView();

  #waypoints = null;

  #waypointPresenters = new Map();

  #currentSort = SortType.DAY;

  constructor(container, tripModel) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init() {
    this.#waypoints = [...this.#tripModel.waypoints];

    this.#renderEvents();
  }

  #updateWaypointsData = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint.point);
    this.#waypointPresenters.get(updatedWaypoint.point.id).init(updatedWaypoint);
  };

  #resetWaypointsMode = () => {
    this.#waypointPresenters.forEach((waypointPresenter) => waypointPresenter.resetToDefaultWaypoint());
  };

  #destroyWaypoints() {
    this.#waypointPresenters.forEach((waypointPresenter) => waypointPresenter.destroy());
    this.#waypointPresenters.clear();
  }

  #renderWaypoint(point, destinationsList, destination, offersList) {
    const waypointPresenter = new WaypointPresenter({
      eventsListComponent: this.#eventsListComponent.element,
      updateWaypointsData: this.#updateWaypointsData,
      resetWaypointsMode: this.#resetWaypointsMode
    });

    waypointPresenter.init({point, destinationsList, destination, offersList});
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #renderWaypoints() {
    const destinationsList = this.#tripModel.destinations;

    this.#waypoints.map((point) => {
      const destination = this.#tripModel.getDestinationById(point.destination);
      const offersList = this.#tripModel.getOffersByType(point.type);

      this.#renderWaypoint(point, destinationsList, destination, offersList);
    });
  }

  #renderNoWaypoints() {
    render(this.#noWaypointsComponent, this.#container);
  }

  #sortWaypoints(sortType) {
    switch(sortType) {
      case SortType.TIME:
        this.#waypoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#waypoints.sort(sortByPrice);
        break;
      default:
        this.#waypoints.sort(sortByDate);
    }

    this.#currentSort = sortType;
  }

  #applySort = (sortType) => {
    if (sortType === this.#currentSort) {
      return;
    }

    this.#sortWaypoints(sortType);
    this.#destroyWaypoints();
    this.#renderWaypoints();
  };

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      applySort: this.#applySort
    });

    render(this.#sortingComponent, this.#container);
  }

  #renderEventsList() {
    render(this.#eventsListComponent, this.#container);
  }

  #renderEvents() {
    if (!this.#waypoints.length) {
      this.#renderNoWaypoints();
      return;
    }

    this.#sortWaypoints(this.#currentSort);

    this.#renderSorting();
    this.#renderEventsList();
    this.#renderWaypoints();
  }
}
