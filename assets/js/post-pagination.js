$(function () {
  const $items = $("#post-list .post-link");
  const total = $items.length;
  const perPage = 10;
  const $pagination = $(".pagination");
  const $pageNumbers = $("#page-numbers");

  // no posts → hide pagination entirely
  if (total === 0) {
    $pagination.removeClass("show");
    return;
  }

  // total posts <= 10 → show all items & keep pagination hidden
  if (total <= perPage) {
    $items.show();
    $pagination.removeClass("show");
    return;
  }

  // pagination needed → show it
  $pagination.addClass("show");

  let currentPage = 1;
  const maxPage = Math.ceil(total / perPage);

  // render page numbers (optimized)
  function renderPageNumbers() {
    $pageNumbers.empty(); // clear existing page numbers

    // add one page link
    function addPageLink(num, isActive = false) {
      const $a = $(`<a class="page-link">${num}</a>`);
      if (isActive) $a.addClass("active");
      $a.on("click", () => render(num)); // attach click handler to the page link
      $pageNumbers.append($a);
    }

    // show page numbers intelligently
    if (maxPage <= 7) {
      for (let i = 1; i <= maxPage; i++) {
        addPageLink(i, i === currentPage);
      }
      return;
    }

    // always show first page link
    addPageLink(1, currentPage === 1);

    if (currentPage > 3) {
      $pageNumbers.append('<span class="dots">...</span>');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(maxPage - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      addPageLink(i, i === currentPage);
    }

    if (currentPage < maxPage - 2) {
      $pageNumbers.append('<span class="dots">...</span>');
    }

    // always show last page link
    addPageLink(maxPage, currentPage === maxPage);
  }

  // render posts per page
  function render(page) {
    currentPage = Math.max(1, Math.min(page, maxPage));

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    $items.hide().slice(start, end).show(); // only show the current page items

    $("#prev").toggleClass("disabled", currentPage === 1);
    $("#next").toggleClass("disabled", currentPage === maxPage);

    renderPageNumbers(); // update page numbers
  }

  // prev / next button event
  $("#prev").on("click", () => render(currentPage - 1));
  $("#next").on("click", () => render(currentPage + 1));

  // first render
  render(1);
});