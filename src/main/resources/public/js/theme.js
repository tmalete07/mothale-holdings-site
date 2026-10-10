// Light/dark mode. This file loads in the <head> so the saved theme is applied
// before the page is drawn - otherwise the page would "flash" white first.
(function () {
    const STORAGE_KEY = "mothale-theme";

    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null; // storage can be blocked (e.g. private mode)
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            // ignore - the toggle still works, it just won't be remembered
        }
    }

    // 1. Use the saved choice, otherwise follow the device setting
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const startTheme = getSavedTheme() || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", startTheme);

    // 2. Once the header exists, add the sun/moon button to it
    document.addEventListener("DOMContentLoaded", () => {
        const actions = document.querySelector(".header-actions");
        if (!actions) {
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "icon-btn theme-toggle";

        function updateButton() {
            const isDark = document.documentElement.getAttribute("data-theme") === "dark";
            button.textContent = isDark ? "☀" : "☾";
            button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        }

        button.addEventListener("click", () => {
            const isDark = document.documentElement.getAttribute("data-theme") === "dark";
            const newTheme = isDark ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            saveTheme(newTheme);
            updateButton();
        });

        updateButton();
        actions.prepend(button);
    });
})();