import {
  DESCRIPTIONS,
  MAX_IMAGES_COUNT,
} from '../const.js';

import {
  getRandomArrayElement,
  getRandomPositiveNumber
} from '../utils.js';


const generateDestination = (city) => {
  const id = crypto.randomUUID();
  return ({
    id,
    description: getRandomArrayElement(DESCRIPTIONS),
    name: city,
    pictures: Array.from({
      length: getRandomPositiveNumber(MAX_IMAGES_COUNT)
    }, () => ({
      src: `https://loremflickr.com/248/152?${id}`,
      description: getRandomArrayElement(DESCRIPTIONS)
    }))
  });
};

export {
  generateDestination,
};
