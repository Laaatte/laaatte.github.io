// assets/js/color-mode-btn.js
(function () {
  // key used to persist theme preference
  const STORAGE_KEY = "theme";

  // root element (<html>) where data-theme is applied
  const root = document.documentElement;

  // color mode toggle button
  const button = document.querySelector(".color__mode-btn");

  // exit early if button does not exist
  if (!button) return;

  // safe storage helpers
  const safeGet = key => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore storage errors
    }
  };

  // apply theme state to dom, storage, and accessibility attributes
  const applyTheme = isDark => {
    const theme = isDark ? "dark" : "light";

    root.setAttribute("data-theme", theme);
    safeSet(STORAGE_KEY, theme);
    button.setAttribute("aria-pressed", isDark);
  };

  // determine initial theme
  // priority: localStorage > system preference
  const getInitialTheme = () => {
    const stored = safeGet(STORAGE_KEY);
    if (stored) return stored === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // sync initial theme state on page load
  applyTheme(getInitialTheme());

  // follow system theme only when user has not chosen explicitly
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", e => {
    if (safeGet(STORAGE_KEY)) return;
    applyTheme(e.matches);
  });

  // toggle theme on button click
  button.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") !== "dark");
  });
})();