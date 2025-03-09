import {getRandomNumber, getRandomArrayElement, createId, getOffersCount, getOffersIds, getPairRandomDates} from '../utils.js';
import {POINT_TYPES} from '../const.js';

const generateWayointId = createId();

const generateWaypoint = (destinationId, offers) => {
  const type = getRandomArrayElement(POINT_TYPES);
  const maxOffersCount = getOffersCount(type, offers);
  const {dateFrom, dateTo} = getPairRandomDates();

  return {
    id: generateWayointId(),
    basePrice: getRandomNumber(100, 1000),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: destinationId,
    isFavorite: Boolean(getRandomNumber(0, 1)),
    offers: getOffersIds(maxOffersCount),
    type: type,
  };
};

export {generateWaypoint};
