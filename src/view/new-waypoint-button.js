import { NewWaypointButtonMode } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createNewWaypointButtonTemplate = (mode) => `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${mode === NewWaypointButtonMode.DISABLED ? 'disabled' : ''}>New event</button>
`;

export default class NewWaypointButton extends AbstractView {
  #mode = null;
  #onClick = null;

  constructor({mode, onClick}) {
    super();
    this.#mode = mode;
    this.#onClick = onClick;

    this.element.addEventListener('click', this.#onClick);
  }

  get template() {
    return createNewWaypointButtonTemplate(this.#mode);
  }
}
