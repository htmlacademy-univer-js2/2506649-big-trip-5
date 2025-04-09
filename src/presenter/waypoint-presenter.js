import WaypointView from '../view/waypoint.js';
import EditWaypointView from '../view/edit-form.js';
import {render, replace} from '../framework/render.js';


export default class WaypointPresenter {
  #eventsListComponent = null;
  #waypointComponent = null;
  #waypointEditComponent = null;
  #point = null;
  #destinationsList = null;
  #destination = null;
  #offersList = null;

  constructor({eventsListComponent}) {
    this.#eventsListComponent = eventsListComponent;
  }


  init(point, destinationsList, destination, offersList) {
    this.#point = point;
    this.#destinationsList = destinationsList;
    this.#destination = destination;
    this.#offersList = offersList;

    this.#waypointComponent = new WaypointView({
      point: this.#point,
      offers: this.#offersList,
      destination: this.#destination,
      onEditClick: this.#onEditClick,
    });

    this.#waypointEditComponent = new EditWaypointView({
      point: this.#point,
      offers: this.#offersList,
      destination: this.#destination,
      destinationsList: this.#destinationsList,
      onFormSumbmit: this.#onFormSubmit,
    });

    render(this.#waypointComponent, this.#eventsListComponent.element);
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
}
