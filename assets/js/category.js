// assets/js/category.js
document.addEventListener("DOMContentLoaded", () => {
  // collect all post list items once
  const items = Array.from(document.querySelectorAll(".post-list__item"));
  const total = items.length;

  // cache pagination and control elements
  const pagination = document.querySelector(".pagination");
  const pageNumbers = document.querySelector(".pagination__numbers");
  const searchInput = document.querySelector(".search__input");
  const noResultsEl = document.getElementById("search__no-results");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  // stop execution if there are no posts
  if (total === 0) {
    pagination?.classList.remove("pagination--visible");
    return;
  }

  // shared state object used across modules
  const perPage = 10;
  const state = {
    items,
    total,
    perPage,
    pagination,
    pageNumbers,
    searchInput,
    noResultsEl,
    prevBtn,
    nextBtn,
    currentPage: 1,
    filteredItems: items.slice(),
    maxPage: Math.ceil(total / perPage)
  };

  // store original text to safely restore after search highlight
  for (const item of items) {
    const title = item.querySelector("a");
    const excerpt = item.querySelector(".post-list__text");
    if (!title || !excerpt) continue;
    item.dataset.originalTitle = title.textContent;
    item.dataset.originalExcerpt = excerpt.textContent;
  }

  // expose state for debugging on localhost only
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    window.categoryState = state;
  }

  // initialize pagination logic
  if (typeof window.initCategoryPagination === "function") {
    window.initCategoryPagination(state);
  }

  // initialize search logic
  if (typeof window.initCategorySearch === "function") {
    window.initCategorySearch(state);
  }

  // handle case where pagination is not needed
  if (total <= perPage) {
    for (const el of items) el.style.display = "";
    pagination?.classList.remove("pagination--visible");
    return;
  }

  // enable pagination and render the first page
  pagination?.classList.add("pagination--visible");
  if (typeof state.renderPage === "function") {
    state.renderPage(1);
  }
});