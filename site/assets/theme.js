/* Runs before the page is drawn so the saved light/dark choice never flashes. */
(function () {
  var r = document.documentElement;
  r.classList.add("js");
  try {
    r.dataset.theme = localStorage.getItem("l1c-theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  } catch (e) {
    r.dataset.theme = "light";
  }
})();
