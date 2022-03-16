class TWTheme {
  constructor() {
    this.theme_name = "Tailwind Theme";
    this.initEvents();
  }

  initEvents() {
    this.clickHandler();
  }

  clickHandler = () => {
    let that = this;
    let togglers = document.querySelectorAll("[data-toggle]");
    togglers.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        let target = this.dataset.target;
        document.querySelector(target).classList.toggle("hidden");
      });
    });

    let counters = document.querySelectorAll("[data-counter]");
    counters.forEach((counter) => {
      let input = counter.parentElement.querySelector("input");
      let action = counter.dataset.action;
      counter.addEventListener("click", function () {
        if (action === "plus") {
          input.value =
            parseInt(input.value) + 1 > 0 ? parseInt(input.value) + 1 : 1;
        } else if (parseInt(input.value) > 1) {
          input.value = parseInt(input.value) - 1;
        }
      });
    });
  };
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("document is ready. Events will work now.");
  new TWTheme();
});
