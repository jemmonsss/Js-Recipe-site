(function () {
  "use strict";

  var btn = document.getElementById("print-btn");
  if (btn) {
    btn.addEventListener("click", function () { window.print(); });
  }

  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    var root = document.documentElement;
    function sync() {
      var isDark = root.getAttribute("data-theme") !== "light";
      toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    }
    sync();
    toggle.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") !== "light";
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      root.className = "theme-" + next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
  }
})();
