// assets/js/color-mode-btn.js
// key used to persist theme preference
const STORAGE_KEY = "theme";

// root element where data-theme is applied
const root = document.documentElement;

// color mode toggle button
const colorModeButton = document.querySelector(".color__mode-btn");

// run only if button exists
if (colorModeButton) {
  // safe storage helpers
  const safeGet = key => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // ignore storage errors
    }
  };

  // check whether user already chose a theme
  const hasStoredTheme = () => safeGet(STORAGE_KEY) !== null;

  // apply theme state to dom, storage, and accessibility attributes
  const applyTheme = isDark => {
    const theme = isDark ? "dark" : "light";

    root.setAttribute("data-theme", theme);
    safeSet(STORAGE_KEY, theme);
    colorModeButton.setAttribute("aria-pressed", String(isDark));
  };

  // determine initial theme
  // priority: localStorage > system preference
  const getInitialTheme = () => {
    const stored = safeGet(STORAGE_KEY);
    if (stored !== null) return stored === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // sync initial theme state on page load
  applyTheme(getInitialTheme());

  // follow system theme only when user has not chosen explicitly
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", event => {
    if (hasStoredTheme()) return;
    applyTheme(event.matches);
  });

  // toggle theme on button click
  colorModeButton.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") !== "dark");
  });
}