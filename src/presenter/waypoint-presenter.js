import WaypointView from '../view/waypoint.js';
import EditWaypointView from '../view/edit-form.js';
import {render, replace, remove} from '../framework/render.js';
import {Mode, UpdateType, UserAction} from '../const.js';
import { isDatesEqual } from '../utils/waypoints.js';


export default class WaypointPresenter {
  #eventsListComponent = null;

  #waypointComponent = null;
  #waypointEditComponent = null;
  #resetWaypointsMode = null;
  #updateDestination = null;
  #updateOffers = null;

  #point = null;
  #destinationsList = null;
  #destination = null;
  #offersList = null;
  #updateWaypointsData = null;

  #mode = Mode.DEFAULT;

  constructor({eventsListComponent, updateWaypointsData, resetWaypointsMode, updateDestination, updateOffers}) {
    this.#eventsListComponent = eventsListComponent;
    this.#updateWaypointsData = updateWaypointsData;
    this.#resetWaypointsMode = resetWaypointsMode;
    this.#updateDestination = updateDestination;
    this.#updateOffers = updateOffers;
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
      handleFormSumbmit: this.#handleFormSubmit,
      onCloseForm: this.#onCloseForm,
      handleDeleteClick: this.#handleDeleteClick,
      updateDestination: this.#updateDestination,
      updateOffers: this.#updateOffers,
    });

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#eventsListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointEditComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }

  resetToDefaultWaypoint() {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.reset(this.#point, this.#offersList, this.#destination);
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    document.addEventListener('keydown', this.#onEscKeydown);
    replace(this.#waypointEditComponent, this.#waypointComponent);
    this.#resetWaypointsMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    document.removeEventListener('keydown', this.#onEscKeydown);
    replace(this.#waypointComponent, this.#waypointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #handleFormSubmit = (updatedWaypoint) => {
    const isStartDatesEqual = isDatesEqual(updatedWaypoint.point.dateFrom, this.#point.dateFrom);
    const isEndDatesEqual = isDatesEqual(updatedWaypoint.point.dateTo, this.#point.dateTo);
    const isPricesEqual = updatedWaypoint.point.basePrice === this.#point.basePrice;

    const updateType = isStartDatesEqual && isEndDatesEqual && isPricesEqual ?
      UpdateType.PATCH : UpdateType.MINOR;

    this.#updateWaypointsData(
      UserAction.UPDATE_WAYPOINT,
      updateType,
      updatedWaypoint
    );
    this.#replaceFormToPoint();
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#waypointEditComponent.reset(this.#point, this.#offersList, this.#destination);
      this.#replaceFormToPoint();
    }
  };

  #onEditClick = (evt) => {
    evt.preventDefault();
    this.#replacePointToForm();
  };

  #onCloseForm = (evt) => {
    evt.preventDefault();
    this.#waypointEditComponent.reset(this.#point, this.#offersList, this.#destination);
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (waypoint) => {
    this.#updateWaypointsData(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint
    );
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();

    const updatedPoint = {...this.#point, isFavorite: !this.#point.isFavorite};
    const updatedWaypoint = {
      point: updatedPoint,
      destination: this.#destination,
      offersList: this.#offersList,
    };

    this.#updateWaypointsData(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      updatedWaypoint
    );
  };
}
