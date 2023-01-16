import { CITIES, DESCRIPTION, PICTURE_DESCRIPTIONS, WAYPOINT_TYPES } from '../const';
import { getRandomArrayElement, getRandomElements, getRandomInt } from '../utils/common.js';
import {nanoid} from 'nanoid';

const MIN_PIC = 0;
const MAX_PIC = 10;

const MIN_PRICE = 10;
const MAX_PRICE = 1000;

const dateMocks = [
  {
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
  },
  {
    dateFrom: '2019-08-10T22:55:56.845Z',
    dateTo: '2019-08-12T11:22:13.375Z',
  },
  {
    dateFrom: '2019-09-10T22:55:56.845Z',
    dateTo: '2019-09-13T11:22:13.375Z',
  },
  {
    dateFrom: '2019-10-10T22:55:56.845Z',
    dateTo: '2019-10-14T11:22:13.375Z',
  },
  {
    dateFrom: '2019-11-10T22:55:56.845Z',
    dateTo: '2019-11-15T11:22:13.375Z',
  },
];

const createDestination = (el, index) => ({
  id: index + 1,
  description: getRandomArrayElement(DESCRIPTION),
  name: getRandomArrayElement(CITIES),
  pictures: Array.from({length: getRandomInt(MIN_PIC, MAX_PIC)} , () => ({
    src: `https://loremflickr.com/248/152?random=${getRandomInt(MIN_PIC,MAX_PIC)}`,
    description: getRandomArrayElement(PICTURE_DESCRIPTIONS)
  }))
});

const OffersByType = [
  {
    type: 'Taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 60
      },
      {
        id: 2,
        title: 'Order Uber',
        price: 20
      }
    ]
  },
  {
    type: 'Flight',
    offers: [
      {
        id: 1,
        title: 'Add luggage ',
        price: 50
      },
      {
        id: 2,
        title: 'Choose seats',
        price: 5
      },
      {
        id: 3,
        title: 'Switch to comfort',
        price: 80
      },
      {
        id: 4,
        title: 'Add meal',
        price: 15
      },
      {
        id: 5,
        title: 'Travel by train',
        price: 40
      }
    ]
  },
  {
    type: 'Drive',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 60
      },
      {
        id: 2,
        title: 'Rent a car ',
        price: 200
      }
    ]
  },
  {
    type: 'Bus',
    offers: [
      {
        id: 1,
        title: 'Add luggage ',
        price: 50
      },
      {
        id: 2,
        title: 'Choose seats',
        price: 5
      }
    ]
  },
  {
    type: 'Train',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 60
      },
      {
        id: 2,
        title: 'Order Uber',
        price: 20
      },
      {
        id: 3,
        title: 'Travel by train',
        price: 40
      }
    ]
  },
  {
    type: 'Ship',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 60
      },
      {
        id: 2,
        title: 'Book tickets',
        price: 40
      }
    ]
  },
  {
    type: 'Check-in',
    offers: [
      {
        id: 1,
        title: 'Add breakfast',
        price: 50
      },
      {
        id: 2,
        title: 'Switch to comfort',
        price: 80
      }
    ]
  },
  {
    type: 'Sightseeing',
    offers: [
      {
        id: 1,
        title: 'Lunch in city',
        price: 30
      },
      {
        id: 2,
        title: 'Book tickets',
        price: 40
      }
    ]
  },
  {
    type: 'Restaurant',
    offers: [
      {
        id: 1,
        title: 'Add breakfast',
        price: 50
      },
      {
        id: 2,
        title: 'Book a table',
        price: 10
      }
    ]
  },
];


const getRandomWaypoint = (destinationCount) => {
  const type = getRandomArrayElement(WAYPOINT_TYPES);
  const dates = getRandomArrayElement(dateMocks);
  const offersIds = OffersByType.find((t) => t.type === type).offers.map((offer) => offer.id);
  return {
    destination: getRandomInt(1,destinationCount),
    price: getRandomInt(MIN_PRICE, MAX_PRICE),
    dateFrom: dates.dateFrom,
    dateTo: dates.dateTo,
    id: nanoid(),
    isFavorite: false,
    offers: getRandomElements(offersIds),
    type: type
  };
};

export{getRandomWaypoint, OffersByType, createDestination};
