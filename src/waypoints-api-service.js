import { Method } from './const.js';
import ApiService from './framework/api-service.js';
import WaypointsAdapter from './waypoints-adapter.js';

export default class WaypointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map(WaypointsAdapter.adaptPointToClient));
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(WaypointsAdapter.adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedResponse = WaypointsAdapter.adaptPointToClient(parsedResponse);

    return adaptedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(WaypointsAdapter.adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedResponse = WaypointsAdapter.adaptPointToClient(parsedResponse);

    return adaptedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
