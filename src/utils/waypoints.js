import dayjs from 'dayjs';
import {SHORT_DATE_FORMAT, TIME_FORMAT, SHORT_DEFAULT_FORMAT, FULL_DATE_FORMAT} from '../const.js';

const formatDate = (date, dateFormat) => (date ? dayjs(date).format(dateFormat) : '');
const humanizeDate = (date) => (formatDate(date, SHORT_DATE_FORMAT));
const humanizeTime = (date) => (formatDate(date, TIME_FORMAT));
const formatToShortDefaultDate = (date) => (formatDate(date, SHORT_DEFAULT_FORMAT));
const formatToDefaultDate = (date) => (formatDate(date, `${SHORT_DEFAULT_FORMAT}T${TIME_FORMAT}`));
const formatToFullDate = (date) => (formatDate(date, FULL_DATE_FORMAT));

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

export {humanizeDate, humanizeTime, formatToShortDefaultDate, formatToDefaultDate, formatToFullDate, capitalizeFirstLetter, getTimeDuration};
