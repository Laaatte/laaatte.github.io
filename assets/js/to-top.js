// get button element
const toTopButton = document.querySelector(".to-top");

// if button exists, attach events
if (toTopButton) {
  // show button near bottom of page
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    if (scrollTop + windowHeight > fullHeight - 120) {
      toTopButton.classList.add("show");
    } else {
      toTopButton.classList.remove("show");
    }
  });

  // scroll to top on click
  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}