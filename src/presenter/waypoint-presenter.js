import WaypointView from '../view/waypoint.js';
import EditWaypointView from '../view/edit-form.js';
import {render, replace, remove} from '../framework/render.js';
import { Modes } from '../const.js';


export default class WaypointPresenter {
  #eventsListComponent = null;

  #waypointComponent = null;
  #waypointEditComponent = null;
  #changeWaypointMode = null;

  #point = null;
  #destinationsList = null;
  #destination = null;
  #offersList = null;
  #updateWaypointsData = null;

  #mode = Modes.DEFAULT;

  constructor({eventsListComponent, updateWaypointsData, changeWaypointMode}) {
    this.#eventsListComponent = eventsListComponent;
    this.#updateWaypointsData = updateWaypointsData;
    this.#changeWaypointMode = changeWaypointMode;
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

    if (this.#mode === Modes.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Modes.EDITING) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }

  resetToDefaultWaypoint() {
    if (this.#mode === Modes.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    this.#changeWaypointMode();
    this.#mode = Modes.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    this.#mode = Modes.DEFAULT;
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
