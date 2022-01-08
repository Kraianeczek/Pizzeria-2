import { select, settings } from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(element.children[1].value || settings.amountWidget.defaultValue);   // (thisWidget.input.value);
    thisWidget.initActions();
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    console.log(thisWidget.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);         /* konwertuje wpisaną liczbę z tekstu na liczbę */

    /* TODO: Add validation */

    if (thisWidget.value !== newValue && !isNaN(newValue) && newValue >= 1 && newValue <= 9) {
      thisWidget.value = newValue;
    }
    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue();
    });
    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    setTimeout(() => {
      thisWidget.element.dispatchEvent(event);
    }, 0);
  }
}

export default AmountWidget;