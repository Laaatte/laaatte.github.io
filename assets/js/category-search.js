// assets/js/category-search.js
(function () {
  const initCategorySearch = state => {
    // extract shared state values
    const { items, perPage, pagination, searchInput, noResultsEl } = state;

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
    const escapeHtml = text =>
      text.replace(/[&<>"'`=\/]/g, ch => `&#${ch.charCodeAt(0)};`);

    // apply highlight span using regex
    const highlightText = (text, regex) =>
      escapeHtml(text).replace(
        regex,
        '<span class="search__highlight">$1</span>'
      );

    // toggle no results message immediately
    const updatenoResultsEl = isEmpty => {
      if (!noResultsEl) return;
      noResultsEl.classList.toggle("search__no-results--hidden", !isEmpty);
    };

    // restore original title and excerpt
    const restoreItem = item => {
      item._titleEl.textContent = item.dataset.originalTitle || "";
      item._excerptEl.textContent = item.dataset.originalExcerpt || "";
    };

    // execute search and highlight
    const performSearch = () => {
      const term = (searchInput?.value || "").toLowerCase().trim();

      // reset when search term is empty
      if (!term) {
        state.filteredItems = items.slice();
        items.forEach(restoreItem);

        updatenoResultsEl(false);
        state.maxPage = Math.ceil(state.filteredItems.length / perPage);

        if (pagination && items.length > perPage) {
          pagination.classList.add("pagination--visible");
        } else {
          pagination?.classList.remove("pagination--visible");
        }

        state.renderPage?.(1);
        return;
      }

      // filter items
      state.filteredItems = items.filter(item => {
        const t = (item.dataset.originalTitle || "").toLowerCase();
        const e = (item.dataset.originalExcerpt || "").toLowerCase();
        return t.includes(term) || e.includes(term);
      });

      const filteredSet = new Set(state.filteredItems);
      const regex = new RegExp(`(${term})`, "gi");

      // update items and apply highlight
      for (const item of items) {
        if (filteredSet.has(item)) {
          item._titleEl.innerHTML = highlightText(
            item.dataset.originalTitle || "",
            regex
          );
          item._excerptEl.innerHTML = highlightText(
            item.dataset.originalExcerpt || "",
            regex
          );
        } else {
          restoreItem(item);
        }
      }

      updatenoResultsEl(state.filteredItems.length === 0);

      state.maxPage = Math.ceil(state.filteredItems.length / perPage);

      if (state.filteredItems.length > perPage) {
        pagination?.classList.add("pagination--visible");
      } else {
        pagination?.classList.remove("pagination--visible");
      }

      state.renderPage?.(1);
    };

    // hybrid input handler with ime awareness
    const handleInput = e => {
      if (isComposing) return;

      const value = e.target.value;

      // immediate search on first input or delete
      if (value.length <= 1 || value.length < lastValue.length) {
        clearTimeout(typingTimer);
        performSearch();
      } else {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(performSearch, typingDelay);
      }

      lastValue = value;
    };

    // ime composition handling
    searchInput?.addEventListener("compositionstart", () => {
      isComposing = true;
    });

    searchInput?.addEventListener("compositionend", () => {
      isComposing = false;
      clearTimeout(typingTimer);
      performSearch();
    });

    // attach input event
    searchInput?.addEventListener("input", handleInput);

    // expose api via shared state
    state.performSearch = performSearch;
  };

  // expose initializer globally
  window.initCategorySearch = initCategorySearch;
})();