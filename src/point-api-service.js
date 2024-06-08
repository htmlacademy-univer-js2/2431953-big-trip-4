import ApiService from './framework/api-service.js';
import { Method } from './const.js';

export default class PointApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get offersByType() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  async updatePoint(tripEvent) {
    const response = await this._load({
      url: `points/${tripEvent.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponce = await ApiService.parseResponse(response);
    return parsedResponce;
  }

  #adaptToServer(tripEvent) {
    const adaptedTripEvent = {
      ...tripEvent,
      base_Price: tripEvent.basePrice,
      date_From: tripEvent.dateFrom,
      date_To: tripEvent.dateTo,
      is_Favorite: tripEvent.isFavorite,
    };

    delete adaptedTripEvent.basePrice;
    delete adaptedTripEvent.dateFrom;
    delete adaptedTripEvent.dateTo;
    delete adaptedTripEvent.isFavorite;
    return adaptedTripEvent;
  }
}
