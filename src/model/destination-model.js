import Observable from '../framework/observable.js';

export default class DestinationModel extends Observable {
  #pointApiService = null;
  #destinations = [];
  #destinationsNames = null;

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#pointApiService.destinations;
      this.#destinationsNames = Array.from(this.#destinations, (destination) => destination.name);
    } catch(err) {
      this.#destinations = [];
    }
  }

  get destinations() {
    return this.#destinations;
  }

  get destinationNames() {
    return this.#destinationsNames;
  }
}
