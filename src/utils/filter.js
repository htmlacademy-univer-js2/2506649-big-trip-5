import dayjs from 'dayjs';
import {filterTypes} from '../const.js';

const isFutureDate = (date) => date && dayjs(date).isAfter(dayjs(), 'D');

const isPastDate = (date) => date && dayjs(date).isBefore(dayjs(), 'D');

const filters = {
  [filterTypes.EVERYTHING]: (points) => points,
  [filterTypes.FUTURE]: (points) => points.filter((point) => isFutureDate(point.dateFrom)),
  [filterTypes.PRESENT]: (points) => points.filter((point) => !isFutureDate(point.dateFrom) && !isPastDate(point.dateTo)),
  [filterTypes.PAST]: (points) => points.filter((point) => isPastDate(point.dateTo)),
};

export {filters};
