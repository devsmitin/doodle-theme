class Cart {
  constructor() {
    this.init();
  }

  init() {
    this.changeQty();
  }

  changeQty() {
    Theme.eventBinder(
      "click",
      "#cart-items-ajax",
      "[data-cart-update]",
      async function (e) {
        let button = e.target;
        switch (button.dataset.cartUpdate) {
          case "plus":
            button.parentNode.querySelector("input[type=number]").stepUp();
            break;

          case "minus":
            button.parentNode.querySelector("input[type=number]").stepDown();
            break;

          case "remove":
            button.parentNode.querySelector("input[type=number]").value = 0;
            break;

          default:
            break;
        }

        let formData = {
          id: button.closest("[data-key]").dataset.key,
          quantity: button.parentNode.querySelector("input[type=number]").value,
        };

        Theme.useCartApi(formData, "cart/change.js");
      }
    );
  }
}

export default Cart;
