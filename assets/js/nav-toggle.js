$(function () {

  const $collapse = $("#nav-collapse");
  const $toggle   = $("#dropDownMenuOpen");

  // toggle dropdown menu
  $toggle.on("click", function () {
    $collapse.toggleClass("show");
  });

});