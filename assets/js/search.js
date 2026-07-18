(function () {
  "use strict";

  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  var grid = document.getElementById("recipe-grid");
  var emptyMsg = document.getElementById("recipe-empty");
  var searchInput = document.getElementById("search-input");
  var searchClear = document.getElementById("search-clear");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-bar__chip"));

  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".recipe-card"));
  var activeCategory = "all";
  var query = "";

  function getCategories(card) {
    return (card.getAttribute("data-categories") || "").split(" ").filter(Boolean);
  }

  function applyFilters() {
    var visible = 0;
    cards.forEach(function (card) {
      var catMatch = activeCategory === "all" || getCategories(card).indexOf(activeCategory) !== -1;
      var q = query.trim().toLowerCase();
      var textMatch = !q ||
        (card.getAttribute("data-title") || "").indexOf(q) !== -1 ||
        (card.getAttribute("data-ingredients") || "").indexOf(q) !== -1 ||
        (card.getAttribute("data-tags") || "").indexOf(q) !== -1;
      var show = catMatch && textMatch;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    if (emptyMsg) emptyMsg.hidden = visible !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      activeCategory = chip.getAttribute("data-filter");
      applyFilters();
    });
  });

  if (searchInput) {
    var onSearch = debounce(function () {
      query = searchInput.value;
      if (searchClear) searchClear.hidden = query.length === 0;
      applyFilters();
    }, 200);
    searchInput.addEventListener("input", onSearch);
  }

  if (searchClear) {
    searchClear.addEventListener("click", function () {
      searchInput.value = "";
      query = "";
      searchClear.hidden = true;
      applyFilters();
      searchInput.focus();
    });
  }
})();
