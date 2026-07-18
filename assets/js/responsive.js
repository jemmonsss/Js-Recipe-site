(function () {
  "use strict";

  var breakpoints = {
    "viewport-sm": 640,
    "viewport-md": 768,
    "viewport-lg": 1024,
    "viewport-xl": 1280
  };

  function applyClasses() {
    var w = window.innerWidth;
    var body = document.body;
    body.classList.remove("viewport-unknown", "viewport-sm", "viewport-md", "viewport-lg", "viewport-xl");
    if (w >= breakpoints["viewport-xl"]) body.classList.add("viewport-xl");
    else if (w >= breakpoints["viewport-lg"]) body.classList.add("viewport-lg");
    else if (w >= breakpoints["viewport-md"]) body.classList.add("viewport-md");
    else if (w >= breakpoints["viewport-sm"]) body.classList.add("viewport-sm");
    else body.classList.add("viewport-sm");

    var orient = window.matchMedia("(orientation: landscape)").matches ? "orientation-landscape" : "orientation-portrait";
    body.classList.remove("orientation-landscape", "orientation-portrait");
    body.classList.add(orient);
  }

  var t;
  function onResize() {
    clearTimeout(t);
    t = setTimeout(applyClasses, 300);
  }

  applyClasses();
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", applyClasses);
})();
