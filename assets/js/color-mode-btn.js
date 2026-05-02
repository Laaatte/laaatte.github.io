// assets/js/color-mode-btn.js
// key used to persist theme preference in localStorage
const STORAGE_KEY = "theme";

// explicit theme values to avoid magic strings
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

// root element where data-theme attribute controls css variables
const documentElement = document.documentElement;

// color mode toggle button (may not exist on all pages)
const colorModeButton = document.querySelector(".color__mode-btn");

// run script only when toggle button exists
if (colorModeButton) {
  // safely read from localStorage (handles private mode / disabled storage)
  const safeGet = key => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  };

  // safely write to localStorage (ignore quota/security errors)
  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // ignore storage errors
    }
  };

  // return stored theme only if it is a valid value
  // prevents unexpected values from breaking theme logic
  const getStoredTheme = () => {
    const stored = safeGet(STORAGE_KEY);

    if (stored === DARK_THEME || stored === LIGHT_THEME) {
      return stored;
    }

    return null;
  };

  // apply theme to DOM and accessibility state
  // optionally persist only when user explicitly toggles
  const applyTheme = (theme, shouldSave = false) => {
    const isDark = theme === DARK_THEME;

    // update css theme via data attribute
    documentElement.setAttribute("data-theme", theme);

    // reflect state for accessibility (toggle button pressed state)
    colorModeButton.setAttribute("aria-pressed", String(isDark));

    // persist only on explicit user action (not on initial load/system sync)
    if (shouldSave) {
      safeSet(STORAGE_KEY, theme);
    }
  };

  // detect system color scheme preference
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK_THEME : LIGHT_THEME;
  };

  // determine initial theme
  // priority: user preference (localStorage) > system preference
  const getInitialTheme = () => {
    return getStoredTheme() ?? getSystemTheme();
  };

  // apply initial theme without saving
  // (so system preference can still be followed if user hasn't chosen)
  applyTheme(getInitialTheme());

  // listen for system theme changes
  // only apply when user has NOT explicitly selected a theme
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  media.addEventListener("change", event => {
    // if user has chosen a theme, do not override it
    if (getStoredTheme() !== null) {
      return;
    }

    applyTheme(event.matches ? DARK_THEME : LIGHT_THEME);
  });

  // toggle theme on button click
  // this is considered explicit user intent → persist to localStorage
  colorModeButton.addEventListener("click", () => {
    const currentTheme = documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    applyTheme(nextTheme, true);
  });
}