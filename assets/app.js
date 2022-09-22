const arrowLeft =
  '<svg width="32" height="18" fill="none" viewBox="0 0 32 18"><path stroke="#0B160E" stroke-linecap="round" stroke-linejoin="round" d="M31 9H2M10 1 1 9l9 8"/></svg>';

const arrowRight =
  '<svg width="32" height="18" fill="none" viewBox="0 0 32 18"><path stroke="#0B160E" stroke-linecap="round" stroke-linejoin="round" d="M1 9h29M22 17l9-8-9-8"/></svg>';

function headerHeight() {
  const headerMain = document.querySelector(".headroom");
  const headerCompensate = document.querySelector(".header-compnsator");

  const Headerheight = headerMain.offsetHeight;
  headerCompensate.style.height = `${Headerheight}px`;
}

headerHeight();

// for navbar trigger
$(document).on("click", ".nav-toggle", function (e) {
  $(".nav-main").toggleClass("opened");
});
// for search trigger
$(document).on("click", ".search-toggle", function (e) {
  $(".search-bar-main").toggleClass("opened");
});
// for cart trigger
$(document).on("click", ".cart-toggle", function (e) {
  $(".cart-main").toggleClass("opened");
});
// for filter trigger
$(document).on("click", ".filter-toggle", function (e) {
  $(".filter-main").toggleClass("opened");
});
// for sort trigger
$(document).on("click", ".sort-menu .dropdown-item", function () {
  $("#sort-by-text").text($(this).text());
});
$(document).on("click", ".filter-reset", function () {
  $(this).closest("form.filter-form")[0].reset();
  $(this).closest(".filter-footer").removeClass("filters-active");
});
// for closing all openables trigger
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    $(".openable").removeClass("opened");
  }
});

$(document).ready(function () {
  // header scroll
  if ($("section").hasClass("transparent-header")) {
    $("header").addClass("header-absolute");
  } else {
    $("header").removeClass("header-absolute");
  }

  // filters active inactive
  $(".single-filter > input:checkbox").change(function () {
    if ($(".single-filter > input:checkbox").filter(":checked").length > 0) {
      $(".filter-footer").addClass("filters-active");
      return false;
    } else {
      $(".filter-footer").removeClass("filters-active");
    }
  });

  if ($(".single-filter > input:checkbox").filter(":checked").length > 0) {
    $(".filter-footer").addClass("filters-active");
    return false;
  }
});

// headroom
var options = {
  offset: 40,
  tolerance: {
    up: 10,
    down: 0,
  },
};

var fixedHeader = document.querySelector(".headroom");
// construct an instance of Headroom, passing the element
var headroom = new Headroom(fixedHeader, options);
// initialise
headroom.init();

// bootstrap tooltips
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
