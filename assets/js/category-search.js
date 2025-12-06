// assets/js/category-search.js (A version optimized)

(function () {
  const initCategorySearch = state => {
    const { items, perPage, pagination, searchInput, noResultsMessage } = state;

    // debounce timer
    let typingTimer;
    const typingDelay = 350; // delay before search executes

    // helper: escape html safely
    const escapeHtml = text =>
      text.replace(/[&<>"'`=\/]/g, ch => `&#${ch.charCodeAt(0)};`);

    // helper: highlight matched term
    const highlightTerm = (text, term) =>
      escapeHtml(text).replace(
        new RegExp(`(${term})`, "gi"),
        '<span class="search__highlight">$1</span>'
      );

    // run search
    const performSearch = () => {
      const term = (searchInput?.value || "").toLowerCase().trim();

      // clear highlight + restore original when no term
      if (!term) {
        state.filteredItems = items.slice();

        for (const item of items) {
          const title = item.querySelector("a");
          const excerpt = item.querySelector(".post-list__text");
          if (!title || !excerpt) continue;

          title.textContent = item.dataset.originalTitle || "";
          excerpt.textContent = item.dataset.originalExcerpt || "";
        }

        if (noResultsMessage) noResultsMessage.style.display = "none";

        state.maxPage = Math.ceil(state.filteredItems.length / perPage);

        if (pagination && state.total > perPage) {
          pagination.classList.add("pagination--visible");
        }

        if (typeof state.renderPage === "function") {
          state.renderPage(1);
        }

        return;
      }

      // filter items
      state.filteredItems = items.filter(item => {
        const t = (item.dataset.originalTitle || "").toLowerCase();
        const e = (item.dataset.originalExcerpt || "").toLowerCase();
        return t.includes(term) || e.includes(term);
      });

      // highlight for filtered items only
      for (const item of state.filteredItems) {
        const title = item.querySelector("a");
        const excerpt = item.querySelector(".post-list__text");
        if (!title || !excerpt) continue;

        title.innerHTML = highlightTerm(item.dataset.originalTitle || "", term);
        excerpt.innerHTML = highlightTerm(item.dataset.originalExcerpt || "", term);
      }

      // restore text for non-matching items (no flicker)
      for (const item of items) {
        if (state.filteredItems.includes(item)) continue;

        const title = item.querySelector("a");
        const excerpt = item.querySelector(".post-list__text");
        if (!title || !excerpt) continue;

        title.textContent = item.dataset.originalTitle || "";
        excerpt.textContent = item.dataset.originalExcerpt || "";
      }

      // show or hide "no results"
      if (noResultsMessage) {
        noResultsMessage.style.display =
          state.filteredItems.length === 0 ? "block" : "none";
      }

      state.maxPage = Math.ceil(state.filteredItems.length / perPage);

      // toggle pagination
      if (state.filteredItems.length > perPage) {
        pagination?.classList.add("pagination--visible");
      } else {
        pagination?.classList.remove("pagination--visible");
      }

      if (typeof state.renderPage === "function") {
        state.renderPage(1);
      }
    };

    // smooth debounce for typing
    const handleInput = () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(performSearch, typingDelay);
    };

    // expose search function globally (if needed)
    window.searchPosts = performSearch;
    state.performSearch = performSearch;

    // attach input listener
    searchInput?.addEventListener("input", handleInput);
  };

  // export to global
  window.initCategorySearch = initCategorySearch;
})();