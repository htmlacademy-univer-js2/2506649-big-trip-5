import {render} from '../framework/render.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import WaypointView from '../view/waypoint.js';
import EditWaypointView from '../view/edit-form.js';
import NewWaypointView from '../view/create-form.js';

export default class EventsPresenter {
  #container = null;
  #tripModel = null;
  #eventsListComponent = new EventsListView();

  constructor(container, tripModel) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init() {
    const waypoints = this.#tripModel.waypoints;
    const destinations = this.#tripModel.destinations;

    render(new SortingView(), this.#container);
    render(this.#eventsListComponent, this.#container);

    waypoints.map((point) => {
      const destination = this.#tripModel.getDestinationById(point.destination);
      const offersList = this.#tripModel.getOffersByType(point.type);

      if (point.id === 1) {
        render(new EditWaypointView(point, offersList, destination, destinations), this.#eventsListComponent.element);
      } else {
        render(new WaypointView(point, offersList, destination), this.#eventsListComponent.element);
      }
    });

    render(new NewWaypointView(), this.#eventsListComponent.element);
  }
}
