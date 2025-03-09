import dayjs from 'dayjs';
import {DEFAULT_DATE_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT, SHORT_DEFAULT_FORMAT, FULL_DATE_FORMAT} from './const.js';

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

const getRandomOffersIds = (maxOffersCount) => {
  const offersIds = Array.from({length: getRandomNumber(0, maxOffersCount)}, () => getRandomNumber(1, maxOffersCount));
  const uniqueOffersIds = new Set(offersIds);
  return Array.from(uniqueOffersIds);
};

const formatDate = (date, dateFormat) => (date ? dayjs(date).format(dateFormat) : '');
const humanizeDate = (date) => (formatDate(date, SHORT_DATE_FORMAT));
const humanizeTime = (date) => (formatDate(date, TIME_FORMAT));
const formatToShortDefaultDate = (date) => (formatDate(date, SHORT_DEFAULT_FORMAT));
const formatToDefaultDate = (date) => (formatDate(date, `${SHORT_DEFAULT_FORMAT}T${TIME_FORMAT}`));
const formatToFullDate = (date) => (formatDate(date, FULL_DATE_FORMAT));

const getRandomDate = () => {
  const currentDate = dayjs();
  return currentDate.add(getRandomNumber(1, 365), 'day');
};

const getPairRandomDates = () => {
  const dateFrom = getRandomDate().format(DEFAULT_DATE_FORMAT);
  const dateTo = dayjs(dateFrom).add(getRandomNumber(1, 1440), 'minute').format(DEFAULT_DATE_FORMAT);

  return {dateFrom, dateTo};
};

const capitalizeFirstLetter = (word) => (String(word).charAt(0).toUpperCase() + String(word).slice(1));

const getTimeDuration = (dateFrom, dateTo) => {
  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);

  const differenceInMinutes = endDate.diff(startDate, 'minute');
  let hours = Math.floor(differenceInMinutes / 60);
  let minutes = differenceInMinutes % 60;

  hours = hours >= 10 ? `${hours}` : `0${hours}`;
  minutes = minutes >= 10 ? `${minutes}` : `0${minutes}`;

  const timeDuration = hours > 0 ? `${hours}H ${minutes}M` : `${minutes}M`;
  return timeDuration;
};

export {getRandomNumber, getRandomArrayElement, createId, getOffersCount, getRandomOffersIds, humanizeDate, humanizeTime, formatToShortDefaultDate, formatToDefaultDate, formatToFullDate, getPairRandomDates, capitalizeFirstLetter, getTimeDuration};
