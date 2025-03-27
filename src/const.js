const WAYPPOINTS_COUNT = 10;
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.sssZ';
const SHORT_DEFAULT_FORMAT = 'YYYY-MM-DD';
const SHORT_DATE_FORMAT = 'MMM D';
const FULL_DATE_FORMAT = 'DD/MM/YY';
const TIME_FORMAT = 'HH:mm';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITIES = ['Amsterdam', 'Chamonix', 'Geneva'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const OFFER_TITLES = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
];

export {TIME_FORMAT, FULL_DATE_FORMAT, SHORT_DATE_FORMAT, DEFAULT_DATE_FORMAT, SHORT_DEFAULT_FORMAT, WAYPPOINTS_COUNT, POINT_TYPES, CITIES, DESCRIPTIONS, OFFER_TITLES};
