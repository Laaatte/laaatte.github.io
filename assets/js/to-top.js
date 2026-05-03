// get button element
const toTopButton = document.querySelector(".to-top");

// if button exists, attach events
if (toTopButton) {
  const documentElement = document.documentElement;

  // check if page has enough height to scroll
  const isScrollable = () => {
    return documentElement.scrollHeight > window.innerHeight;
  };

  // show button only when the page can scroll
  const updateButtonVisibility = () => {
    const shouldShow = isScrollable();

    toTopButton.classList.toggle("show", shouldShow);
    toTopButton.tabIndex = shouldShow ? 0 : -1;
  };

  window.addEventListener("resize", updateButtonVisibility);

  // scroll to top on click
  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateButtonVisibility();
}