Shopify.queryParams = {};
if (location.search.length) {
  for (
    var aKeyValue, i = 0, aCouples = location.search.slice(1).split("&");
    i < aCouples.length;
    i++
  ) {
    aKeyValue = aCouples[i].split("=");
    if (aKeyValue.length > 1) {
      Shopify.queryParams[decodeURIComponent(aKeyValue[0])] =
        decodeURIComponent(aKeyValue[1]);
    }
  }
}

// Add existing sort parameters to current URL
document.querySelectorAll("[data-sort]").forEach((option) => {
  option.addEventListener("click", () => {
    var value = option.dataset.sort;
    Shopify.queryParams.sort_by = value;
    location.search = new URLSearchParams(Shopify.queryParams).toString();
  });
});

// on load check for sort by option & replace name
window.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("sort-by-text")) return false;
  let current_order = document.getElementById("sort-by-text").textContent;
  let queryParamsSort = Shopify.queryParams.sort_by || current_order
  document.getElementById("sort-by-text").textContent = document.querySelector(
    "[data-sort='" + queryParamsSort + "']"
  ).textContent;
});
