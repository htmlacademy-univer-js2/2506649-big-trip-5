import { NoWaypointsText } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createNoWaypointsTemplate = (filterType) => `
  <p class="trip-events__msg">${NoWaypointsText[filterType]}</p>
`;

export default class NoWaypointsView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createNoWaypointsTemplate(this.#filterType);
  }
}
