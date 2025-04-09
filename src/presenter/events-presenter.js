import {render} from '../framework/render.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import NoWaypointsView from '../view/no-waypoints.js';
import WaypointPresenter from './waypoint-presenter.js';

export default class EventsPresenter {
  #container = null;
  #tripModel = null;

  #sortingComponent = new SortingView();
  #noWaypointsComponent = new NoWaypointsView();
  #eventsListComponent = new EventsListView();

  #waypoints = null;

  constructor(container, tripModel) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init() {
    this.#waypoints = [...this.#tripModel.waypoints];

    this.#renderEvents();
  }

  #renderWaypoint(point, destinationsList, destination, offersList) {
    const waypointPresenter = new WaypointPresenter({eventsListComponent: this.#eventsListComponent});

    waypointPresenter.init(point, destinationsList, destination, offersList);
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

  #renderSorting() {
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

    this.#renderSorting();
    this.#renderEventsList();
    this.#renderWaypoints();
  }
}
