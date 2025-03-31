import AbstractView from '../framework/view/abstract-view.js';

const createNoWaypointsTemplate = () => `
  <p class="trip-events__msg">Click New Event to create your first point</p>
`;

export default class NoWaypointsView extends AbstractView {
  get template () {
    return createNoWaypointsTemplate();
  }
}
