(function () {
  "use strict";

  var STORAGE_KEY = "recipe-favorites";

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function setFavorites(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function isFavorite(id) {
    return getFavorites().indexOf(id) !== -1;
  }

  function toggle(id) {
    var list = getFavorites();
    var idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
    setFavorites(list);
    return list.indexOf(id) !== -1;
  }

  function refreshButtons() {
    var favs = getFavorites();
    document.querySelectorAll(".fav-btn").forEach(function (btn) {
      var id = btn.getAttribute("data-recipe");
      var active = favs.indexOf(id) !== -1;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      var label = btn.querySelector(".fav-btn__label");
      if (label) label.textContent = active ? "Saved" : "Save";
      if (!btn.classList.contains("fav-btn--card")) {
        btn.innerHTML = (active ? "♥" : "♡") + (label ? '<span class="fav-btn__label">' + (active ? "Saved" : "Save") + "</span>" : "");
      } else {
        btn.innerHTML = active ? "♥" : "♡";
      }
    });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".fav-btn");
    if (!btn) return;
    e.preventDefault();
    var id = btn.getAttribute("data-recipe");
    toggle(id);
    refreshButtons();
    window.dispatchEvent(new CustomEvent("favorites-changed"));
  });

  document.addEventListener("DOMContentLoaded", refreshButtons);
  window.addEventListener("favorites-changed", refreshButtons);
  window.RecipeFavorites = { getFavorites: getFavorites, isFavorite: isFavorite };
})();
