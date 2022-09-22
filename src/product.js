import ntc from "./ntc";
class Product {
  constructor() {
    this.activeOptions = [];
    this.activeVariant = null;
    this.product_data = plantastic.product_data || {};
    this.elements = this.getElements();
    this.init();
  }

  getElements = () => {
    const details = document.querySelector(".product-description-wrapper");
    return details
      ? {
          form: details.querySelector("form.product-form"),
          a2cButton: details.querySelector('[type="submit"]'),
          main_price: details.querySelector(".original-price"),
          compare_price: details.querySelector(".compare-price"),
        }
      : false;
  };

  init() {
    this.activeVariant = this.elements.form.querySelector("[name='id']").value;
    if (location.search) {
      let urlParams = location.search.slice(1).split("&");
      let variantParam = urlParams.find((param) => param.includes("variant"));
      if (!doodle.cn(variantParam)) {
        let variantId = variantParam.split("=")[1];
        this.activeVariant = variantId;
      }
    }

    this.getOptFromVariant();
    this.getVariantFromOpt();
    this.optionChange();
    this.addToCart();
    this.observe_recommendations();

    this.getColor();
  }

  optionChange() {
    document
      .querySelectorAll('.option-selector input[type="radio"]')
      .forEach((option) => {
        option.addEventListener("change", () => {
          this.activeOptions[option.dataset.position - 1] = option.value;
          this.getVariantFromOpt();
        });
      });
  }

  getOptFromVariant = () => {
    let current_variant = this.activeVariant;
    let current_options = [];
    this.product_data.variants.forEach((variant) => {
      if (variant.id == current_variant) {
        current_options = variant.options;
      }
    });
    this.activeOptions = current_options;
    this.updateDetails();
  };

  getVariantFromOpt = () => {
    let current_values = this.activeOptions;
    let current_variant = null;

    const { a2cButton, main_price, compare_price, form } = this.elements;
    // let unavailable_message = document.querySelector(".unavailable_message");

    this.product_data.variants.forEach((variant) => {
      for (var e = true, i = 0; i < current_values.length; i++) {
        if (variant["option" + (i + 1)] != current_values[i]) e = false;
      }
      if (e !== false) current_variant = variant;
    });

    a2cButton.disabled = true;
    // unavailable_message.style.display = 'none';

    if (doodle.cn(current_variant)) {
      this.activeVariant = null;
      main_price.innerHTML = `<span class="text-danger">Currently not available</span>`;
      compare_price.innerHTML = "";
    } else {
      const { available, price, compare_at_price } = current_variant;
      if (available) {
        a2cButton.disabled = false;
        main_price.innerHTML = doodle.formatMoney(price);
        compare_price.innerHTML = !doodle.cn(compare_at_price)
          ? doodle.formatMoney(compare_at_price)
          : "";
      } else {
        main_price.innerHTML = `<span class="text-danger">Sorry, this item is out of stock</span>`;
        compare_price.innerHTML = "";
        
        // main_price.innerHTML = doodle.formatMoney(price);
        // compare_price.innerHTML = !doodle.cn(compare_at_price)
        //   ? doodle.formatMoney(compare_at_price)
        //   : "";

        // unavailable_message.style.display = 'block';
      }

      form.querySelector("[name='id']").value = this.activeVariant =
        current_variant.id;
    }

    this.updateDetails();
  };

  updateDetails = () => {
    let historyState = !doodle.cn(this.activeVariant)
      ? "?variant=" + this.activeVariant
      : location.origin + location.pathname;

    history.replaceState(null, "", historyState);
  };

  addToCart() {
    const { form } = this.elements;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let submit_textnode = form.querySelector('[type="submit"] [data-text]');
      let submit_textnode_text = submit_textnode.dataset.text;

      submit_textnode.textContent = submit_textnode.dataset.text =
        submit_textnode.dataset.working;

      let variant_id = form.querySelector('[name="id"]').value;
      let formData = {
        items: [
          {
            id: variant_id,
            quantity: 1,
          },
        ],
      };
      Theme.useCartApi(formData, "cart/add.js", function (r) {
        submit_textnode.textContent = submit_textnode.dataset.text =
          submit_textnode.dataset.done;
        setTimeout(() => {
          submit_textnode.textContent = submit_textnode.dataset.text =
            submit_textnode_text;
        }, 2000);
      });
    });
  }

  observe_recommendations() {
    const productRecommendationsSection = document.querySelector(
      ".product-recommendations"
    );
    if (!productRecommendationsSection) return false;
    let config = {
      attributes: false,
      childList: true,
      subtree: false,
    };

    function callback(mutation) {
      if (mutation.type === "childList") {
        Theme.zload(productRecommendationsSection);
      }
    }

    Theme.observer_mutation(productRecommendationsSection, callback, config);
  }

  getColor() {
    document.querySelectorAll("[data-color]").forEach((label) => {
      let x = label.dataset.color;
      ntc.names.forEach((color) => {
        if (color[1].toUpperCase() === x.toUpperCase()) {
          label.style.setProperty("--bg-color", "#" + color[0]);
        }
      });
    });
  }
}

export default Product;
