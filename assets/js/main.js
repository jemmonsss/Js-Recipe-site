(function () {
  "use strict";

  var btn = document.getElementById("print-btn");
  if (btn) {
    btn.addEventListener("click", function () { window.print(); });
  }
})();
