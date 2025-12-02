document.addEventListener("DOMContentLoaded", () => {
  const collapse = document.querySelector(".nav__collapse");
  const toggle = document.getElementById("dropDownMenuOpen");

  // toggle dropdown menu
  toggle.addEventListener("click", () => {
    collapse.classList.toggle("nav__collapse--open");
  });
});