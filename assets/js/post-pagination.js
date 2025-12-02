document.addEventListener("DOMContentLoaded", () => {
  // cache DOM elements
  const items = Array.from(document.querySelectorAll(".post-list__item"));
  const total = items.length;
  const perPage = 10;

  const pagination = document.querySelector(".pagination");
  const pageNumbers = document.querySelector(".pagination__numbers");
  const searchInput = document.querySelector(".search__input");
  const noResultsMessage = document.getElementById("no-results-message");

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentPage = 1;
  let filteredItems = items.slice();
  let maxPage = Math.ceil(filteredItems.length / perPage);

  let typingTimer;
  const typingDelay = 500; // delay after user stops typing


  /* ------------------------------------------------------------
    Store original content for safe restoring and clean searching
  ------------------------------------------------------------- */
  items.forEach(item => {
    const titleEl = item.querySelector("a");                 // use <a> (no class)
    const textEl = item.querySelector(".post-list__text");  // paragraph inside item

    if (!titleEl || !textEl) return;

    item.dataset.originalTitle = titleEl.textContent;
    item.dataset.originalExcerpt = textEl.textContent;
  });


  /* ------------------------------------------------------------
    Utility: escape HTML for safe highlight
  ------------------------------------------------------------- */
  function escapeHtml(text) {
    return text.replace(/[&<>"'`=\/]/g, char => `&#${char.charCodeAt(0)};`);
  }

  function highlightTerm(text, term) {
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${term})`, "gi");
    return escaped.replace(regex, `<span class="search__highlight">$1</span>`);
  }


  /* ------------------------------------------------------------
    Utility: show only the given set of items
  ------------------------------------------------------------- */
  function showItems(list) {
    items.forEach(item => { item.style.display = "none"; });
    list.forEach(item => { item.style.display = ""; });
  }


  /* ------------------------------------------------------------
    Pagination number builder
  ------------------------------------------------------------- */
  function renderPageNumbers() {
    pageNumbers.innerHTML = "";

    const addLink = (num, isActive = false) => {
      const a = document.createElement("a");
      a.textContent = num;
      a.className = "pagination__link";
      if (isActive) a.classList.add("pagination__number--active");
      a.addEventListener("click", () => render(num));
      pageNumbers.appendChild(a);
    };

    // small amount of pages
    if (maxPage <= 7) {
      for (let i = 1; i <= maxPage; i++) {
        addLink(i, i === currentPage);
      }
      return;
    }

    // left side
    addLink(1, currentPage === 1);
    if (currentPage > 3) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.className = "dots";
      pageNumbers.appendChild(dots);
    }

    // middle block
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(maxPage - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      addLink(i, i === currentPage);
    }

    // right side
    if (currentPage < maxPage - 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.className = "dots";
      pageNumbers.appendChild(dots);
    }

    addLink(maxPage, currentPage === maxPage);
  }


  /* ------------------------------------------------------------
    Core pagination renderer
  ------------------------------------------------------------- */
  function render(page) {
    if (filteredItems.length === 0) {
      showItems([]);
      if (pagination) pagination.classList.remove("pagination--visible");
      return;
    }

    currentPage = Math.max(1, Math.min(page, maxPage));

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    showItems(filteredItems.slice(start, end));

    if (prevBtn) {
      prevBtn.classList.toggle(
        "pagination__link--disabled",
        currentPage === 1
      );
    }

    if (nextBtn) {
      nextBtn.classList.toggle(
        "pagination__link--disabled",
        currentPage === maxPage
      );
    }

    renderPageNumbers();
  }


  /* ------------------------------------------------------------
    Search engine
  ------------------------------------------------------------- */
  function performSearch() {
    const term = (searchInput?.value || "").toLowerCase().trim();

    // empty search -> restore all original content
    if (!term) {
      filteredItems = items.slice();

      items.forEach(item => {
        const titleEl = item.querySelector("a");
        const textEl = item.querySelector(".post-list__text");

        if (!titleEl || !textEl) return;

        titleEl.textContent = item.dataset.originalTitle || titleEl.textContent;
        textEl.textContent = item.dataset.originalExcerpt || textEl.textContent;
      });

      if (noResultsMessage) {
        noResultsMessage.style.display = "none";
      }

      maxPage = Math.ceil(filteredItems.length / perPage);

      if (pagination && total > perPage) {
        pagination.classList.add("pagination--visible");
      }

      render(1);
      return;
    }

    // filter based on original text
    filteredItems = items.filter(item => {
      const originalTitle = (item.dataset.originalTitle || "").toLowerCase();
      const originalExcerpt = (item.dataset.originalExcerpt || "").toLowerCase();
      return originalTitle.includes(term) || originalExcerpt.includes(term);
    });

    showItems(filteredItems);

    // apply highlight safely
    filteredItems.forEach(item => {
      const titleEl = item.querySelector("a");
      const textEl = item.querySelector(".post-list__text");

      if (!titleEl || !textEl) return;

      titleEl.innerHTML = highlightTerm(item.dataset.originalTitle || titleEl.textContent, term);
      textEl.innerHTML = highlightTerm(item.dataset.originalExcerpt || textEl.textContent, term);
    });

    // no results
    if (noResultsMessage) {
      noResultsMessage.style.display =
        filteredItems.length === 0 ? "block" : "none";
    }

    maxPage = Math.ceil(filteredItems.length / perPage);

    // toggle pagination visibility
    if (pagination) {
      if (filteredItems.length > perPage) {
        pagination.classList.add("pagination--visible");
      } else {
        pagination.classList.remove("pagination--visible");
      }
    }

    render(1);
  }

  // expose search for inline HTML handler
  window.searchPosts = performSearch;


  /* ------------------------------------------------------------
    Event bindings
  ------------------------------------------------------------- */
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(performSearch, typingDelay);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (!prevBtn.classList.contains("pagination__link--disabled")) {
        render(currentPage - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!nextBtn.classList.contains("pagination__link--disabled")) {
        render(currentPage + 1);
      }
    });
  }


  /* ------------------------------------------------------------
    Initial load
  ------------------------------------------------------------- */
  if (total === 0) {
    if (pagination) pagination.classList.remove("pagination--visible");
    return;
  }

  if (total <= perPage) {
    showItems(items);
    if (pagination) pagination.classList.remove("pagination--visible");
    return;
  }

  if (pagination) {
    pagination.classList.add("pagination--visible");
  }
  render(1);
});