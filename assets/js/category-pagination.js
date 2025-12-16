// assets/js/category-pagination.js
(function () {
  // initialize category pagination with shared state
  const initCategoryPagination = state => {
    const { items, perPage, pagination, pageNumbers, prevBtn, nextBtn } = state;

    let visibleItems = [];

    // hide all items on initial load
    for (const el of items) {
      el.style.display = "none";
    }

    // hide currently visible items
    const hideVisibleItems = () => {
      for (const el of visibleItems) {
        el.style.display = "none";
      }
      visibleItems = [];
    };

    // show given list of items
    const showItems = list => {
      hideVisibleItems();

      for (const el of list) {
        el.style.display = "";
        visibleItems.push(el);
      }
    };

    // render page number links
    const renderPageNumbers = () => {
      if (!pageNumbers) return;

      pageNumbers.textContent = "";
      const fragment = document.createDocumentFragment();

      // create single page link
      const addLink = (num, active = false) => {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = num;
        a.className = "pagination__link";
        a.tabIndex = -1;
        a.setAttribute("aria-label", `page ${num}`);

        if (active) {
          a.classList.add("pagination__number--active");
          a.setAttribute("aria-current", "page");
        }

        a.addEventListener("click", e => {
          e.preventDefault();
          render(num);
        });

        fragment.appendChild(a);
      };

      const { currentPage, maxPage } = state;

      // simple rendering when page count is small
      if (maxPage <= 5) {
        for (let i = 1; i <= maxPage; i++) {
          addLink(i, i === currentPage);
        }
        pageNumbers.appendChild(fragment);
        return;
      }

      // always show first page
      addLink(1, currentPage === 1);

      // leading dots
      if (currentPage > 3) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "dots";
        dots.setAttribute("aria-hidden", "true");
        fragment.appendChild(dots);
      }

      // middle page range
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(maxPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        addLink(i, i === currentPage);
      }

      // trailing dots
      if (currentPage < maxPage - 2) {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "dots";
        dots.setAttribute("aria-hidden", "true");
        fragment.appendChild(dots);
      }

      // always show last page
      addLink(maxPage, currentPage === maxPage);

      pageNumbers.appendChild(fragment);
    };

    // render selected page
    const render = page => {
      // no items after filtering
      if (state.filteredItems.length === 0) {
        hideVisibleItems();
        pagination?.classList.remove("pagination--visible");
        return;
      }

      // clamp page number
      state.currentPage = Math.max(1, Math.min(page, state.maxPage));

      const start = (state.currentPage - 1) * perPage;
      const end = start + perPage;

      showItems(state.filteredItems.slice(start, end));

      const atFirstPage = state.currentPage === 1;
      const atLastPage = state.currentPage === state.maxPage;

      prevBtn?.classList.toggle("pagination__link--disabled", atFirstPage);
      nextBtn?.classList.toggle("pagination__link--disabled", atLastPage);

      renderPageNumbers();
    };

    // expose render api to outer scope
    state.renderPage = render;

    // previous page handler
    prevBtn?.addEventListener("click", e => {
      e.preventDefault();
      if (!prevBtn.classList.contains("pagination__link--disabled")) {
        render(state.currentPage - 1);
      }
    });

    // next page handler
    nextBtn?.addEventListener("click", e => {
      e.preventDefault();
      if (!nextBtn.classList.contains("pagination__link--disabled")) {
        render(state.currentPage + 1);
      }
    });
  };

  // expose initializer globally
  window.initCategoryPagination = initCategoryPagination;
})();