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
  #handleDestinationUpdate = null;
  #handleOffersUpdate = null;

  #point = null;
  #destinationsList = null;
  #destination = null;
  #offersList = null;
  #handleWaypointsDataUpdate = null;

  #mode = Mode.DEFAULT;

  constructor({eventsListComponent, handleWaypointsDataUpdate, resetWaypointsMode,
    handleDestinationUpdate, handleOffersUpdate}) {
    this.#eventsListComponent = eventsListComponent;
    this.#handleWaypointsDataUpdate = handleWaypointsDataUpdate;
    this.#resetWaypointsMode = resetWaypointsMode;
    this.#handleDestinationUpdate = handleDestinationUpdate;
    this.#handleOffersUpdate = handleOffersUpdate;
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
      handleFormSubmit: this.#handleFormSubmit,
      onCloseForm: this.#onCloseForm,
      handleDeleteClick: this.#handleDeleteClick,
      handleDestinationUpdate: this.#handleDestinationUpdate,
      handleOffersUpdate: this.#handleOffersUpdate,
    });

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#eventsListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointComponent, prevWaypointEditComponent);
      this.#mode = Mode.DEFAULT;
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#waypointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
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

    this.#handleWaypointsDataUpdate(
      UserAction.UPDATE_WAYPOINT,
      updateType,
      updatedWaypoint.point
    );
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
    this.#handleWaypointsDataUpdate(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint.point
    );
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();

    const updatedPoint = {...this.#point, isFavorite: !this.#point.isFavorite};

    this.#handleWaypointsDataUpdate(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      updatedPoint
    );
  };
}
