import {select, templates, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);          /* generate HTML on template */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);          /* create element using utils.createElementFromHTML */
    const menuContainer = document.querySelector(select.containerOf.menu);  /* find menu container */
    menuContainer.appendChild(thisProduct.element);                         /* add element to menu */
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.element.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);                  /* find the clickable trigger (product_header) */
    thisProduct.accordionTrigger.addEventListener('click', function(event){
      event.preventDefault(); 
      const activeWrapper =  document.querySelector(select.all.menuProductsActive);
      if (activeWrapper != thisProduct.element && activeWrapper != null){
        activeWrapper.classList.remove(classNames.menuProduct.wrapperActive);
      } 
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);         /* convert form to object structure {sauce: ['tomato'], toppings: ['olives'], ['redPeppers']} */
    let price = thisProduct.data.price;                                     // set price to default price

    for (let paramId in thisProduct.data.params) {                          // for every category (param)...
      const param = thisProduct.data.params[paramId];                       // determine param value, e.g. paramId = {label: 'Toppings', type: 'checkboxes'}
      for (let optionId in param.options) {                                 // for every option in this category
        const option = param.options[optionId];                             // determine option value, e.g. optionId = 'olives', option = {label: 'Olives', price: '2', default: true}
        // check if there is param with a name of paramId in formData and if it includes optionId
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          if (!option.default == true) {                                     // check if the option is not default
            price += option.price;                                          // add option price to price variable
          }
        } else {
          if (option.default == true) {                                      // check if the option is default
            price -= option.price;                                            // reduce price variable
          }
        }

        const image = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);

        if (image) {
          if (formData[paramId] && formData[paramId].includes(optionId)) {
            if (optionSelected) {
              image.classList.add(classNames.menuProduct.imageVisible);
            } else {
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
        
      }
    }
    price *= thisProduct.amountWidget.value;
    thisProduct.priceSingle = price;
    thisProduct.priceElem.innerHTML = price;
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;

    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true, 
      detail: {
        product:
        thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {};
    productSummary.id = thisProduct.id;
    productSummary.name = thisProduct.data.name;
    productSummary.amount = thisProduct.amountWidget.value;
    productSummary.price = thisProduct.data.price;
    productSummary.priceSingle = thisProduct.priceSingle;

    productSummary.params ={};
    productSummary.params = thisProduct.prepareCartProductParams();

    return productSummary;
  }

  prepareCartProductParams() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);    
    const params = {};

    for (let paramId in thisProduct.data.params) {                          // for every category (param)...
      const param = thisProduct.data.params[paramId];                       // determine param value, e.g. paramId = {label: 'Toppings', type: 'checkboxes'}
      params[paramId] = {
        label: param.label,
        options: {}
      };

      for (let optionId in param.options) {                                 // for every option in this category
        const option = param.options[optionId];                             // determine option value, e.g. optionId = 'olives', option = {label: 'Olives', price: '2', default: true}
        if(formData[paramId] && formData[paramId].includes(optionId)) {     // check if there is param with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if(optionSelected) {
            params[paramId].options[optionId] = option.label;
          } 
        }  
      }
      return params;
    }  
  }
}

export default Product;