import {UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import EditWaypointView from '../view/edit-form.js';

export default class NewWaypointPresenter {
  #eventsListContainer = null;
  #updateWaypointsData = null;
  #offers = null;
  #destinationsList = null;
  #updateDestination = null;
  #updateOffers = null;
  #changeNewWaypointButtonMode = null;

  #waypointEditComponent = null;

  constructor({eventsListContainer, updateWaypointsData,
    offers, destinationsList, updateDestination, updateOffers, changeNewWaypointButtonMode}) {
    this.#eventsListContainer = eventsListContainer;
    this.#updateWaypointsData = updateWaypointsData;
    this.#offers = offers;
    this.#destinationsList = destinationsList;
    this.#updateDestination = updateDestination;
    this.#updateOffers = updateOffers;
    this.#changeNewWaypointButtonMode = changeNewWaypointButtonMode;
  }

  init() {
    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new EditWaypointView({
      offers: this.#offers,
      destinationsList: this.#destinationsList,
      handleFormSubmit: this.#handleFormSubmit,
      onCloseForm: this.#onCloseForm,
      updateDestination: this.#updateDestination,
      updateOffers: this.#updateOffers,
    });

    render(this.#waypointEditComponent, this.#eventsListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#waypointEditComponent === null) {
      return;
    }

    this.#changeNewWaypointButtonMode();

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (waypoint) => {
    this.#updateWaypointsData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint.point,
    );

    this.destroy();
  };

  #onCloseForm = (evt) => {
    evt.preventDefault();

    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
