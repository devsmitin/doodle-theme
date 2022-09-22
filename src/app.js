// CSS/SCSS
import "./styles.scss";

// JS
// import everything from bootstrap
// import * as bootstrap from "bootstrap";
// and make bootstrap global
// window.bootstrap = bootstrap;

import PTtheme from "./common";
import Cart from "./cart.js";
import Collection from "./collection.js";
import Product from "./product.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("document is ready. Events will work now.");
  window.Theme = new PTtheme();
  window.Cart = new Cart();

  if (document.body.classList.contains("template-collection")) {
    new Collection();
  }

  if (document.body.classList.contains("template-product")) {
    new Product();
  }
});
