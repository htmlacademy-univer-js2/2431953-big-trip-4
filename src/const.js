const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;
const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;

const POINTS_COUNT = 5;
const MAX_PRICE_VALUE = 200;
const MAX_IMAGES_COUNT = 5;

const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];
const CITIES = [
  'Paris',
  'London',
  'Chicago',
  'Tokio',
  'New York',
  'Moscow',
  'Amsterdam',
  'San-Francisco',
];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt architecto labore atque!',
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem exercitationem culpa, molestias qui eveniet corrupti?',
  'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eius, dolorem.',
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit ad eaque cupiditate praesentium maxime.',
];

const DEFAULT_EVENT_TYPE = 'flight';

const POINT_DUMMY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_EVENT_TYPE,
};

const REQUIRED_POINT_FIELDS = ['dateFrom', 'dateTo', 'destination', 'type'];

const PointMode = {
  IDLE: 'IDLE',
  EDITABLE: 'EDITABLE',
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};

const FilterType = {
  ANY: 'any',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const FilterSettings = {
  [FilterType.ANY]: {
    label: 'Everything',
    defaultSelected: true,
  },
  [FilterType.FUTURE]: { label: 'Future' },
  [FilterType.PRESENT]: { label: 'Present' },
  [FilterType.PAST]: { label: 'Past' },
};

const SORTING_COLUMNS = [
  {
    type: SortType.DAY,
    label: 'Day',
    active: true,
    defaultSelected: true,
  },
  {
    type: SortType.EVENT,
    label: 'Event',
    active: false,
  },
  {
    type: SortType.TIME,
    label: 'Time',
    active: true,
  },
  {
    type: SortType.PRICE,
    label: 'Price',
    active: true,
  },
  {
    type: SortType.OFFER,
    label: 'Offer',
    active: false,
  },
];

const DateFormat = {
  TIME: 'HH:mm',
  SHORT: 'MMM DD',
  FULL: 'YYYY-MM-DDTHH:mm',
  WITH_DELIMITER: 'DD/MM/YY HH:mm',
  WITH_DELIMITER_FLAT_PICKER: 'd/m/y H:i',
};

const DurationFormat = {
  DAYS: 'DD[D] HH[H] mm[M]',
  HOURS: 'HH[H] mm[M]',
  MINS: 'mm[M]',
};

const Price = {
  MIN: 1,
  MAX: 500,
};

const MocksMaxCount = {
  OFFERS: 7,
  POINTS: 5,
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {
  POINTS_COUNT,
  EVENT_TYPES,
  MAX_PRICE_VALUE,
  MAX_IMAGES_COUNT,
  CITIES,
  DESCRIPTIONS,
  SORTING_COLUMNS,
  POINT_DUMMY,
  REQUIRED_POINT_FIELDS,
  PointMode,
  EditType,
  FilterType,
  FilterSettings,
  SortType,
  DateFormat,
  DurationFormat,
  Price,
  MocksMaxCount,
  MSEC_IN_HOUR,
  MSEC_IN_DAY,
  UpdateType,
};
