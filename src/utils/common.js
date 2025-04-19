const getRandomNumber = (min, max) => (Math.floor(min + Math.random() * (max - min + 1)));

const getRandomArrayElement = (array) => (array[getRandomNumber(0, array.length - 1)]);

const updateItem = (items, updatedItem) => (items.map((item) => item.id === updatedItem.id ? updatedItem : item));

const toggleArrayElement = (array, element) => {
  const indexElement = array.findIndex((item) => item === element);

  if (indexElement === -1) {
    return [...array, element];
  }

  return array.filter((_, index) => index !== indexElement);
};

export {getRandomNumber, getRandomArrayElement, updateItem, toggleArrayElement};
