window.Site = window.Site || {};

Site.isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
Site.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
Site.text = Site.isEnglish
  ? {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      enableLightTheme: "Enable light theme",
      enableDarkTheme: "Enable dark theme",
      lightTheme: "Light theme",
      darkTheme: "Dark theme"
    }
  : {
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      enableLightTheme: "Включить светлую тему",
      enableDarkTheme: "Включить тёмную тему",
      lightTheme: "Светлая тема",
      darkTheme: "Тёмная тема"
    };
