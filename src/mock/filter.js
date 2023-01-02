import {filter} from '../utils/filter.js';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterName, filterEvents]) => ({
      name: filterName,
      count: filterEvents(points).length,
    }),
  );
}

export {generateFilter};
