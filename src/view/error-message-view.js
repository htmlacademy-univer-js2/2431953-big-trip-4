import AbstractView from '../framework/view/abstract-view.js';

const cretaeErrorMessageTemplate = () => (
  `<p class="trip-events__msg">Some data couldn't be loaded.<br>
  Please, try to reload this page or visit it later.</p>`
);

export default class ErrorMessageView extends AbstractView {
  get template() {
    return cretaeErrorMessageTemplate();
  }
}
