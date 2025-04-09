import {render} from '../framework/render.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import NoWaypointsView from '../view/no-waypoints.js';
import WaypointPresenter from './waypoint-presenter.js';

export default class EventsPresenter {
  #container = null;
  #tripModel = null;
  #eventsListComponent = new EventsListView();

  constructor(container, tripModel) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init() {
    this.#renderEvents();
  }

  #renderWaypoint(point, destinationsList, destination, offersList) {
    const waypointPresenter = new WaypointPresenter({eventsListComponent: this.#eventsListComponent});

    waypointPresenter.init(point, destinationsList, destination, offersList);
  }

  #renderEvents() {
    const waypoints = [...this.#tripModel.waypoints];
    const destinationsList = this.#tripModel.destinations;

    if (!waypoints.length) {
      render(new NoWaypointsView(), this.#container);
      return;
    }

    render(new SortingView(), this.#container);
    render(this.#eventsListComponent, this.#container);

    waypoints.map((point) => {
      const destination = this.#tripModel.getDestinationById(point.destination);
      const offersList = this.#tripModel.getOffersByType(point.type);

      this.#renderWaypoint(point, destinationsList, destination, offersList);
    });
  }
}
