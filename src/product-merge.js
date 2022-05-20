class ProductMerge {
  constructor() {
    this.final_options = [];
    this.all_variants = [];
    this.activeOptions = [];
    this.activeVariant = null;
    this.dontMerge = false;
    this.variantInput;
    this.elements = this.getElements();
    this.init();
  }

  getElements = () => {
    const form = document.querySelector(doodle.selectors.form_id);
    return form
      ? {
          form,
          a2cButton: form.querySelector('[type="submit"]'),
          details: document.querySelector(doodle.selectors.details),
          oldOptions:
            document.querySelector(doodle.selectors.variants) ||
            form.querySelector('[name="id"]').parentElement,
          thumbs: document.querySelector(doodle.selectors.thumbnails),
        }
      : false;
  };

  init = () => {
    console.log(
      "ProductMerge init.",
      "dontMerge is set to " + this.dontMerge + "."
    );

    if (this.dontMerge) {
      return false;
    }

    let { a2cButton } = this.elements;
    a2cButton.dataset.value =
      a2cButton.value.trim() || a2cButton.textContent.trim();
    this.activeVariant = doodle.current_value;

    if (location.search) {
      let urlParams = location.search.slice(1).split("&");
      let variantParam = urlParams.find((param) => param.includes("variant"));
      if (!doodle.cn(variantParam)) {
        let variantId = variantParam.split("=")[1];
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
    return str.split(" ").length > 1 ? str.split(" ")[1] : str;
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
    let label_style = "";
    let { file_img_url } = doodle;
    if (type === "color") {
      let cssColor = this.cssColor(value)
        ? this.cssColor(value).toLowerCase()
        : "";
      label_style = `style="background-color: ${cssColor}; background-image: url(${
        file_img_url + "/" + this.handleize(value)
      }.png?v=1); background-size: contain;"`;
    }

    let swatch = `<div class="swatch-element ${
      type === "color" ? "color" : ""
    } ">
        <input type="radio" class="swatches__form--input" 
          id="main-swatch-${index}-${this.handleize(value)}" 
          name="${type}" value="${value}" data-position="${position}" 
          ${value === this.activeOptions[position - 1] ? "checked" : ""}
        >
        <label class="swatches__form--label" 
          for="main-swatch-${index}-${this.handleize(value)}" ${label_style}
          tabindex="0" title="${value}">${value}</label>
      </div>`;

    return swatch;
  };

  insertAfter = (newNode, existingNode) => {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  };

  variantsMerge = () => {
    let main_variants = doodle.main_product.product.variants || [];
    let merge_variants = doodle.related_product.product.variants || [];

    this.all_variants = main_variants.concat(merge_variants);

    if (this.dontMerge) {
      this.all_variants = main_variants;
    }

    // console.log("this.all_variants", this.all_variants);
    // get initial options in activeOptions
    this.getOptFromVariant();
  };

  optionsMerge = () => {
    let main_options = doodle.main_product.options || [];
    let merge_options = doodle.related_product.options || [];

    let final_options = [];

    main_options.forEach((option) => {
      let matching_option = merge_options.find(
        (opt) => opt.name == option.name
      );
      let updated_values = matching_option
        ? option.values.concat(matching_option.values)
        : option.values;

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

    // console.log("final_options", final_options);
  };

  splitNeonOptions = (all_options) => {
    let final_options = [];

    all_options.forEach((option) => {
      if (option.name.toLowerCase() == "color") {
        let classic_colors = {
          name: "Core colors",
          type: option.name.toLowerCase(),
          position: option.position,
          values: option.values.filter(
            (value) => !value.toLowerCase().includes("neon")
          ),
        };
        final_options.push(classic_colors);

        let neon_colors = {
          name: "Seasonal colors",
          type: option.name.toLowerCase(),
          position: option.position,
          values: option.values.filter((value) =>
            value.toLowerCase().includes("neon")
          ),
        };

        if (neon_colors.values.size) {
          final_options.push(neon_colors);
        }
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
    this.elements.form
      .querySelectorAll('[name="id"]')
      .forEach((input) => input.remove());

    let { oldOptions } = this.elements;
    if (!oldOptions) {
      console.error(
        "Product merge will not work with this theme. Please connect with developer."
      );
      return false;
    }
    oldOptions.style.display = "none";
    oldOptions.innerHTML = "";

    // createVariantID
    this.variantInput = this.createHtml("input", {
      type: "hidden",
      value: this.activeVariant,
      name: "id",
    });
    this.insertAfter(this.variantInput, oldOptions);

    let new_variants = this.createHtml("div", { class: "new-variants" });

    // create Swatch inputs
    this.final_options.forEach((option, index) => {
      if (!option.values.length) {
        return false;
      }
      let label = this.createHtml(
        "p",
        { class: "option-label" },
        `<span>${option.name}:</span>
          <span class="selected-option" data-value-for="${option.type}">
          </span>`
      );

      let wrapper = this.createHtml("div", {
        class: "ds-swatch clearfix",
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
    this.insertAfter(new_variants, oldOptions);

    // add active labels
    new_variants
      .querySelectorAll("input[type=radio]:checked")
      .forEach((radio) => this.changeLabel(radio));

    // on change event
    new_variants.querySelectorAll("input[type=radio]").forEach((radio) =>
      radio.addEventListener("change", () => {
        this.activeOptions[radio.dataset.position - 1] = radio.value;
        this.getVariantFromOpt();
        this.setSwatchSoldout();
        this.changeLabel(radio);
      })
    );
  };

  changeLabel = (elm) => {
    let opt_name = elm.name;
    let { details } = this.elements;
    // console.log("opt_name", opt_name);
    details
      .querySelectorAll('[data-value-for="' + opt_name + '"]')
      .forEach((label) => {
        label.textContent = "";
      });

    elm.closest(".swatch").querySelector("[data-value-for]").textContent =
      elm.value;
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

    let priceSpan = this.elements.details.querySelector(".price-item--regular");
    let { a2cButton } = this.elements;

    if (current_variant) {
      this.activeVariant = current_variant.id;
      // let price = current_variant.available
      //   ? Shopify.formatMoney(current_variant.price)
      //   : "Unavailable";
      priceSpan.textContent = Shopify.formatMoney(current_variant.price);
      a2cButton.disabled = !current_variant.available;
      a2cButton.value = current_variant.available
        ? a2cButton.dataset.value
        : "Unavailable";
      a2cButton.textContent = current_variant.available
        ? a2cButton.dataset.value
        : "Unavailable";
      this.variantInput.value = current_variant.id;

      // console.log(
      //   current_variant.available,
      //   a2cButton.textContent,
      //   a2cButton.dataset.value
      // );

      this.setVariantImage(current_variant.id);
    } else {
      this.activeVariant = null;
      // priceSpan.textContent = "Unavailable";
      a2cButton.disabled = true;
      a2cButton.value = "Unavailable";
      a2cButton.textContent = "Unavailable";
    }
    this.updateDetails();
  };

  updateDetails = () => {
    let historyState = !doodle.cn(this.activeVariant)
      ? "?variant=" + this.activeVariant
      : location.origin + location.pathname;

    history.replaceState(null, "", historyState);
    this.setSwatchSoldout();
  };

  setSwatchSoldout = () => {
    let newVariants = document.querySelector(".new-variants");
    if (doodle.cn(newVariants)) {
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
    if (doodle.cn(variant.featured_media)) return false;

    let id = variant.featured_media.id;
    let { thumbs } = this.elements;
    let image = thumbs.querySelector("[data-image-id='" + id + "']");

    let index = [...image.parentElement.children].indexOf(image);

    try {
      let curFlkty = Flickity.data(thumbs);
      curFlkty.select(index);
    } catch (error) {
      console.log(
        "Something went wrong : Flickity. Trying to click on thumbnail image instead."
      );
      image.parentElement.click();
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  doodle.product_merge_enabled && new ProductMerge();
});
