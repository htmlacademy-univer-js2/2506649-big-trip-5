import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {FormMode, POINT_TYPES} from '../const.js';
import {formatToFullDate, humanizeTime, capitalizeFirstLetter} from '../utils/waypoints.js';
import { toggleArrayElement } from '../utils/common.js';
import { generateWayointId } from '../mock/point.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  id: generateWayointId(),
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight',
};

const createEventTypeTemplate = (type, checkedAttribute) => (`
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedAttribute}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
  </div>
`);

const createDestinationsListTemplate = (destination) => (`
  <option value=${destination}></option>
`);

const createDestinationImageTemplate = ({src, description}) => (`
  <img class="event__photo" src="${src}" alt="${description}">
`);

const createOfferTemplate = ({id, title, price}, checkedAttribute) => (`
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-luggage" ${checkedAttribute}>
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`);

const createEditWaypointTemplate = ({point, offers : offersType, destination}, destinationsList, mode) => {
  const {basePrice, dateFrom, dateTo, offers : offersPoint, type} = point;
  const {offers} = offersType;
  const {name, description, pictures} = destination;

  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

    ${POINT_TYPES.map((item) => {
      const checkedAttribute = item === type ? 'checked' : '';
      return createEventTypeTemplate(item, checkedAttribute);
    }).join('')}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsList.map((item) => createDestinationsListTemplate(item.name))}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatToFullDate(dateFrom)} ${humanizeTime(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatToFullDate(dateTo)} ${humanizeTime(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${basePrice}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${mode === FormMode.ADDING ? 'Cancel' : 'Delete'}</button>
          ${mode === FormMode.EDITING ? `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` : ''}
        </header>
        <section class="event__details">
          ${offers.length !== 0 ? `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">

    ${offers.map((offer) => {
      const checkedAttribute = offersPoint.includes(offer.id) ? 'checked' : '';
      return createOfferTemplate(offer, checkedAttribute);
    }).join('')}

              </div>
            </section>` : ''}

          ${description || pictures.length !== 0 ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${description ? `<p class="event__destination-description">${description}</p>` : ''}

            ${pictures.length !== 0 ? `<div class="event__photos-container">
              <div class="event__photos-tape">
                ${pictures.map((picture) => createDestinationImageTemplate(picture)).join('')}
              </div>
            </div>` : ''}

          </section>` : ''}
        </section>
      </form>
    </li>
  `);
};

export default class EditWaypointView extends AbstractStatefulView {
  #destinationsList = null;
  #handleFormSumbmit = null;
  #onCloseForm = null;
  #updateDestination = null;
  #updateOffers = null;
  #mode = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor ({point = BLANK_POINT, offers, destination, destinationsList, handleFormSumbmit, onCloseForm, updateDestination, updateOffers}) {
    super();
    this._setState(EditWaypointView.parsePointToState(point, offers, destination));
    this.#destinationsList = destinationsList;
    this.#handleFormSumbmit = handleFormSumbmit;
    this.#onCloseForm = onCloseForm;
    this.#updateDestination = updateDestination;
    this.#updateOffers = updateOffers;

    this.#mode = point === BLANK_POINT ? FormMode.ADDING : FormMode.EDITING;

    this._restoreHandlers();
  }

  get template () {
    return createEditWaypointTemplate(this._state, this.#destinationsList, this.#mode);
  }

  reset (point, offers, destination) {
    this.updateElement(EditWaypointView.parsePointToState(point, offers, destination));
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#onFormSubmit);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#onCloseForm);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#onTypeClick);
    this.element.querySelector('#event-price-1').addEventListener('input', this.#onPriceInput);
    this.element.querySelector('.event__available-offers')?.addEventListener('click', this.#onOfferClick);

    this.#setDatepickers();
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#handleFormSumbmit(EditWaypointView.parseStateToPoint(this._state));
  };

  #onPriceInput = (evt) => {
    evt.preventDefault();

    const updatedPrice = evt.target.value;
    this._setState({
      point: {
        ...this._state.point,
        basePrice: updatedPrice,
      }
    });
  };

  #onDestinationChange = (evt) => {
    evt.preventDefault();
    if (!evt.target.value) {
      return;
    }

    const updatedDestination = this.#updateDestination(evt.target.value);
    this.updateElement({
      destination: updatedDestination
    });
  };

  #onTypeClick = (evt) => {
    evt.preventDefault();

    const clickedElement = evt.target;
    if (!clickedElement.closest('.event__type-input')) {
      return;
    }

    const updatedType = clickedElement.value;
    const updatedOffers = this.#updateOffers(updatedType);

    this.updateElement({
      point: {
        ...this._state.point,
        type: updatedType,
        offers: []
      },
      offers: updatedOffers,
    });
  };

  #onOfferClick = (evt) => {
    const clickedElement = evt.target;
    if (!clickedElement.closest('.event__offer-checkbox')) {
      return;
    }

    const updatedOfferId = Number(clickedElement.id);
    const updatedOffers = toggleArrayElement(this._state.point.offers, updatedOfferId);

    this._setState({
      point: {
        ...this._state.point,
        offers: updatedOffers
      }
    });
  };

  #onDateFromChange = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate.toISOString()
      }
    });
  };

  #onDateToChange = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate.toISOString()
      }
    });
  };

  #setDatepickers() {
    const defaultConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };

    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...defaultConfig,
        defaultDate: new Date(this._state.point.dateFrom),
        maxDate: new Date(this._state.point.dateTo),
        onChange: this.#onDateFromChange
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...defaultConfig,
        defaultDate: new Date(this._state.point.dateTo),
        minDate: new Date(this._state.point.dateFrom),
        onChange: this.#onDateToChange
      }
    );
  }

  static parsePointToState(point, offers, destination) {
    return {
      point,
      offers,
      destination
    };
  }

  static parseStateToPoint(state) {
    const waypoint = {
      ...state,
      offersList: state.offers
    };

    delete waypoint.offers;

    return waypoint;
  }
}
