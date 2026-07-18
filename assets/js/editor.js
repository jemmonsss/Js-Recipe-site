(function () {
  "use strict";

  var STORAGE_KEY = "recipe-editor-draft";
  var IMG_MANIFEST = [
    "/assets/img/carbonara.jpg",
    "/assets/img/avocado-toast.jpg",
    "/assets/img/margherita.jpg",
    "/assets/img/tomato-soup.jpg",
    "/assets/img/cookies.jpg",
    "/assets/img/greek-salad.jpg"
  ];

  var TEMPLATES = {
    pasta: {
      title: "Spaghetti Carbonara",
      description: "A classic Italian pasta dish with eggs, cheese, and pancetta.",
      categories: "Pasta, Italian, Dinner",
      tags: "quick, bacon, creamy",
      prep_time: 10, cook_time: 20, servings: 4, difficulty: "Easy",
      ingredients: "400g spaghetti\n200g pancetta\n4 eggs\n100g parmesan\n1 tsp black pepper",
      steps: "Boil the spaghetti until al dente.\nFry the pancetta until crisp.\nWhisk eggs with parmesan.\nToss pasta with pancetta, then stir in eggs off the heat."
    },
    breakfast: {
      title: "Avocado Toast",
      description: "A quick and healthy breakfast with creamy avocado on sourdough.",
      categories: "Breakfast, Vegetarian, Quick",
      tags: "easy, healthy",
      prep_time: 5, cook_time: 5, servings: 2, difficulty: "Easy",
      ingredients: "2 slices sourdough bread\n1 ripe avocado\n1/2 lemon\n1 tbsp olive oil",
      steps: "Toast the bread.\nMash avocado with lemon.\nSpread and drizzle with oil."
    },
    dessert: {
      title: "Chocolate Chip Cookies",
      description: "Chewy, golden cookies loaded with chocolate chips.",
      categories: "Dessert, Baking",
      tags: "sweet, kids",
      prep_time: 15, cook_time: 12, servings: 24, difficulty: "Easy",
      ingredients: "250g butter\n200g brown sugar\n2 eggs\n350g flour\n200g chocolate chips",
      steps: "Cream butter and sugar.\nBeat in eggs.\nFold in dry ingredients.\nBake at 180C for 12 min."
    },
    soup: {
      title: "Tomato Basil Soup",
      description: "A comforting, velvety tomato soup with fresh basil.",
      categories: "Soup, Vegetarian, Dinner",
      tags: "cozy, blender",
      prep_time: 10, cook_time: 25, servings: 4, difficulty: "Easy",
      ingredients: "800g canned tomatoes\n1 onion\n2 cloves garlic\n10 basil leaves\n200ml cream",
      steps: "Sauté onion and garlic.\nAdd tomatoes and simmer.\nBlend with basil.\nStir in cream."
    },
    salad: {
      title: "Greek Salad",
      description: "A fresh Mediterranean salad with cucumber, tomato, olives, and feta.",
      categories: "Salad, Vegetarian, Quick",
      tags: "fresh, no-cook",
      prep_time: 15, cook_time: 0, servings: 4, difficulty: "Easy",
      ingredients: "3 tomatoes\n1 cucumber\n150g feta\n100g olives\n3 tbsp olive oil",
      steps: "Chop vegetables.\nCombine with olives.\nTop with feta and dress."
    }
  };

  var fields = ["title", "description", "categories", "tags", "prep_time", "cook_time",
    "servings", "difficulty", "author", "date", "image", "ingredients", "steps", "notes"];
  var el = {};
  fields.forEach(function (f) { el[f] = document.getElementById("f-" + f); });

  var preview = document.getElementById("markdown-preview");
  var status = document.getElementById("editor-status");
  var filenameLabel = document.getElementById("filename-label");
  var imgPreview = document.getElementById("img-preview");
  var imgPreviewImg = document.getElementById("img-preview-img");
  var datalist = document.getElementById("img-list");

  function setStatus(msg) {
    if (status) status.textContent = msg;
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function slugify(s) {
    return (s || "untitled").toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "untitled";
  }

  function yamlish(key, value) {
    if (value === "" || value === null || value === undefined) return "";
    return key + ": " + value + "\n";
  }

  function buildMarkdown() {
    var title = el.title.value.trim();
    var cats = el.categories.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var tags = el.tags.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var ingredients = el.ingredients.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    var steps = el.steps.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);

    var fm = [];
    fm.push("---");
    fm.push(yamlish("layout", "recipe"));
    fm.push(yamlish("title", title ? '"' + title.replace(/"/g, '\\"') + '"' : ""));
    fm.push(yamlish("description", el.description.value.trim() ? '"' + el.description.value.trim().replace(/"/g, '\\"') + '"' : ""));
    if (cats.length) fm.push("categories: [" + cats.join(", ") + "]");
    if (tags.length) fm.push("tags: [" + tags.join(", ") + "]");
    if (el.prep_time.value !== "") fm.push(yamlish("prep_time", el.prep_time.value));
    if (el.cook_time.value !== "") fm.push(yamlish("cook_time", el.cook_time.value));
    if (el.servings.value !== "") fm.push(yamlish("servings", el.servings.value));
    fm.push(yamlish("difficulty", el.difficulty.value));
    fm.push(yamlish("image", el.image.value.trim() ? '"' + el.image.value.trim() + '"' : ""));
    fm.push(yamlish("author", el.author.value.trim() ? '"' + el.author.value.trim() + '"' : ""));
    fm.push(yamlish("date", el.date.value || todayISO()));
    if (ingredients.length) fm.push("ingredients:\n" + ingredients.map(function (i) { return "  - " + i; }).join("\n"));
    if (steps.length) fm.push("steps:\n" + steps.map(function (s) { return "  - " + s; }).join("\n"));
    fm.push("---");
    fm.push("");

    var notes = el.notes.value.trim();
    if (notes) fm.push("", notes);

    return fm.join("\n");
  }

  function update() {
    var md = buildMarkdown();
    if (preview) preview.textContent = md;
    if (filenameLabel) filenameLabel.textContent = "_recipes/" + slugify(el.title.value) + ".md";
    updateImagePreview();
    saveDraft();
  }

  function updateImagePreview() {
    var path = el.image.value.trim();
    if (!path) { imgPreview.hidden = true; return; }
    imgPreview.hidden = false;
    imgPreviewImg.src = path;
    imgPreviewImg.alt = el.title.value.trim() || "Recipe image";
  }

  function saveDraft() {
    try {
      var data = {};
      fields.forEach(function (f) { data[f] = el[f].value; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      fields.forEach(function (f) { if (data[f] !== undefined) el[f].value = data[f]; });
      return true;
    } catch (e) { return false; }
  }

  function fillTemplate(name) {
    var t = TEMPLATES[name];
    if (!t) return;
    Object.keys(t).forEach(function (k) {
      if (el[k]) el[k].value = t[k];
    });
    if (!el.author.value) el.author.value = "Your Name";
    if (!el.date.value) el.date.value = todayISO();
    update();
    setStatus("Loaded template: " + name);
  }

  function download() {
    var md = buildMarkdown();
    if (!el.title.value.trim()) { setStatus("Add a title before downloading."); el.title.focus(); return; }
    var blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = slugify(el.title.value) + ".md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    setStatus("Downloaded " + a.download + " — upload it to _recipes/ on GitHub.");
  }

  function copy() {
    var md = buildMarkdown();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(md).then(function () { setStatus("Copied to clipboard."); },
        function () { setStatus("Copy failed — select the preview manually."); });
    } else {
      setStatus("Clipboard not available — select the preview manually.");
    }
  }

  function reset() {
    fields.forEach(function (f) { el[f].value = ""; });
    el.difficulty.value = "Easy";
    el.prep_time.value = 10; el.cook_time.value = 20; el.servings.value = 4;
    el.date.value = todayISO();
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    update();
    setStatus("Editor cleared.");
  }

  function init() {
    if (!el.title) return;

    IMG_MANIFEST.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p;
      datalist.appendChild(opt);
    });

    if (!loadDraft()) {
      el.date.value = todayISO();
      el.difficulty.value = "Easy";
      el.prep_time.value = 10; el.cook_time.value = 20; el.servings.value = 4;
    }

    fields.forEach(function (f) {
      el[f].addEventListener("input", update);
      el[f].addEventListener("change", update);
    });

    var tpl = document.getElementById("template-select");
    if (tpl) tpl.addEventListener("change", function () {
      if (tpl.value) fillTemplate(tpl.value);
    });

    var dl = document.getElementById("editor-download");
    if (dl) dl.addEventListener("click", download);
    var cp = document.getElementById("editor-copy");
    if (cp) cp.addEventListener("click", copy);
    var rs = document.getElementById("editor-reset");
    if (rs) rs.addEventListener("click", reset);

    var imgClear = document.getElementById("img-clear");
    if (imgClear) imgClear.addEventListener("click", function () {
      el.image.value = ""; update();
    });

    update();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
