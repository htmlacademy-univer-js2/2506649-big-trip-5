const getRandomNumber = (min, max) => (Math.floor(min + Math.random() * (max - min + 1)));

const getRandomArrayElement = (array) => (array[getRandomNumber(0, array.length - 1)]);

export {getRandomNumber, getRandomArrayElement};
