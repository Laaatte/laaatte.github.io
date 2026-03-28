// assets/js/category/pagination.js
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

    // reveal post list after rendering
    const revealDependent = () => {
      document.querySelector(".post-list.js-dependent")?.style.setProperty("visibility", "visible");
    };

    // create pagination dots
    const createDots = fragment => {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.className = "dots";
      dots.setAttribute("aria-hidden", "true");
      fragment.appendChild(dots);
    };

    // render page number links
    const renderPageNumbers = () => {
      if (!pageNumbers) return;

      pageNumbers.textContent = "";
      const fragment = document.createDocumentFragment();
      const { currentPage, maxPage } = state;

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
          renderPage(num, { scroll: true });
        });

        fragment.appendChild(a);
      };

      if (maxPage <= 5) {
        for (let i = 1; i <= maxPage; i++) {
          addLink(i, i === currentPage);
        }
        pageNumbers.appendChild(fragment);
        return;
      }

      addLink(1, currentPage === 1);

      if (currentPage > 3) {
        createDots(fragment);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(maxPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        addLink(i, i === currentPage);
      }

      if (currentPage < maxPage - 2) {
        createDots(fragment);
      }

      addLink(maxPage, currentPage === maxPage);
      pageNumbers.appendChild(fragment);
    };

    // render selected page
    const renderPage = (page, options = {}) => {
      const { scroll = true } = options;

      if (state.filteredItems.length === 0) {
        hideVisibleItems();
        pagination?.classList.remove("pagination--visible");
        revealDependent();
        return;
      }

      state.maxPage = Math.ceil(state.filteredItems.length / perPage);
      state.currentPage = Math.max(1, Math.min(page, state.maxPage));

      const start = (state.currentPage - 1) * perPage;
      const end = start + perPage;

      showItems(state.filteredItems.slice(start, end));

      prevBtn?.classList.toggle(
        "pagination__link--disabled",
        state.currentPage === 1
      );
      nextBtn?.classList.toggle(
        "pagination__link--disabled",
        state.currentPage === state.maxPage
      );

      history.replaceState(null, "", `#page=${state.currentPage}`);
      renderPageNumbers();

      // scroll only when explicitly requested
      if (scroll) {
        pagination?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      revealDependent();
    };

    // expose render api to outer scope
    state.renderPage = renderPage;

    // previous page handler
    prevBtn?.addEventListener("click", e => {
      e.preventDefault();
      if (!prevBtn.classList.contains("pagination__link--disabled")) {
        renderPage(state.currentPage - 1, { scroll: true });
      }
    });

    // next page handler
    nextBtn?.addEventListener("click", e => {
      e.preventDefault();
      if (!nextBtn.classList.contains("pagination__link--disabled")) {
        renderPage(state.currentPage + 1, { scroll: true });
      }
    });
  };

  // expose initializer globally
  window.initCategoryPagination = initCategoryPagination;
})();