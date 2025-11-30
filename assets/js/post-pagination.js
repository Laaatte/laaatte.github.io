$(function () {
  const $items = $("#post-list .post-link");
  const total = $items.length;
  const perPage = 10;
  const $pagination = $(".pagination");
  const $pageNumbers = $("#page-numbers");
  const $searchInput = $("#search-input");
  const $noResultsMessage = $("#no-results-message");

  let typingTimer;
  const doneTypingInterval = 500; // 500ms delay after user stops typing

  // if no posts, hide pagination
  if (total === 0) {
    $pagination.removeClass("show");
    return;
  }

  // if total posts <= 10, show all items and hide pagination
  if (total <= perPage) {
    $items.show();
    $pagination.removeClass("show");
    return;
  }

  // pagination is needed, show it
  $pagination.addClass("show");

  let currentPage = 1;
  let filteredItems = $items;
  let maxPage = Math.ceil(filteredItems.length / perPage);

  // render page numbers
  function renderPageNumbers() {
    $pageNumbers.empty(); // clear existing page numbers

    function addPageLink(num, isActive = false) {
      const $a = $(`<a class="page-link">${num}</a>`);
      if (isActive) $a.addClass("active");
      $a.on("click", () => render(num)); // attach click handler to the page link
      $pageNumbers.append($a);
    }

    if (maxPage <= 7) {
      for (let i = 1; i <= maxPage; i++) {
        addPageLink(i, i === currentPage);
      }
      return;
    }

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

    addPageLink(maxPage, currentPage === maxPage);
  }

  // render posts per page
  function render(page) {
    currentPage = Math.max(1, Math.min(page, maxPage));

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    filteredItems.hide().slice(start, end).show(); // only show the current page items

    $("#prev").toggleClass("disabled", currentPage === 1 || filteredItems.length === 0);
    $("#next").toggleClass("disabled", currentPage === maxPage || filteredItems.length === 0);

    renderPageNumbers(); // update page numbers
  }

  // prev / next button event
  $("#prev").on("click", () => render(currentPage - 1));
  $("#next").on("click", () => render(currentPage + 1));

  // safely escape HTML characters
  function escapeHtml(text) {
    return text.replace(/[&<>"'`=\/]/g, (char) => `&#${char.charCodeAt(0)};`);
  }

  // highlight search term in text
  function searchHighlightTerm(text, term) {
    const escapedText = escapeHtml(text); // escape HTML characters
    const regex = new RegExp(`(${term})`, 'gi'); // case-insensitive regex
    return escapedText.replace(regex, '<span class="search-highlight">$1</span>'); // wrap search term with <span> for highlighting
  }

  // search function
  window.searchPosts = function() {
    const searchTerm = $searchInput.val().toLowerCase().trim(); // get search term and trim whitespace

    // if search term is empty, show all items and hide "no results" message
    if (searchTerm === "") {
      $items.show(); // show all posts
      $noResultsMessage.hide(); // hide "no results" message

      // remove highlight from all items
      $items.each(function() {
        const titleElement = $(this).find("a");
        const excerptElement = $(this).find("p");

        // reset highlighted text using text() instead of html()
        titleElement.text(titleElement.text());
        excerptElement.text(excerptElement.text());
      });

      return; // return early to stop further processing
    }

    // filter items based on search term
    filteredItems = $items.filter(function () {
      const title = $(this).find("a").text().toLowerCase();
      const excerpt = $(this).find("p").text().toLowerCase();
      
      return title.includes(searchTerm) || excerpt.includes(searchTerm);
    });

    // hide all items first
    $items.hide();

    // show only filtered items
    filteredItems.show();

    // highlight search term in title and excerpt
    filteredItems.each(function () {
      const titleElement = $(this).find("a");
      const excerptElement = $(this).find("p");

      // safely insert highlighted text using html() with escaping
      titleElement.html(searchHighlightTerm(titleElement.text(), searchTerm));  // highlight in title
      excerptElement.html(searchHighlightTerm(excerptElement.text(), searchTerm)); // highlight in excerpt
    });

    // show "no results found" message if no items match
    if (filteredItems.length === 0) {
      $noResultsMessage.show(); // show no results message
    } else {
      $noResultsMessage.hide(); // hide no results message
    }

    // adjust pagination based on filtered results
    maxPage = Math.ceil(filteredItems.length / perPage); // update maxPage based on filtered results
    render(1); // re-render with the updated page number and filtered posts
  }

  // attach search function to the input field with delay
  $searchInput.on("input", function() {
    clearTimeout(typingTimer); // clear the previous timer
    typingTimer = setTimeout(searchPosts, doneTypingInterval); // wait for user to stop typing
  });

  // initial render
  render(1);
});