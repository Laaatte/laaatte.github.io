// assets/js/nav-toggle.js
document.addEventListener("DOMContentLoaded", () => {
  // cache elements
  const collapse = document.querySelector(".nav__collapse");
  const toggle = document.getElementById("dropDownMenuOpen");
  const links = document.querySelectorAll(".nav__link");

  // exit early if nav does not exist
  if (!collapse || !toggle) return;

  // media query (live)
  const mq = window.matchMedia("(min-width: 960px)");

  // update link tabindex state
  const setLinksFocusable = focusable => {
    links.forEach(link => {
      if (focusable) link.removeAttribute("tabindex");
      else link.setAttribute("tabindex", "-1");
    });
  };

  // close mobile menu
  const closeMenu = () => {
    collapse.classList.remove("nav__collapse--open");
    toggle.setAttribute("aria-expanded", "false");
    setLinksFocusable(false);
  };

  // apply correct state based on current mode
  const applyMode = () => {
    if (mq.matches) {
      // desktop: menu is always open
      collapse.classList.add("nav__collapse--open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.style.display = "none";
      setLinksFocusable(true);
      return;
    }

    // mobile: menu starts closed
    closeMenu();
    toggle.style.display = "block";
  };

  // run once
  applyMode();

  // run on breakpoint change
  mq.addEventListener("change", applyMode);

  // handle toggle button (mobile only)
  toggle.addEventListener("click", () => {
    if (mq.matches) return;

    const isOpen = collapse.classList.toggle("nav__collapse--open");
    toggle.setAttribute("aria-expanded", isOpen);
    setLinksFocusable(isOpen);
  });

  // close menu with esc key (mobile only)
  document.addEventListener("keydown", e => {
    if (mq.matches) return;
    if (e.key !== "Escape") return;
    if (!collapse.classList.contains("nav__collapse--open")) return;

    closeMenu();
  });

  // close menu on outside click (mobile only)
  document.addEventListener("click", e => {
    if (mq.matches) return;
    if (!collapse.classList.contains("nav__collapse--open")) return;
    if (collapse.contains(e.target) || toggle.contains(e.target)) return;

    closeMenu();
  });
});