import {CITIES, DESCRIPTIONS} from '../const.js';
import {createId} from '../utils/mock.js';
import {getRandomArrayElement, getRandomNumber} from '../utils/common.js';

const generateDestinationId = createId();

const generateDestination = () => ({
  id: generateDestinationId(),
  description: Array.from({length: getRandomNumber(1, 5)},() => getRandomArrayElement(DESCRIPTIONS)).join(' '),
  name: getRandomArrayElement(CITIES),
  pictures: Array.from({length: getRandomNumber(1, 5)}, () => ({
    src: `https://loremflickr.com/248/152?${getRandomNumber(1, 1000)}`,
    description: getRandomArrayElement(DESCRIPTIONS),
  }))
});

export {generateDestination};
