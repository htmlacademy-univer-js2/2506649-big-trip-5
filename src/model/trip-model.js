import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class TripModel extends Observable {
  #destinations = [];
  #offers = [];
  #waypoints = [];
  #waypointsApiService = null;

  constructor({waypointsApiService}) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const waypoints = await this.#waypointsApiService.points;
      this.#waypoints = waypoints;
    } catch(err) {
      this.#waypoints = [];
    }

    try {
      const offers = await this.#waypointsApiService.offers;
      this.#offers = offers;
    } catch(err) {
      this.#offers = [];
    }

    try {
      const destinations = await this.#waypointsApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
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

  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(({id}) => id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const updatedWaypoint = await this.#waypointsApiService.updatePoint(update);

      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1)
      ];

      this._notify(updateType, updatedWaypoint);

    } catch(error) {
      throw new Error('Can\'t update point');
    }
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
