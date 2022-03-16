class TWTheme {
  constructor() {
    this.theme_name = "Tailwind Theme";
    this.initEvents();
  }

  initEvents() {
    console.log("Hello World!")
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("document is ready. Events will work now.");
  new TWTheme();
});
