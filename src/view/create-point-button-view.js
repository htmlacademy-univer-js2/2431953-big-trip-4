import AbstractView from '../framework/view/abstract-view.js';

const createCreatePointButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class CreatePointButtonView extends AbstractView {
  #handleButtonClick = null;

  constructor({ onClick }) {
    super();
    this.#handleButtonClick = onClick;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createCreatePointButtonTemplate();
  }

  setDisabled(isDisabled) {
    this.element.disabled = isDisabled;
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };
}
