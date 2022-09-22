Shopify.queryParams = {};

class Collection {
  constructor() {
    this.init();
  }

  init() {
    if (location.search.length) {
      var aCouples = location.search.slice(1).split("&");
      for (var i = 0; i < aCouples.length; i++) {
        var aKeyValue = aCouples[i].split("=");
        if (aKeyValue.length > 1) {
          Shopify.queryParams[decodeURIComponent(aKeyValue[0])] =
            decodeURIComponent(aKeyValue[1]);
        }
      }
    }

    // Add existing sort parameters to current URL
    Theme.eventBinder("click", "body", "[data-sort]", function (e) {
      var value = e.target.dataset.sort;
      Shopify.queryParams.sort_by = value;
      location.search = new URLSearchParams(Shopify.queryParams).toString();
    });

    // on load check for sort by option & replace name
    let sorter = document.querySelector("#sort-by-text");
    if (!sorter) return false;
    let current_order = sorter.textContent;
    let queryParamsSort = Shopify.queryParams.sort_by || current_order;
    sorter.textContent = document.querySelector(
      "[data-sort='" + queryParamsSort + "']"
    ).textContent;

    // filters active inactive
    let checkbox_selector = ".single-filter > input[type=checkbox]";
    Theme.eventBinder("change", "body", checkbox_selector, function (e) {
      if (
        document.querySelectorAll(checkbox_selector + ":checked").length > 0
      ) {
        document
          .querySelector(".filter-footer")
          .classList.add("filters-active");
      } else {
        document
          .querySelector(".filter-footer")
          .classList.remove("filters-active");
      }
    });

    if (document.querySelectorAll(checkbox_selector + ":checked").length > 0) {
      document.querySelector(".filter-footer").classList.add("filters-active");
      return false;
    }
  }
}

export default Collection;
