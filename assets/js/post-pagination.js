$(function () {
  const $items = $("#post-list .post-link");
  const total = $items.length;
  const perPage = 10;
  const $pagination = $(".pagination");

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

  // render page numbers (ellipsis included)
  function renderPageNumbers() {
    const $wrap = $("#page-numbers");
    $wrap.empty();

    // add one page link
    function add(num, isActive = false) {
      const $a = $(`<a class="page-link">${num}</a>`);
      if (isActive) $a.addClass("active");
      $a.on("click", () => render(num));
      $wrap.append($a);
    }

    // add ellipsis (...)
    function addDots() {
      $wrap.append(`<span class="dots">...</span>`);
    }

    // case A — few pages → show all
    if (maxPage <= 7) {
      for (let i = 1; i <= maxPage; i++) {
        add(i, i === currentPage);
      }
      return;
    }

    // case B — many pages → smart ellipsis
    add(1, currentPage === 1);

    if (currentPage > 3) addDots();

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(maxPage - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      add(i, i === currentPage);
    }

    if (currentPage < maxPage - 2) addDots();

    add(maxPage, currentPage === maxPage);
  }

  // render posts per page
  function render(page) {
    currentPage = Math.max(1, Math.min(page, maxPage));

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    $items.hide().slice(start, end).show();

    $("#prev").toggleClass("disabled", currentPage === 1);
    $("#next").toggleClass("disabled", currentPage === maxPage);

    renderPageNumbers();
  }

  // prev / next button event
  $("#prev").on("click", () => render(currentPage - 1));
  $("#next").on("click", () => render(currentPage + 1));

  // first render
  render(1);
});