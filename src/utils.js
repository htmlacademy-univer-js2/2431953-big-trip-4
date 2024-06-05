export const getRandomPositiveInteger = (min, max) => {
  if (min < max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

export const getRandomArrayElement = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];
