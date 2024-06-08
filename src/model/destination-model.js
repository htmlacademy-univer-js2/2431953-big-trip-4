import Observable from '../framework/observable.js';

export default class DestinationModel extends Observable {
  #pointApiService = null;
  #destinations = [];

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#pointApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }

  get destinations() {
    return this.#destinations;
  }
}
