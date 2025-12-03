document.addEventListener("DOMContentLoaded", () => {
  // get elements
  const collapse = document.querySelector(".nav__collapse");
  const toggle = document.getElementById("dropDownMenuOpen");
  const links = document.querySelectorAll(".nav__link");

  // initialize tabindex for mobile (menu starts closed)
  links.forEach(link => link.setAttribute("tabindex", "-1"));

  // toggle dropdown menu
  toggle.addEventListener("click", () => {
    const isOpen = collapse.classList.toggle("nav__collapse--open");

    // update aria-expanded for accessibility
    toggle.setAttribute("aria-expanded", isOpen);

    // enable or disable tab navigation for menu links
    links.forEach(link => {
      if (isOpen) {
        link.removeAttribute("tabindex");
      } else {
        link.setAttribute("tabindex", "-1");
      }
    });
  });
});