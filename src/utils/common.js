const toggleArrayElement = (array, element) => {
  const indexElement = array.findIndex((item) => item === element);

  if (indexElement === -1) {
    return [...array, element];
  }

  return array.filter((_, index) => index !== indexElement);
};

export {toggleArrayElement};
