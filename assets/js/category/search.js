// assets/js/category/search.js
(function () {
  const initCategorySearch = state => {
    // extract shared state values
    const { items, perPage, pagination, searchInput, noResultsEl } = state;
    if (!searchInput) return;

    // debounce control
    let typingTimer;
    const typingDelay = 200;
    let lastValue = "";
    let isComposing = false;

    // cache title and excerpt elements
    for (const item of items) {
      item._titleEl = item.querySelector("a");
      item._excerptEl = item.querySelector(".post-list__text");
    }

    // escape html to prevent markup injection
    const escapeHtml = text => String(text || "").replace(/[&<>"'`=\/]/g, ch => `&#${ch.charCodeAt(0)};`);

    // escape regex special characters in search term
    const escapeRegExp = text => String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // apply highlight span using escaped regex
    const highlightText = (text, regex) => escapeHtml(text).replace(regex, '<span class="search__highlight">$1</span>');

    // toggle no results message visibility
    const updateNoResultsEl = isEmpty => {
      if (!noResultsEl) return;
      noResultsEl.classList.toggle("is-hidden", !isEmpty);
    };

    // toggle pagination visibility based on filtered count
    const updatePagination = count => {
      if (!pagination) return;
      pagination.classList.toggle("pagination--visible", count > perPage);
    };

    // restore original title and excerpt
    const restoreItem = item => {
      item._titleEl.textContent = item.dataset.originalTitle || "";
      item._excerptEl.textContent = item.dataset.originalExcerpt || "";
    };

    // execute search and highlight
    const performSearch = () => {
      const term = searchInput.value.toLowerCase().trim();

      // reset when search term is empty
      if (!term) {
        state.filteredItems = items.slice();
        items.forEach(restoreItem);
      } else {
        // filter items by title or excerpt
        state.filteredItems = items.filter(item => {
          const title = (item.dataset.originalTitle || "").toLowerCase();
          const excerpt = (item.dataset.originalExcerpt || "").toLowerCase();
          return title.includes(term) || excerpt.includes(term);
        });

        const filteredSet = new Set(state.filteredItems);
        const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");

        // update items and apply highlight
        for (const item of items) {
          if (filteredSet.has(item)) {
            item._titleEl.innerHTML = highlightText(item.dataset.originalTitle, regex);
            item._excerptEl.innerHTML = highlightText(
              item.dataset.originalExcerpt,
              regex
            );
          } else {
            restoreItem(item);
          }
        }
      }

      updateNoResultsEl(state.filteredItems.length === 0);
      state.maxPage = Math.ceil(state.filteredItems.length / perPage);
      updatePagination(state.filteredItems.length);

      // do not scroll on search update
      state.renderPage?.(1, { scroll: false });
    };

    // hybrid input handler with ime awareness
    const handleInput = e => {
      if (isComposing) return;

      const value = e.target.value;
      clearTimeout(typingTimer);

      // immediate search on first input or delete
      if (value.length <= 1 || value.length < lastValue.length) {
        performSearch();
      } else {
        typingTimer = setTimeout(performSearch, typingDelay);
      }

      lastValue = value;
    };

    // ime composition handling
    searchInput.addEventListener("compositionstart", () => {
      isComposing = true;
    });

    searchInput.addEventListener("compositionend", () => {
      isComposing = false;
      clearTimeout(typingTimer);
      performSearch();
    });

    // attach input event
    searchInput.addEventListener("input", handleInput);

    // expose api via shared state
    state.performSearch = performSearch;
  };

  // expose initializer globally
  window.initCategorySearch = initCategorySearch;
})();