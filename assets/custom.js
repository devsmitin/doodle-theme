class customScripts {
  constructor() {
    this.elements = this._getElements();
    if (Object.keys(this.elements).length === 0) return;
    this._initEvents();
  }

  _getElements() {
    const form = document.querySelector(
      window.ds_storage.selectors.productForm
    );
    return form
      ? {
          form,
          a2cbtn: form.querySelector(window.ds_storage.selectors.a2cbtn),
        }
      : {};
  }

  _initEvents() {
    this._stickyForm();
  }

  _insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);
  }

  _addStyles(node, styleObj) {
    Object.assign(node.style, styleObj);
  }

  _observer(targets, cb, removeObserver = false, threshold = 0) {
    // options:
    // cb: callback function that accepts boolean argument
    // removeObserver: removes observer once target is in screen
    // threshold: 0 = element fully in screen, 1 = element partially in screen
    const options = {
      rootMargin: "0px",
      threshold: threshold,
    };
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeof cb === "function" && cb(true);
          removeObserver && observer.unobserve(entry.target);
        } else {
          typeof cb === "function" && cb(false);
        }
      });
    };

    const io = new IntersectionObserver(callback, options);
    targets.forEach((target) => {
      io.observe(target);
    });
  }

  _stickyForm() {
    let { form, a2cbtn } = this.elements;

    // create placeholder and wrapper elements
    let cartWrapper_placeholder = document.createElement("span");
    cartWrapper_placeholder.setAttribute("class", "ds-btn-placeholder");
    
    let cartWrapper = document.createElement("span");
    cartWrapper.setAttribute("class", "ds-fixed-btn-wrapper");

    // append wrapper to the placeholder
    cartWrapper_placeholder.appendChild(cartWrapper);

    // insert placeholder before a2c button
    this._insertBefore(cartWrapper_placeholder, a2cbtn);

    // cloned a2cbtn
    const cloned_a2c = a2cbtn.cloneNode(true);
    this._insertBefore(cloned_a2c, a2cbtn);

    // move a2c button inside our wrapper
    cartWrapper.appendChild(cloned_a2c);

    // get style of a2c btn
    let btn_style = a2cbtn.currentStyle || window.getComputedStyle(a2cbtn);

    if (window.ds_storage.scrollTop) {
      cloned_a2c.setAttribute("type", "button");
      cloned_a2c.addEventListener("click", function (e) {
        e.preventDefault();
        form.parentNode.scrollIntoView();
      });
    }

    document.querySelector(
      "body"
    ).style.paddingBottom = `calc(${btn_style.height} + 40px`;

    const callback = (inScreen) => {
      if (!inScreen) {
        cartWrapper.classList.add("isfixed");
        window.ds_storage.btn_inscreen = false;
      } else {
        cartWrapper.classList.remove("isfixed");
        window.ds_storage.btn_inscreen = true;
      }
    };

    this._observer(
      [form],
      callback,
      window.ds_storage.config.removeObserver,
      window.ds_storage.config.threshold
    );
  }
}
