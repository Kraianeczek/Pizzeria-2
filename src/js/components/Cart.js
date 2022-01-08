import { settings, select, templates, classNames } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];                           // w tej tablicy będą przechowywane zmienne do koszyka

    thisCart.getElements(element);
    thisCart.initActions(element);
    thisCart.sendOrder();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
    thisCart.dom.totalPriceBottom = thisCart.dom.wrapper.querySelector(select.cart.totalPriceBottom);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (let product of thisCart.products) {
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    if (thisCart.totalNumber === 0) {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('this:', thisCart.totalPrice);
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    thisCart.dom.totalPriceBottom.innerHTML = thisCart.totalPrice;
  }

  remove(removedProduct) {
    const thisCart = this;

    const indexOfRemovedProduct = thisCart.products.indexOf(removedProduct);    // wybiera index z tablicy thisCart.products
    removedProduct.dom.wrapper.remove();
    thisCart.products.splice(indexOfRemovedProduct, 1);                         // wycina indexOfRemovedProduct
    thisCart.update();                                                          // aktualizuje cenę
  }

  sendOrder() {
    const thisCart = this;

    const urlOrders = settings.db.url + '/' + settings.db.orders;

    const payLoad = {};

    payLoad.address = thisCart.dom.address.value;
    payLoad.phone = thisCart.dom.phone.value;
    payLoad.totalPrice = thisCart.totalPrice;
    payLoad.subtotalPrice = thisCart.subtotalPrice;
    payLoad.totalNumber = thisCart.totalNumber;
    payLoad.deliveryFee = thisCart.deliveryFee;
    payLoad.products = [];

    for (let prod of thisCart.products) {
      payLoad.products.push(prod.getData());
    }
    console.log('payLoad: ', payLoad);

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    };
    fetch(urlOrders, options);
  }
}

export default Cart;
