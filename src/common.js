class PTtheme {
  constructor() {
    this.initEvents();
  }

  initEvents() {
    this.header();
    this.tooltips();
    this.clickEvents();
    this.zload();
    this.observe_cart();
    this.collection_filter();
  }

  header() {
    let options = {
      offset: 40,
      tolerance: {
        up: 10,
        down: 0,
      },
    };

    var fixedHeader = document.querySelector(".headroom");
    var headroom = new Headroom(fixedHeader, options);
    headroom.init();

    function headerHeight() {
      const headerMain = document.querySelector(".headroom");
      const headerCompensate = document.querySelector(".header-compnsator");

      const Headerheight = headerMain.offsetHeight;
      headerCompensate.style.height = `${Headerheight}px`;
    }

    headerHeight();

    // header scroll
    var hasClass = false;
    document.querySelectorAll("section").forEach((section) => {
      if (section.classList.contains("transparent-header")) hasClass = true;
    });
    hasClass
      ? document.querySelector("header").classList.add("header-absolute")
      : document.querySelector("header").classList.remove("header-absolute");
  }

  tooltips() {
    // bootstrap tooltips
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-toggle="tooltip"]')
    );
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  sharer(url, title = "", text = "") {
    if (navigator.share) {
      console.log("first");
      navigator
        .share({
          url,
          title,
          text,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Share not supported on this browser, do it the old way.");
    }
  }

  clickEvents() {
    this.eventBinder("click", "body", ".share_button", (e) => {
      this.sharer(e.target.dataset.productlink, e.target.dataset.product);
    });

    // for navbar trigger
    this.eventBinder("click", "body", ".nav-toggle", (e) => {
      document.querySelector(".nav-main").classList.toggle("opened");
    });

    // for search trigger
    this.eventBinder("click", "body", ".search-toggle", (e) => {
      document.querySelector(".search-bar-main").classList.toggle("opened");
    });

    // for cart trigger
    this.eventBinder("click", "body", ".cart-toggle", (e) => {
      document.querySelector(".cart-main").classList.toggle("opened");
    });

    // for filter trigger
    this.eventBinder("click", "body", ".filter-toggle", (e) => {
      document.querySelector(".filter-main").classList.toggle("opened");
    });

    this.eventBinder("click", "body", "#footer_form", (e) => {
      if (!document.getElementById("FooterContactForm")) {
        document
          .querySelector(".footer-error-message")
          .classList.remove("d-none");
      }
    });

    this.eventBinder("click", "body", "#custom-wishlist-btn", (e) => {
      if (
        document.getElementById("wishlisthero-product-page-button-container")
      ) {
        let button = document.querySelector(
          "#wishlisthero-product-page-button-container button"
        );
        button.click();
      } else {
        console.warn("Wishlist element not found!");
      }
    });

    // for sort trigger
    this.eventBinder(
      "click",
      "body",
      ".sort-menu .dropdown-item",
      function (e) {
        document.querySelector("#sort-by-text").textContent =
          e.target.textContent;
      }
    );
    this.eventBinder("click", "body", ".filter-reset", function (e) {
      document.querySelector("form.filter-form").reset();
      document
        .querySelector(".filter-footer")
        .classList.remove("filters-active");
    });

    // for closing all openables trigger
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.key === "Escape") {
        document.querySelectorAll(".openable").forEach((openable) => {
          openable.classList.remove("opened");
        });
      }
    };
  }

  zload(selector = document) {
    selector.querySelectorAll("img.zload").forEach((elm) => {
      function callback(inScreen) {
        if (inScreen) {
          let src = new URL(elm.src);
          let width = parseInt(elm.width);
          let height = parseInt(elm.height);
          let aspect_ratio = width / height;
          width = width > height ? width : width / aspect_ratio;

          let elm_width = elm.getAttribute("width") + 100;
          src.searchParams.set("width", elm_width < width ? elm_width : width);
          elm.src = src;
          elm.dataset.x = aspect_ratio;
          setTimeout(() => {
            elm.classList.toggle("zload");
            elm.classList.toggle("zloaded");
          }, 500);
        }
      }
      this.observer_intersection(elm, callback, 1, 0);
    });
  }

  observe_cart() {
    let sidecart = document.querySelector("#cart-items-ajax");
    let config = {
      attributes: false,
      childList: true,
      subtree: false,
    };

    function callback(mutation) {
      if (mutation.type === "childList") {
        Theme.zload(sidecart);
      }
    }

    this.observer_mutation(sidecart, callback, config);
  }

  // global APIs
  eventBinder(
    event_type,
    ancestor_element,
    target_element_selector,
    listener_function
  ) {
    document
      .querySelector(ancestor_element)
      .addEventListener(event_type, function (event) {
        if (
          event.target &&
          event.target.matches &&
          event.target.matches(target_element_selector)
        ) {
          listener_function(event);
        }
      });
  }

  async useCartApi(formData, endpoint, callback) {
    try {
      const response = await fetch(Shopify.routes.root + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json());

      if (response.items) {
        let newCart = await this.updateCartContent();
        if (document.querySelector("#cart-items-ajax"))
          document.querySelector("#cart-items-ajax").innerHTML = newCart;
        if (document.querySelector(".cart-main"))
          document.querySelector(".cart-main").classList.add("opened");

        this.updateCartCount();

        if (callback && typeof callback == "function") callback(response);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async updateCartContent() {
    try {
      const response = await fetch(Shopify.routes.root + "cart?view=ajax");
      j;
      return await response.text();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  updateCartCount() {
    let cartData = JSON.parse(
      document.querySelector("#sidecart_data").textContent
    );
    if (doodle.cn(cartData)) return false;
    document.querySelector("#cart_count").textContent = cartData.item_count;
  }

  observer_intersection(target, cb, removeObserver = false, threshold = 0) {
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
    io.observe(target);
  }

  observer_mutation(target, cb, config) {
    // Options for the observer (which mutations to observe)
    var config = config || {
      attributes: true,
      childList: true,
      subtree: true,
    };

    // Callback function to execute when mutations are observed
    const callback = function (mutationList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationList) {
        typeof cb === "function" && cb(mutation);
      }
    };

    const mo = new MutationObserver(callback);
    mo.observe(target, config);

    // Later, you can stop observing
    // mo.disconnect();
  }

  collection_filter() {
    // let collection_link = document.querySelectorAll(".collections-list a");
    // if (!collection_link.length) return false;

    this.eventBinder("click", "body", ".collections-list a", async (e) => {
      e.preventDefault();
      let collection = new URL(e.target.href).pathname;
      document
        .querySelector(".collections-list a.active")
        .classList.remove("active");
      try {
        await fetch(collection + "?view=ajax")
          .then((res) => res.text())
          .then((data) => {
            document.getElementById("filtered_products").innerHTML = data;
            e.target.classList.add("active");
          });
      } catch (error) {
        console.log("Error:", error);
      }
    });
  }

  clo(message) {
    console.log(message);
  }
}

export default PTtheme;
