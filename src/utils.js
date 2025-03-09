import dayjs from 'dayjs';
import {DEFAULT_DATE_FORMAT} from './const.js';

const getRandomNumber = (min, max) => (Math.floor(min + Math.random() * (max - min + 1)));

const getRandomArrayElement = (array) => (array[getRandomNumber(0, array.length - 1)]);

const createId = () => {
  let lastGeneratedId = 0;

  return () => {
    lastGeneratedId ++;
    return lastGeneratedId;
  };
};

const getOffersCount = (pointType, offersList) => {
  const filteredOffersList = offersList.find(({type}) => type === pointType);
  return filteredOffersList.offers.length;
};

const getOffersIds = (maxOffersCount) => {
  const offersIds = Array.from({length: getRandomNumber(0, maxOffersCount)}, () => getRandomNumber(1, maxOffersCount));
  const uniqueOffersIds = new Set(offersIds);
  return Array.from(uniqueOffersIds);
};

const humanizeDate = (date, dateFormat) => (date ? dayjs(date).format(dateFormat) : '');

const getRandomDate = () => {
  const currentDate = dayjs();
  return currentDate.add(getRandomNumber(1, 365), 'day');
};

const getPairRandomDates = () => {
  const dateFrom = getRandomDate().format(DEFAULT_DATE_FORMAT);
  const dateTo = dayjs(dateFrom).add(getRandomNumber(1, 5), 'day').format(DEFAULT_DATE_FORMAT);

  return {dateFrom, dateTo};
};

export {getRandomNumber, getRandomArrayElement, createId, getOffersCount, getOffersIds, humanizeDate, getPairRandomDates};
