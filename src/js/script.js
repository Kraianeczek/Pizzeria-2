/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      console.log('new Product:', thisProduct);
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
      console.log('form: ', thisProduct.form);
      thisProduct.formInputs = thisProduct.element.querySelectorAll(select.all.formInputs);
      console.log('forminputs: ', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }

    initAccordion() {
      const thisProduct = this;

      // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);                  /* find the clickable trigger (product_header) */
      // console.log('srhfdghj', clickableTrigger);
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
      console.log('initOrder: ', this.initOrderForm);

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
      });
    }

    processOrder() {
      const thisProduct = this;
      console.log('process: ', this.processOrder);

      const formData = utils.serializeFormToObject(thisProduct.form);         /* convert form to object structure {sauce: ['tomato'], toppings: ['olives'], ['redPeppers']} */
      console.log('formData', formData);

      let price = thisProduct.data.price;                                     // set price to default price

      for (let paramId in thisProduct.data.params) {                          // for every category (param)...
        const param = thisProduct.data.params[paramId];                       // determine param value, e.g. paramId = {label: 'Toppings', type: 'checkboxes'}
        console.log(paramId, param);

        for (let optionId in param.options) {                                 // for every option in this category
          const option = param.options[optionId];                             // determine option value, e.g. optionId = 'olives', option = {label: 'Olives', price: '2', default: true}
          console.log(optionId, option);

          // if(formData[paramId] && formData[paramId].includes(optionId)) {     // check if there is param with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if(optionSelected) {
            if(!option.default == true) {                                     // check if the option is not default
              price += option.price;                                          // add option price to price variable
            }
          } else {
            if(option.default == true) {                                      // check if the option is default
              price -= option.price;                                            // reduce price variable
            }
          }

          const image = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          console.log('image:', image);

          if(image) {
            // if(formData[paramId] && formData[paramId].includes(optionId)) {
            if(optionSelected){
              image.classList.add(classNames.menuProduct.imageVisible);
            } else {
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }  
      }
      thisProduct.priceElem.innerHTML = price;
    }
  }

  const app = {
    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initMenu: function() {
      const thisApp = this;
      console.log('thisApp.data: ', thisApp.data);
      
      for (let productData in thisApp.data.products) { 
        new Product(productData /* nazwa aktualnie "obsługiwanej" właściwości, czyli np. class/name/price */, thisApp.data.products[productData] /* parametry dla włąściwości */);
        
      }
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
