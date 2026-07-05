(() => {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeKey = "site-theme";
  const { text } = Site;

  function applyTheme(theme, save = false) {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("theme-light", isLight);
    document.documentElement.style.colorScheme = isLight ? "light" : "dark";

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? text.enableDarkTheme : text.enableLightTheme);
      themeToggle.title = isLight ? text.darkTheme : text.lightTheme;
    }

    if (save) {
      try {
        localStorage.setItem(themeKey, theme);
      } catch {
        // The site still works if the browser blocks localStorage.
      }
    }
  }

  try {
    applyTheme(localStorage.getItem(themeKey) || "dark");
  } catch {
    applyTheme("dark");
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains("theme-light") ? "dark" : "light";
    applyTheme(nextTheme, true);
  });
})();
