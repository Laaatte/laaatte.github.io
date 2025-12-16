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

  // apply correct state based on current mode
  const applyMode = () => {
    const desktop = mq.matches;

    if (desktop) {
      // desktop: menu is always open
      collapse.classList.add("nav__collapse--open");
      toggle.setAttribute("aria-expanded", "false");

      // desktop: links stay focusable
      setLinksFocusable(true);

      // desktop: hide toggle button
      toggle.style.display = "none";
    } else {
      // mobile: menu starts closed
      collapse.classList.remove("nav__collapse--open");
      toggle.setAttribute("aria-expanded", "false");

      // mobile: disable tab navigation while closed
      setLinksFocusable(false);

      // mobile: show toggle button
      toggle.style.display = "block";
    }
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

    // update link tabindex state
    setLinksFocusable(isOpen);
  });

  // close menu with esc key (mobile only)
  document.addEventListener("keydown", e => {
    if (mq.matches) return;
    if (e.key !== "Escape") return;

    if (collapse.classList.contains("nav__collapse--open")) {
      collapse.classList.remove("nav__collapse--open");
      toggle.setAttribute("aria-expanded", "false");
      setLinksFocusable(false);
    }
  });

  // close menu on outside click (mobile only)
  document.addEventListener("click", e => {
    if (mq.matches) return;
    if (!collapse.classList.contains("nav__collapse--open")) return;

    // ignore clicks inside toggle or menu
    if (collapse.contains(e.target)) return;
    if (toggle.contains(e.target)) return;

    collapse.classList.remove("nav__collapse--open");
    toggle.setAttribute("aria-expanded", "false");
    setLinksFocusable(false);
  });
});