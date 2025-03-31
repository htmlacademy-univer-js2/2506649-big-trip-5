import { filters } from '../utils/filter.js';

const generateFilters = (points) => (
  Object.entries(filters).map(([filterName, applyFilter]) => ({
    name: filterName,
    isActive: applyFilter(points).length > 0
  }))
);

export {generateFilters};
