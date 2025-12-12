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

    // apply theme state to dom, storage, and accessibility attributes
    const applyTheme = isDark => {
        if (isDark) {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem(STORAGE_KEY, "dark");
            button.setAttribute("aria-pressed", "true");
        } else {
            root.setAttribute("data-theme", "light");
            localStorage.setItem(STORAGE_KEY, "light");
            button.setAttribute("aria-pressed", "false");
        }
    };

    // determine initial theme
    // priority: localStorage > system preference
    const getInitialTheme = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "dark") return true;
        if (stored === "light") return false;

        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    // sync initial theme state on page load
    applyTheme(getInitialTheme());

    // toggle theme on button click
    button.addEventListener("click", () => {
        applyTheme(root.getAttribute("data-theme") !== "dark");
    });
})();