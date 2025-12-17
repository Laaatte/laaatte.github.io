// assets/js/category/init.js
document.addEventListener("DOMContentLoaded", async () => {
  // get post list container
  const listEl = document.getElementById("post-list");
  if (!listEl) return;

  let posts = [];

  // resolve posts.json url from script data attribute
  const postsUrl =
    document.querySelector("script[data-posts-url]")?.dataset.postsUrl;

  if (!postsUrl || typeof window.loadPosts !== "function") {
    console.error("posts-store is not available");
    return;
  }

  // load posts.json via shared store
  try {
    posts = await window.loadPosts(postsUrl);
  } catch (e) {
    console.error("failed to load posts.json", e);
    return;
  }

  // format date string to "mon dd, yyyy"
  const formatDate = dateStr => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (isNaN(date)) return "";

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // read current category from post list container
  const currentCategory = listEl.dataset.category || "";

  // filter posts by category before sorting and rendering
  const visiblePosts = currentCategory
    ? posts.filter(post => post.category === currentCategory)
    : posts;

  // sort posts by date desc, then by url asc (numeric aware)
  visiblePosts.sort((a, b) => {
    if (a.date && b.date) {
      const diff = new Date(b.date) - new Date(a.date);
      if (diff !== 0) return diff;
    }

    return (a.url || "").localeCompare(b.url || "", "en", {
      numeric: true,
      sensitivity: "base"
    });
  });

  // create post list items from filtered posts only
  const items = visiblePosts.map(post => {
    const li = document.createElement("li");
    li.className = "post-list__item";

    const formattedDate = formatDate(post.date);

    li.innerHTML = `
      <a href="${post.url}">
        ${post.title}${formattedDate ? " - " + formattedDate : ""}
      </a>
      <p class="post-list__text">${post.desc || ""}</p>
    `;

    // store original text for search highlight restore
    li.dataset.originalTitle = formattedDate
      ? `${post.title} - ${formattedDate}`
      : post.title;

    li.dataset.originalExcerpt = post.desc || "";

    listEl.appendChild(li);
    return li;
  });

  const total = items.length;

  // cache pagination and control elements
  const pagination = document.querySelector(".pagination");
  const pageNumbers = document.getElementById("page-numbers");
  const searchInput = document.querySelector(".search__input");
  const noResultsEl = document.getElementById("search__no-results");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  // toggle search ui visibility based on item count
  const searchWrapper = document.getElementById("category-search-wrapper");
  searchWrapper?.classList.toggle("is-hidden", total <= 1);

  // stop execution if there are no posts
  if (total === 0) {
    const li = document.createElement("li");
    li.className = "post-list__item";
    li.textContent = "There is no content.";
    listEl.appendChild(li);

    pagination?.classList.remove("pagination--visible");
    return;
  }

  // number of posts displayed per page
  const perPage = 10;

  // read initial page from url hash
  const initialPage = Number(new URLSearchParams(location.hash.slice(1)).get("page")) || 1;

  // shared state object for pagination and search
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
    currentPage: initialPage,
    filteredItems: items.slice(),
    maxPage: Math.ceil(total / perPage)
  };

  // expose state for debugging in local environment only
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    window.categoryState = state;
  }

  // initialize pagination and search modules
  window.initCategoryPagination?.(state);
  window.initCategorySearch?.(state);

  // handle case where pagination is not needed
  if (total <= perPage) {
    items.forEach(el => (el.style.display = ""));
    pagination?.classList.remove("pagination--visible");

    // reveal js-dependent content after rendering
    document.querySelectorAll(".js-dependent").forEach(el => {
      el.style.visibility = "visible";
    });
    return;
  }

  // enable pagination and render initial page
  pagination?.classList.add("pagination--visible");
  state.renderPage?.(state.currentPage);

});