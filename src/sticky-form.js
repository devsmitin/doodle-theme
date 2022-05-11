class StickyA2c {
  constructor() {
    this.elements = this.getElements();
    if (Object.keys(this.elements).length === 0) return;
    this.initEvents();
  }

  getElements() {
    const form = document.querySelector(doodle.selectors.productForm);
    return form
      ? {
          form,
          a2cbtn: form.querySelector(doodle.selectors.a2cbtn),
        }
      : {};
  }

  initEvents() {
    this.stickyForm();
  }

  insertBefore(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);
  }

  addStyles(node, styleObj) {
    Object.assign(node.style, styleObj);
  }

  observer(targets, cb, removeObserver = false, threshold = 0) {
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

  stickyForm() {
    let { form, a2cbtn } = this.elements;

    // create placeholder and wrapper elements
    let cartWrapper_placeholder = document.createElement("span");
    cartWrapper_placeholder.setAttribute("class", "ds-btn-placeholder");

    let cartWrapper = document.createElement("span");
    cartWrapper.setAttribute("class", "ds-fixed-btn-wrapper");

    // append wrapper to the placeholder
    cartWrapper_placeholder.appendChild(cartWrapper);

    // console.log("a2cbtn", a2cbtn);
    // insert placeholder before a2c button
    this.insertBefore(cartWrapper_placeholder, a2cbtn);

    // console.log("cloned_a2c", cloned_a2c);
    // cloned a2cbtn
    const cloned_a2c = a2cbtn.cloneNode(true);
    this.insertBefore(cloned_a2c, a2cbtn);

    // move a2c button inside our wrapper
    cartWrapper.appendChild(cloned_a2c);

    // get style of a2c btn
    let btn_style = a2cbtn.currentStyle || window.getComputedStyle(a2cbtn);

    if (doodle.scrollTop) {
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
        doodle.btn_inscreen = false;
      } else {
        cartWrapper.classList.remove("isfixed");
        doodle.btn_inscreen = true;
      }
    };

    this.observer(
      [form],
      callback,
      doodle.config.removeObserver,
      doodle.config.threshold
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  doodle.sticky_a2c_enable && new StickyA2c();
});
