// assets/js/category.js

document.addEventListener("DOMContentLoaded", () => {
  // cache post items
  const items = Array.from(document.querySelectorAll(".post-list__item"));
  const total = items.length;

  // cache dom nodes
  const pagination = document.querySelector(".pagination");
  const pageNumbers = document.querySelector(".pagination__numbers");
  const searchInput = document.querySelector(".search__input");
  const noResultsMessage = document.getElementById("no-results-message");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  // exit early when no posts exist
  if (total === 0) {
    pagination?.classList.remove("pagination--visible");
    return;
  }

  // create shared state container
  const perPage = 10;
  const state = {
    items,
    total,
    perPage,
    pagination,
    pageNumbers,
    searchInput,
    noResultsMessage,
    prevBtn,
    nextBtn,
    currentPage: 1,
    filteredItems: items.slice(),
    maxPage: Math.ceil(total / perPage)
  };

  // store original post text for later restore
  for (const item of items) {
    const title = item.querySelector("a");
    const excerpt = item.querySelector(".post-list__text");
    if (!title || !excerpt) continue;
    item.dataset.originalTitle = title.textContent;
    item.dataset.originalExcerpt = excerpt.textContent;
  }

  // expose for debug only
  window.categoryState = state;

  // initialize pagination module
  if (typeof window.initCategoryPagination === "function") {
    window.initCategoryPagination(state);
  }

  // initialize search module
  if (typeof window.initCategorySearch === "function") {
    window.initCategorySearch(state);
  }

  // single page case
  if (total <= perPage) {
    for (const el of items) el.style.display = "";
    pagination?.classList.remove("pagination--visible");
    return;
  }

  // normal case: enable pagination and render first page
  pagination?.classList.add("pagination--visible");
  if (typeof state.renderPage === "function") {
    state.renderPage(1);
  }
});