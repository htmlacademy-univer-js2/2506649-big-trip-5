import dayjs from 'dayjs';
import {getRandomNumber} from './common.js';
import {DEFAULT_DATE_FORMAT} from '../const.js';


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

const getRandomOffersIds = (maxOffersCount) => {
  const offersIds = Array.from({length: getRandomNumber(0, maxOffersCount)}, () => getRandomNumber(1, maxOffersCount));
  const uniqueOffersIds = new Set(offersIds);
  return Array.from(uniqueOffersIds);
};

const getRandomDate = () => {
  const currentDate = dayjs();
  return currentDate.add(getRandomNumber(-7, 7), 'day');
};

const getPairRandomDates = () => {
  const dateFrom = getRandomDate().format(DEFAULT_DATE_FORMAT);
  const dateTo = dayjs(dateFrom).add(getRandomNumber(1, 2880), 'minute').format(DEFAULT_DATE_FORMAT);

  return {dateFrom, dateTo};
};

export {createId, getOffersCount, getRandomOffersIds, getRandomDate, getPairRandomDates};
