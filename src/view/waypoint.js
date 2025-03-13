import {createElement} from '../render.js';
import {humanizeDate, humanizeTime, formatToShortDefaultDate, formatToDefaultDate, capitalizeFirstLetter, getTimeDuration} from '../utils.js';

const createOfferTemplate = ({title, price}) => (`
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>
`);

const createWaypointTemplate = (point, {offers}, {name}) => {
  const {basePrice, dateFrom, dateTo, isFavorite, offers : offersPoint, type} = point;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime=${formatToShortDefaultDate(dateFrom)}>${humanizeDate(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${formatToDefaultDate(dateFrom)}>${humanizeTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime=${formatToDefaultDate(dateTo)}>${humanizeTime(dateTo)}</time>
          </p>
          <p class="event__duration">${getTimeDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersPoint.map((id) => createOfferTemplate(offers[id - 1])).join('')}
        </ul>
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

export default class WaypointView {
  constructor (point, offers, destination) {
    this.point = point;
    this.offers = offers;
    this.destination = destination;
  }

  getTemplate () {
    return createWaypointTemplate(this.point, this.offers, this.destination);
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
