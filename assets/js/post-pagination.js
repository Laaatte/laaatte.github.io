document.addEventListener("DOMContentLoaded", () => {
  // cache list items and constants
  const items = Array.from(document.querySelectorAll(".post-list__item"));
  const total = items.length;
  const perPage = 10;

  // cache dom nodes
  const pagination = document.querySelector(".pagination");
  const pageNumbers = document.querySelector(".pagination__numbers");
  const searchInput = document.querySelector(".search__input");
  const noResultsMessage = document.getElementById("no-results-message");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  // paging state
  let currentPage = 1;
  let filteredItems = items.slice();
  let maxPage = Math.ceil(filteredItems.length / perPage);

  // search typing delay
  let typingTimer;
  const typingDelay = 500; // wait after user stops typing

  // store original text for safe restore later
  items.forEach(item => {
    const title = item.querySelector("a");
    const excerpt = item.querySelector(".post-list__text");
    if (!title || !excerpt) return;
    item.dataset.originalTitle = title.textContent;
    item.dataset.originalExcerpt = excerpt.textContent;
  });

  // escape html characters to prevent injection
  const escapeHtml = text =>
    text.replace(/[&<>"'`=\/]/g, ch => `&#${ch.charCodeAt(0)};`);

  // highlight matched search terms
  const highlightTerm = (text, term) =>
    escapeHtml(text).replace(
      new RegExp(`(${term})`, "gi"),
      `<span class="search__highlight">$1</span>`
    );

  // hide all items then show specific ones
  const showItems = list => {
    items.forEach(el => (el.style.display = "none"));
    list.forEach(el => (el.style.display = ""));
  };

  // build page number links
  const renderPageNumbers = () => {
    pageNumbers.innerHTML = "";

    const addLink = (num, active = false) => {
      const a = document.createElement("a");
      a.textContent = num;
      a.className = "pagination__link";
      a.tabIndex = -1; // remove from keyboard focus
      if (active) a.classList.add("pagination__number--active");
      a.addEventListener("click", () => render(num));
      pageNumbers.appendChild(a);
    };

    // simple case (few pages)
    if (maxPage <= 7) {
      for (let i = 1; i <= maxPage; i++) {
        addLink(i, i === currentPage);
      }
      return;
    }

    // always include first page
    addLink(1, currentPage === 1);

    // left dots
    if (currentPage > 3) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.className = "dots";
      dots.setAttribute("aria-hidden", "true"); // a11y: hide dots from screen readers
      pageNumbers.appendChild(dots);
    }

    // middle pages
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(maxPage - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      addLink(i, i === currentPage);
    }

    // right dots
    if (currentPage < maxPage - 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.className = "dots";
      dots.setAttribute("aria-hidden", "true"); // a11y: hide dots from screen readers
      pageNumbers.appendChild(dots);
    }

    // last page
    addLink(maxPage, currentPage === maxPage);
  };

  // core pagination renderer
  const render = page => {
    if (filteredItems.length === 0) {
      showItems([]);
      pagination?.classList.remove("pagination--visible");
      return;
    }

    currentPage = Math.max(1, Math.min(page, maxPage));

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    showItems(filteredItems.slice(start, end));

    // update prev/next disabled state
    const atFirst = currentPage === 1;
    const atLast = currentPage === maxPage;

    prevBtn?.classList.toggle("pagination__link--disabled", atFirst);
    nextBtn?.classList.toggle("pagination__link--disabled", atLast);
    prevBtn?.setAttribute("aria-disabled", atFirst);
    nextBtn?.setAttribute("aria-disabled", atLast);

    renderPageNumbers();
  };

  // perform search filter
  const performSearch = () => {
    const term = (searchInput?.value || "").toLowerCase().trim();

    // restore original when empty
    if (!term) {
      filteredItems = items.slice();

      items.forEach(item => {
        const title = item.querySelector("a");
        const excerpt = item.querySelector(".post-list__text");
        if (!title || !excerpt) return;
        title.textContent = item.dataset.originalTitle;
        excerpt.textContent = item.dataset.originalExcerpt;
      });

      noResultsMessage.style.display = "none";
      maxPage = Math.ceil(filteredItems.length / perPage);

      if (pagination && total > perPage) {
        pagination.classList.add("pagination--visible");
      }

      render(1);
      return;
    }

    // run filter
    filteredItems = items.filter(item => {
      const t = item.dataset.originalTitle.toLowerCase();
      const e = item.dataset.originalExcerpt.toLowerCase();
      return t.includes(term) || e.includes(term);
    });

    // apply highlight
    filteredItems.forEach(item => {
      const title = item.querySelector("a");
      const excerpt = item.querySelector(".post-list__text");
      if (!title || !excerpt) return;
      title.innerHTML = highlightTerm(item.dataset.originalTitle, term);
      excerpt.innerHTML = highlightTerm(item.dataset.originalExcerpt, term);
    });

    // no result message toggle
    noResultsMessage.style.display =
      filteredItems.length === 0 ? "block" : "none";

    maxPage = Math.ceil(filteredItems.length / perPage);

    // toggle pagination visibility
    if (filteredItems.length > perPage) {
      pagination.classList.add("pagination--visible");
    } else {
      pagination.classList.remove("pagination--visible");
    }

    render(1);
  };

  // expose search function globally
  window.searchPosts = performSearch;

  // attach search input events
  searchInput?.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(performSearch, typingDelay);
  });

  // prev button click
  prevBtn?.addEventListener("click", () => {
    if (!prevBtn.classList.contains("pagination__link--disabled")) {
      render(currentPage - 1);
    }
  });

  // next button click
  nextBtn?.addEventListener("click", () => {
    if (!nextBtn.classList.contains("pagination__link--disabled")) {
      render(currentPage + 1);
    }
  });

  // initial load logic
  if (total === 0) {
    pagination?.classList.remove("pagination--visible");
    return;
  }

  if (total <= perPage) {
    showItems(items);
    pagination?.classList.remove("pagination--visible");
    return;
  }

  pagination?.classList.add("pagination--visible");
  render(1);
});