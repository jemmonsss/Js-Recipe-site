# Recipe Site (Jekyll + GitHub Pages)

A Jekyll-based recipe site that is SEO-optimized and fully responsive. Recipes are
plain Markdown files — no database, no build step on your machine required for
GitHub Pages.

## Features

- Recipe grid homepage with category filtering and live search
- Per-recipe detail pages with semantic HTML and Recipe JSON-LD structured data
- Servings calculator (scales ingredient quantities)
- Favorites saved in the browser (localStorage)
- Print-friendly recipe view
- Mobile-first responsive layout with fluid grids
- `jekyll-seo-tag`, `jekyll-feed`, `jekyll-sitemap` plugins

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## How to add a recipe

1. Create a new file in `_recipes/`, e.g. `_recipes/my-recipe.md`.
2. Add frontmatter (see any existing recipe for the schema):

```yaml
---
layout: recipe
title: My Recipe
description: Short description used for SEO and cards.
categories: [Pasta, Italian, Dinner]
tags: [quick, cheesy]
prep_time: 10
cook_time: 20
servings: 4
difficulty: Easy
image: /assets/img/my-recipe.jpg
author: Your Name
date: 2026-07-18
ingredients:
  - 400g spaghetti
  - 200g pancetta
steps:
  - Boil the pasta
  - Fry the pancetta
---
```

3. Write any extra notes in the Markdown body below the frontmatter.
4. Commit and push. GitHub Pages rebuilds automatically.

## Customize the site

Edit `_config.yml`:

- `title`, `description`, `author`, `url` — site metadata + SEO
- `color_scheme` — theme colors
- `font_heading`, `font_body` — fonts
- `features` — toggle search, favorites, servings calculator, print button
- `category_labels` — display names for categories

## Deploy to GitHub Pages

1. Push the repo to GitHub.
2. Settings → Pages → Source: `main` branch, `/root`.
3. Wait for the build, then visit `https://yourusername.github.io`.

## Images

Place recipe images in `assets/img/`. If a recipe has no `image`, a gradient
placeholder is shown. You can optionally add a `assets/img/default-og-image.jpg`
for the default social-share image.
