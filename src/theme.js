class TWTheme {
  constructor() {
    this.theme_name = "Tailwind Theme";
    this.initEvents();
  }

  initEvents() {
    this.clickHandler();
    this.logCountry();
  }

  logCountry = () => {
    let ul = doodle.getCookie("user_location");
    if (!doodle.cn(ul)) {
      ul = JSON.parse(ul);
    } else {
      fetch("https://ipinfo.io/json")
        .then((data) => data.json())
        .then((res) => {
          if (res.ok) {
            doodle.setCookie("user_location", JSON.stringify(res), 3);
            ul = res;
          }
        });
    }
    typeof ul === "object" &&
      console.log(`You're browsing from ${ul.city}, ${ul.country}. 😈`);
  };

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
