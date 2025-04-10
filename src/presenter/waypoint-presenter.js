import WaypointView from '../view/waypoint.js';
import EditWaypointView from '../view/edit-form.js';
import {render, replace, remove} from '../framework/render.js';


export default class WaypointPresenter {
  #eventsListComponent = null;

  #waypointComponent = null;
  #waypointEditComponent = null;

  #point = null;
  #destinationsList = null;
  #destination = null;
  #offersList = null;
  #updateWaypointsData = null;

  constructor({eventsListComponent, updateWaypointsData}) {
    this.#eventsListComponent = eventsListComponent;
    this.#updateWaypointsData = updateWaypointsData;
  }


  init({point, destinationsList, destination, offersList}) {
    this.#point = point;
    this.#destinationsList = destinationsList;
    this.#destination = destination;
    this.#offersList = offersList;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView({
      point: this.#point,
      offers: this.#offersList,
      destination: this.#destination,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick,
    });

    this.#waypointEditComponent = new EditWaypointView({
      point: this.#point,
      offers: this.#offersList,
      destination: this.#destination,
      destinationsList: this.#destinationsList,
      onFormSumbmit: this.#onFormSubmit,
    });

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#eventsListComponent);
      return;
    }

    if (this.#eventsListComponent.contains(prevWaypointComponent.element)) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#eventsListComponent.contains(prevWaypointEditComponent.element)) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);

  }

  #replacePointToForm() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  #onEditClick = (evt) => {
    evt.preventDefault();
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#onEscKeydown);
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onEscKeydown);
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();

    const updatedPoint = {...this.#point, isFavorite: !this.#point.isFavorite};
    const updatedWaypoint = {
      point: updatedPoint,
      destinationsList: this.#destinationsList,
      destination: this.#destination,
      offersList: this.#offersList,
    };

    this.#updateWaypointsData(updatedWaypoint);
  };
}
