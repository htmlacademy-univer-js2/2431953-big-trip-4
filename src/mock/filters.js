import { filter } from '../utils.js';

const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length > 0,
  })
);

export { generateFilter };
