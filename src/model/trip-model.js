import Observable from '../framework/observable.js';
import {WAYPPOINTS_COUNT} from '../const.js';
import {POINT_TYPES} from '../const.js';
import {generateWaypoint} from '../mock/point.js';
import {generateOffers} from '../mock/offers.js';
import {generateDestination} from '../mock/destination.js';

export default class TripModel extends Observable {
  #destinations = Array.from({length: WAYPPOINTS_COUNT}, () => generateDestination());
  #offers = POINT_TYPES.map((type) => generateOffers(type));
  #waypoints = this.#destinations.map(({id}) => generateWaypoint(id, this.offers));

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    const allDestinations = this.destinations;
    return allDestinations.find((destination) => destination.id === id);
  }

  getDestinationByName(name) {
    const allDestinations = this.destinations;
    return allDestinations.find((destination) => destination.name === name);
  }

  getOffersByType(type) {
    const allOffers = this.offers;
    return allOffers.find((offer) => offer.type === type);
  }

  updateWaypoint(updateType, updatedWaypoint) {
    const index = this.#waypoints.findIndex(({id}) => id === updatedWaypoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      updatedWaypoint,
      ...this.#waypoints.slice(index + 1)
    ];

    this._notify(updateType, updatedWaypoint);
  }

  addWaypoint(updateType, updatedWaypoint) {
    this.#waypoints = [
      ...this.#waypoints,
      updatedWaypoint
    ];

    this._notify(updateType, updatedWaypoint);
  }

  deleteWaypoint(updateType, updatedWaypoint) {
    const index = this.#waypoints.findIndex(({id}) => id === updatedWaypoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
