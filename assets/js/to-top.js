// get button element
const toTopButton = document.querySelector(".to-top");

// if button exists, attach events
if (toTopButton) {
  const root = document.documentElement;
  const showOffset = 240;

  let ticking = false;

  // check if page has enough height to scroll
  const isScrollable = () => {
    return root.scrollHeight > window.innerHeight;
  };

  // show button near bottom of page
  const updateButtonVisibility = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = root.scrollHeight;

    const shouldShow = isScrollable() && scrollTop + windowHeight > fullHeight - showOffset;

    toTopButton.classList.toggle("show", shouldShow);

    ticking = false;
  };

  // limit scroll handler work with requestAnimationFrame
  const requestButtonUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateButtonVisibility);
  };

  window.addEventListener("scroll", requestButtonUpdate, { passive: true });
  window.addEventListener("resize", requestButtonUpdate);

  // scroll to top on click
  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateButtonVisibility();
}