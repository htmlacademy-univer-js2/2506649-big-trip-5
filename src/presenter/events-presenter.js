import {render, replace} from '../framework/render.js';
import SortingView from '../view/sorting.js';
import EventsListView from '../view/events-list.js';
import WaypointView from '../view/waypoint.js';
import EditWaypointView from '../view/edit-form.js';
import NoWaypointsView from '../view/no-waypoints.js';

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

  #renderWaypoint(point, destinations) {
    const destination = this.#tripModel.getDestinationById(point.destination);
    const offersList = this.#tripModel.getOffersByType(point.type);

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const waypointComponent = new WaypointView({
      point,
      offers: offersList,
      destination,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const waypointEditComponent = new EditWaypointView({
      point,
      offers: offersList,
      destination,
      destinationsList: destinations,
      onFormSumbmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    function replacePointToForm () {
      replace(waypointEditComponent, waypointComponent);
    }

    function replaceFormToPoint () {
      replace(waypointComponent, waypointEditComponent);
    }

    render(waypointComponent, this.#eventsListComponent.element);
  }

  #renderEvents() {
    const waypoints = this.#tripModel.waypoints;
    const destinations = this.#tripModel.destinations;

    if (!waypoints.length) {
      render(new NoWaypointsView(), this.#container);
      return;
    }

    render(new SortingView(), this.#container);
    render(this.#eventsListComponent, this.#container);

    waypoints.map((point) => this.#renderWaypoint(point, destinations));
  }
}
