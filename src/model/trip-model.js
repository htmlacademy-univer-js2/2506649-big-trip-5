import {WAYPPOINTS_COUNT} from '../const.js';
import {POINT_TYPES} from '../const.js';
import {generateWaypoint} from '../mock/point.js';
import {generateOffers} from '../mock/offers.js';
import {generateDestination} from '../mock/destination.js';

export default class TripModel {
  destinations = Array.from({length: WAYPPOINTS_COUNT}, () => generateDestination());
  offers = POINT_TYPES.map((type) => generateOffers(type));
  waypoints = this.destinations.map(({id}) => generateWaypoint(id, this.offers));

  getWaypoints() {
    return this.waypoints;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    const allDestinations = this.getDestinations();
    return allDestinations.find((destination) => destination.id === id);

  }

  getOffersByType(type) {
    const allOffers = this.getOffers();
    return allOffers.find((offer) => offer.type === type);
  }
}
