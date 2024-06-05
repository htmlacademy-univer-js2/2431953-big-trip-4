import { createPoint } from '../mock/task';

export default class pointsModel {
  constructor() {
    this.point = Array.from({ length: 10 }, createPoint);
  }

  getPoint() { return this.point; }
}
