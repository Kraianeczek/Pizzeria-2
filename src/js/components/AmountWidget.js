import { select, settings } from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.value = settings.amountWidget.defaultValue;
    // 10 thisWidget.setValue(thisWidget.input.value);  // lub (element.children[1].value || settings.amountWidget.defaultValue);  zamiast wyżej i po setValue
    thisWidget.initActions();
    // console.log('AmountWidget: ', thisWidget);
  }

  getElements() {
    const thisWidget = this;

    // thisWidget.element = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);         /* konwertuje wpisaną liczbę z tekstu na liczbę */

    /* TODO: Add validation */

    if (thisWidget.value !== newValue && thisWidget.isValid(newValue)) { // 10 !isNaN(newValue) && newValue >= 1 && newValue <= 9) {
      thisWidget.value = newValue;
    }
    thisWidget.renderValue();                         // 10 thisWidget.dom.input.value = thisWidget.value;
    thisWidget.announce();
  }

  // parseValue(value) {
  //   return parseInt(value);
  // }

  isValid(value) {
    return !isNaN(value)
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.setValue();
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}
console.log('am',AmountWidget);
export default AmountWidget;