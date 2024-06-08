import ApiService from './framework/api-service.js';
import { Method } from './const.js';

export default class PointApiService extends ApiService {
  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get offersByType() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  async updatePoint(tripEvent) {
    const response = await this._load({
      url: `points/${tripEvent.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponce = await ApiService.parseResponse(response);
    return parsedResponce;
  }

  async createPoint(tripEvent) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponce = await ApiService.parseResponse(response);
    return parsedResponce;
  }

  async deletePoint(tripEvent) {
    const response = await this._load({
      url: `points/${tripEvent.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(tripEvent) {
    const adaptedTripEvent = {...tripEvent,
      'base_price': tripEvent.basePrice,
      'date_from': tripEvent.dateFrom,
      'date_to': tripEvent.dateTo,
      'is_favorite': tripEvent.isFavorite,
    };

    delete adaptedTripEvent.basePrice;
    delete adaptedTripEvent.dateFrom;
    delete adaptedTripEvent.dateTo;
    delete adaptedTripEvent.isFavorite;
    return adaptedTripEvent;
  }
}
