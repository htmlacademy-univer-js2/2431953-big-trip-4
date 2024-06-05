const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const OFFER_TITLES = ['Upgrade to a business class', 'Order Uber', 'Add lunch', 'Order train'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const DESTINATIONS_NAMES = ['Ekaterinburg', 'Chelyabinsk', 'Berezovski', 'Moscow', 'Saint-Petersburg', 'Kazan', 'Toronto', 'Washington', 'Raleigh', 'Paris', 'Rim'];

const offerPrice = {
  MIN: 10,
  MAX: 50
};

const tripPrice = {
  MIN: 100,
  MAX: 1500
};

export { POINT_TYPES, OFFER_TITLES, DESCRIPTIONS, DESTINATIONS_NAMES, tripPrice, offerPrice };
