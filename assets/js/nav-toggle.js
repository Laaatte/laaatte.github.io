document.addEventListener("DOMContentLoaded", () => {
  // cache elements
  const collapse = document.querySelector(".nav__collapse");
  const toggle = document.getElementById("dropDownMenuOpen");
  const links = document.querySelectorAll(".nav__link");

  // media query (live)
  const mq = window.matchMedia("(min-width: 960px)");

  // apply correct state based on current mode
  const applyMode = () => {
    const desktop = mq.matches;

    if (desktop) {
      // desktop: menu is always open
      collapse.classList.add("nav__collapse--open");
      toggle.setAttribute("aria-expanded", "false");

      // desktop: links stay focusable
      links.forEach(link => link.removeAttribute("tabindex"));

      // desktop: hide toggle button
      toggle.style.display = "none";
    } else {
      // mobile: menu starts closed
      collapse.classList.remove("nav__collapse--open");
      toggle.setAttribute("aria-expanded", "false");

      // mobile: disable tab navigation while closed
      links.forEach(link => link.setAttribute("tabindex", "-1"));

      // mobile: show toggle button
      toggle.style.display = "block";
    }
  };

  // run once
  applyMode();

  // run on breakpoint change
  mq.addEventListener("change", applyMode);

  // handle toggle button
  toggle.addEventListener("click", () => {
    const desktop = mq.matches;
    if (desktop) return;

    const isOpen = collapse.classList.toggle("nav__collapse--open");
    toggle.setAttribute("aria-expanded", isOpen);

    // update link tabindex state
    links.forEach(link => {
      if (isOpen) link.removeAttribute("tabindex");
      else link.setAttribute("tabindex", "-1");
    });
  });

  // close menu with esc key (mobile only)
  document.addEventListener("keydown", e => {
    const desktop = mq.matches;
    if (desktop) return;
    if (e.key !== "Escape") return;

    // close only if open
    if (collapse.classList.contains("nav__collapse--open")) {
      collapse.classList.remove("nav__collapse--open");
      toggle.setAttribute("aria-expanded", "false");

      links.forEach(link => link.setAttribute("tabindex", "-1"));
    }
  });

  // close menu on outside click (mobile only)
  document.addEventListener("click", e => {
    const desktop = mq.matches;
    if (desktop) return;

    const isOpen = collapse.classList.contains("nav__collapse--open");
    if (!isOpen) return;

    // ignore clicks inside toggle or menu
    if (collapse.contains(e.target)) return;
    if (toggle.contains(e.target)) return;

    // close menu
    collapse.classList.remove("nav__collapse--open");
    toggle.setAttribute("aria-expanded", "false");

    links.forEach(link => link.setAttribute("tabindex", "-1"));
  });
});