import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const isFutureDate = (date) => date && dayjs(date).isAfter(dayjs(), 'H');

const isPastDate = (date) => date && dayjs(date).isBefore(dayjs(), 'H');

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDate(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => !isFutureDate(point.dateFrom) && !isPastDate(point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastDate(point.dateTo)),
};

export {filter};
