(function () {
  "use strict";

  var minus = document.getElementById("servings-minus");
  var plus = document.getElementById("servings-plus");
  var output = document.getElementById("servings-value");
  var list = document.querySelector(".ingredient-list");

  if (!minus || !plus || !output || !list) return;

  var defaultServings = parseFloat(list.getAttribute("data-default-servings")) || 4;
  var servings = defaultServings;

  function parseQty(str) {
    var m = String(str).match(/^([\d./\s]+)\s*(.*)$/);
    if (!m) return null;
    var numPart = m[1].trim();
    var unit = m[2];
    var num;
    if (numPart.indexOf("/") !== -1) {
      var parts = numPart.split(/\s+/);
      num = 0;
      parts.forEach(function (p) {
        var f = p.split("/");
        num += parseFloat(f[0]) / parseFloat(f[1] || 1);
      });
    } else {
      num = parseFloat(numPart);
    }
    if (isNaN(num)) return null;
    return { num: num, unit: unit };
  }

  function fmt(n) {
    var rounded = Math.round(n * 100) / 100;
    var whole = Math.floor(rounded);
    var frac = rounded - whole;
    var fractions = [[0.25, "1/4"], [0.33, "1/3"], [0.5, "1/2"], [0.66, "2/3"], [0.75, "3/4"]];
    if (frac < 0.01) return String(whole || 0);
    if (frac > 0.99) return String(whole + 1);
    for (var i = 0; i < fractions.length; i++) {
      if (Math.abs(frac - fractions[i][0]) < 0.04) {
        return (whole > 0 ? whole + " " : "") + fractions[i][1];
      }
    }
    return String(rounded);
  }

  function render() {
    output.textContent = servings;
    var factor = servings / defaultServings;
    list.querySelectorAll(".ingredient").forEach(function (li) {
      var original = li.getAttribute("data-qty") || li.textContent;
      var parsed = parseQty(original);
      if (parsed) {
        li.textContent = fmt(parsed.num * factor) + (parsed.unit ? " " + parsed.unit : "");
      } else {
        li.textContent = original;
      }
    });
  }

  minus.addEventListener("click", function () {
    if (servings > 1) { servings--; render(); }
  });
  plus.addEventListener("click", function () {
    if (servings < 100) { servings++; render(); }
  });

  render();
})();
