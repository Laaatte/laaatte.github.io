// assets/js/category-pagination.js
(function () {
  // init pagination behavior
  const initCategoryPagination = state => {
    const { items, perPage, pagination, pageNumbers, prevBtn, nextBtn } = state;

    // show selected items only
    const showItems = list => {
      for (const el of items) el.style.display = "none";
      for (const el of list) el.style.display = "";
    };

    // render page number buttons
    const renderPageNumbers = () => {
      if (!pageNumbers) return;

      pageNumbers.innerHTML = "";

      // create page number element
      const addLink = (num, active = false) => {
        const a = document.createElement("a");
        a.textContent = num;
        a.className = "pagination__link";
        a.tabIndex = -1;
        if (active) a.classList.add("pagination__number--active");
        a.addEventListener("click", () => render(num));
        pageNumbers.appendChild(a);
      };

      // simple number layout
      if (state.maxPage <= 5) {
        for (let i = 1; i <= state.maxPage; i++) {
          addLink(i, i === state.currentPage);
        }
        return;
      }

      // always include first page
      addLink(1, state.currentPage === 1);

      // left dots
      if (state.currentPage > 3) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "dots";
        dots.setAttribute("aria-hidden", "true");
        pageNumbers.appendChild(dots);
      }

      // sliding window pages
      const start = Math.max(2, state.currentPage - 1);
      const end = Math.min(state.maxPage - 1, state.currentPage + 1);
      for (let i = start; i <= end; i++) {
        addLink(i, i === state.currentPage);
      }

      // right dots
      if (state.currentPage < state.maxPage - 2) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "dots";
        dots.setAttribute("aria-hidden", "true");
        pageNumbers.appendChild(dots);
      }

      // last page
      addLink(state.maxPage, state.currentPage === state.maxPage);
    };

    // render selected page
    const render = page => {
      // empty filter case
      if (state.filteredItems.length === 0) {
        showItems([]);
        pagination?.classList.remove("pagination--visible");
        return;
      }

      // clamp page number
      state.currentPage = Math.max(1, Math.min(page, state.maxPage));

      const start = (state.currentPage - 1) * perPage;
      const end = start + perPage;

      showItems(state.filteredItems.slice(start, end));

      // update prev / next disabled state
      const atFirst = state.currentPage === 1;
      const atLast = state.currentPage === state.maxPage;

      if (prevBtn) {
        prevBtn.classList.toggle("pagination__link--disabled", atFirst);
        prevBtn.setAttribute("aria-disabled", atFirst);
      }

      if (nextBtn) {
        nextBtn.classList.toggle("pagination__link--disabled", atLast);
        nextBtn.setAttribute("aria-disabled", atLast);
      }

      renderPageNumbers();
    };

    // attach public functions to state
    state.showItems = showItems;
    state.renderPage = render;
    state.renderPageNumbers = renderPageNumbers;

    // prev button listener
    prevBtn?.addEventListener("click", () => {
      if (!prevBtn.classList.contains("pagination__link--disabled")) {
        render(state.currentPage - 1);
      }
    });

    // next button listener
    nextBtn?.addEventListener("click", () => {
      if (!nextBtn.classList.contains("pagination__link--disabled")) {
        render(state.currentPage + 1);
      }
    });
  };

  // export module globally
  window.initCategoryPagination = initCategoryPagination;
})();