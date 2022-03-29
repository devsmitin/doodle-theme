class ProductPage {
  constructor() {
    this.selectors = document.querySelectorAll(".variant-option-select");
    this.variants = window._product_data.variants;
    this.initEvents();
  }

  initEvents() {
    this.setInitialVariant();
    this.variantChange();
  }

  setInitialVariant = () => {
    let c_variant = this.getVariant();
    this.active_variant = c_variant;
    history.replaceState(null, "", "?variant=" + c_variant.id + "");
  };

  variantChange = () => {
    this.selectors.forEach((option) => {
      option.addEventListener("change", () => {
        let c_variant = this.getVariant();
        this.active_variant = c_variant;
        history.replaceState(null, "", "?variant=" + c_variant.id + "");

        let form = option.closest('[action="/cart/add"]');
        form.querySelector('[name="id"]').value = c_variant.id;
      });
    });
  };

  selectedValues = () => {
    for (var values = [], i = 0; i < this.selectors.length; i++) {
      var { value } = this.selectors[i];
      values.push(value);
    }
    return values;
  };

  getVariant = () => {
    var current_values = this.selectedValues();
    var current_variant = null;
    this.variants.forEach((variant) => {
      for (var e = true, i = 0; i < current_values.length; i++) {
        if (variant["option" + (i + 1)] != current_values[i]) e = false;
      }
      if (e !== false) current_variant = variant;
    });
    return current_variant;
  };
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.contains("product") && new ProductPage();
});
