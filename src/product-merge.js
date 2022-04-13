class ProductMerge {
  constructor() {
    this.final_options = [];
    this.all_variants = [];
    this.activeOptions = [];
    this.activeVariant = null;
    this.dontMerge = false;
    this.form = document.getElementById("AddToCartForm");
    this.a2cButton = this.form.querySelector('[type="submit"]');
    this.variantInput;
    this.init();
  }

  init = () => {
    console.log("ProductMerge init.", "dontMerge is set " + this.dontMerge);

    if (this.dontMerge) {
      return false;
    }

    this.a2cButton.dataset.value = this.a2cButton.value;
    this.activeVariant = window.ds_scripts.current_value;

    if (location.search) {
      let urlParams = location.search.slice(1).split("&");
      let variantParam = urlParams.find((param) => param.includes("variant"));
      let variantId = variantParam.split("=")[1];
      if (!cn(variantId)) {
        this.activeVariant = variantId;
      }
    }

    // return false;
    this.variantsMerge();
    this.optionsMerge();
    setTimeout(() => {
      console.log("slider refresh");
      this.setSwatchSoldout();
      this.setVariantImage(this.activeVariant);
    }, 1000);
  };

  cssColor = (str) => {
    return !str.indexOf(" ") ? str : str.split(" ")[1];
  };

  handleize = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zÀ-ú0-9]+/g, "-")
      .replace(/-$/, "")
      .replace(/^-/, "");
  };

  createHtml = (type, attributes, html) => {
    let el = document.createElement(type);
    Object.entries(attributes).forEach((args) => el.setAttribute(...args));
    html && (el.innerHTML = html);
    return el;
  };

  createSwatch = (type, value, position, index) => {
    let swatch = `<div class="swatch-element ">
        <input type="radio" class="swatches__form--input" 
          id="main-swatch-${index}-${value}" name="${type}" value="${value}" data-position="${position}" ${
      value === this.activeOptions[position - 1] ? "checked" : ""
    }>
        <label class="swatches__form--label" for="main-swatch-${index}-${value}" 
          tabindex="0">${value}</label>
      </div>`;
    if (type === "color") {
      let cssColor = this.cssColor(value)
        ? this.cssColor(value).toLowerCase()
        : "";

      swatch = `<div class="swatch-element color ">
        <input type="radio" class="swatches__form--input" id="main-swatch-${index}-${this.handleize(
        value
      )}" name="${type}" value="${value}" data-position="${position}"  ${
        value === this.activeOptions[position - 1] ? "checked" : ""
      }>
        <label class="swatches__form--label" for="main-swatch-${index}-${this.handleize(
        value
      )}" 
          style="background-color: ${cssColor}; background-image: url(//cdn.shopify.com/s/files/1/2262/5757/files/${this.handleize(
        value
      )}.png?v=1); background-size: contain;"
          tabindex="0">
        </label>
      </div>`;
    }

    return swatch;
  };

  insertAfter = (newNode, existingNode) => {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  };

  variantsMerge = () => {
    let main_variants = window.ds_scripts.main_product.product.variants;
    let merge_variants = window.ds_scripts.related_product.product.variants;

    this.all_variants = main_variants.concat(merge_variants);

    if (this.dontMerge) {
      this.all_variants = main_variants;
    }

    // get initial options in activeOptions
    this.getOptFromVariant();
  };

  optionsMerge = () => {
    let main_options = window.ds_scripts.main_product.options;
    let merge_options = window.ds_scripts.related_product.options;

    let final_options = [];

    main_options.forEach((option) => {
      let matching_option = merge_options.find(
        (opt) => opt.name == option.name
      );
      let updated_values = option.values.concat(matching_option.values);
      final_options.push({
        name: option.name,
        values: updated_values,
        position: option.position,
      });
    });

    if (this.dontMerge) {
      this.final_options = main_options;
    } else {
      this.splitNeonOptions(final_options);
    }
  };

  splitNeonOptions = (all_options) => {
    let final_options = [];

    all_options.forEach((option) => {
      if (option.name.toLowerCase() == "color") {
        let classic_colors = {
          name: "Classic colors",
          type: option.name.toLowerCase(),
          position: option.position,
          values: option.values.filter(
            (value) => !value.toLowerCase().includes("neon")
          ),
        };
        final_options.push(classic_colors);

        let neon_colors = {
          name: "Neon colors",
          type: option.name.toLowerCase(),
          position: option.position,
          values: option.values.filter((value) =>
            value.toLowerCase().includes("neon")
          ),
        };
        final_options.push(neon_colors);
      } else if (option.name.toLowerCase() == "size") {
        let all_sizes = {
          name: "Size",
          type: option.name.toLowerCase(),
          position: option.position,
          values: [...new Set(option.values)],
        };
        final_options.push(all_sizes);
      }
    });

    this.final_options = final_options;
    this.addToForm();
  };

  addToForm = () => {
    // remove default VariantID
    let oldVariants = this.form.querySelector(".variants");
    this.form
      .querySelectorAll('[name="id"]')
      .forEach((input) => input.remove());
    oldVariants.style.display = "none";
    oldVariants.innerHTML = "";

    // createVariantID
    this.variantInput = this.createHtml("input", {
      type: "hidden",
      value: this.activeVariant,
      name: "id",
    });
    this.insertAfter(this.variantInput, oldVariants);

    let new_variants = this.createHtml("div", { class: "new-variants" });

    // create Swatch inputs
    this.final_options.forEach((option, index) => {
      let label = this.createHtml(
        "p",
        {
          class: "option-label",
        },
        `<span>${option.name}:</span> <span class='selected-option'></span>`
      );

      let wrapper = this.createHtml("div", {
        class: "swatch clearfix",
        "data-option-index": index,
      });

      wrapper.append(label);

      option.values.forEach((value, i) => {
        let swatch = this.createSwatch(option.type, value, option.position, i);
        wrapper.innerHTML += swatch;
      });

      new_variants.append(wrapper);
    });

    // append everything to form
    this.insertAfter(new_variants, oldVariants);

    // on change event
    new_variants.querySelectorAll("input[type=radio]").forEach((radio) =>
      radio.addEventListener("change", () => {
        this.activeOptions[radio.dataset.position - 1] = radio.value;
        this.getVariantFromOpt();
        this.setSwatchSoldout();
      })
    );
  };

  getOptFromVariant = () => {
    let current_variant = this.activeVariant;
    let current_options = [];
    this.all_variants.forEach((variant) => {
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
    this.all_variants.forEach((variant) => {
      for (var e = true, i = 0; i < current_values.length; i++) {
        if (variant["option" + (i + 1)] != current_values[i]) e = false;
      }
      if (e !== false) current_variant = variant;
    });

    let priceSpan = document.querySelector(
      ".product-blocks .price-item--regular"
    );

    if (current_variant) {
      this.activeVariant = current_variant.id;
      let price = current_variant.available
        ? Shopify.formatMoney(current_variant.price)
        : "Unavailable";
      priceSpan.textContent = price;
      this.a2cButton.disabled = false;
      this.a2cButton.value = this.a2cButton.dataset.value;
      this.variantInput.value = current_variant.id;

      this.setVariantImage(current_variant.id);
    } else {
      this.activeVariant = null;
      priceSpan.textContent = "Unavailable";
      this.a2cButton.disabled = true;
      this.a2cButton.value = "Unavailable";
    }
    this.updateDetails();
  };

  updateDetails = () => {
    let historyState = !cn(this.activeVariant)
      ? "?variant=" + this.activeVariant
      : location.origin + location.pathname;

    history.replaceState(null, "", historyState);
    this.setSwatchSoldout();
  };

  setSwatchSoldout = () => {
    let newVariants = document.querySelector(".new-variants");
    if (cn(newVariants)) {
      return false;
    }
    let inputs = newVariants.querySelectorAll("[type=radio]");

    let selected = {};
    let selected_inputs = newVariants.querySelectorAll("[type=radio]:checked");

    selected_inputs.forEach(function (element) {
      let option = "option" + element.getAttribute("data-position");
      let value = element.value;
      selected[option] = value;
    });

    inputs.forEach((element) => {
      // debugger;
      let available = false;
      let current_option = "option" + element.getAttribute("data-position");
      let current_value = element.value;
      let all_options = ["option1", "option2", "option3"];
      let other_options = all_options.filter(function (option) {
        return selected[option] && option != current_option;
      });

      this.all_variants.forEach((variant) => {
        if (!variant.available) {
          return;
        }
        if (variant[current_option] != current_value) {
          return;
        }
        if (
          variant[other_options[0]] == selected[other_options[0]] &&
          variant[other_options[1]] == selected[other_options[1]]
        ) {
          available = true;
          return;
        }
      });

      !available
        ? element.parentElement.classList.add("soldout")
        : element.parentElement.classList.remove("soldout");
    });
  };

  setVariantImage = (v_id) => {
    let variant = this.all_variants.find((variant) => variant.id == v_id);
    if (cn(variant.featured_media)) return false;
    
    let id = variant.featured_media.id;
    let main = document.querySelector(".js-carousel-main");
    let el = main.querySelector("[data-image-id='" + id + "']");

    let index = [...el.parentElement.children].indexOf(el);

    let curFlkty = Flickity.data(main);
    curFlkty.select(index);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  new ProductMerge();
});
