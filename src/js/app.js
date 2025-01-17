import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;   
    thisApp.navLinks = document.querySelectorAll(select.nav.links); 
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages) { 
      if(page.id === idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);
 
    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');    // get page id from href attribute
        thisApp.activatePage(id);                                           // run thisApp.activatePage with that id
        window.location.hash = '#/' + id;                                // change URL hash
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for(const page of thisApp.pages) {
      page.classList.toggle(
        classNames.pages.active,
        page.id == pageId
      ); 
    }

    for(let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },


  initBooking: function() {
    const thisApp = this;
    const widgetWrapper = document.querySelector(select.containerOf.booking);
    thisApp.Booking = new Booking(widgetWrapper);
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const urlProducts = settings.db.url + '/' + settings.db.products;

    fetch(urlProducts)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisApp.data.products = parsedResponse;         /* save parsedResponse as thisApp.data.products */

        thisApp.initMenu();                             /* execute initMenu method */
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(productData   /*productData /* nazwa aktualnie "obsługiwanej" właściwości, czyli np. class/name/price */, thisApp.data.products[productData] /* parametry dla włąściwości */);

    }
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initHome: function(){
    const thisApp = this;
    const homePage = document.querySelector(select.containerOf.home);
    thisApp.home = new Home(homePage);
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initBooking();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initHome();
  }  
};

app.init();

export default app;