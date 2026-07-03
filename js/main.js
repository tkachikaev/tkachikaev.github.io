const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".progress span");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const themeToggle = document.querySelector(".theme-toggle");
const year = document.getElementById("year");
const themeKey = "site-theme";
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");

const uiText = isEnglish
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

function applyTheme(theme, save = false) {
  const isLight = theme === "light";

  document.documentElement.classList.toggle("theme-light", isLight);
  document.documentElement.style.colorScheme = isLight ? "light" : "dark";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? uiText.enableDarkTheme : uiText.enableLightTheme);
    themeToggle.title = isLight ? uiText.darkTheme : uiText.lightTheme;
  }

  if (save) {
    try {
      localStorage.setItem(themeKey, theme);
    } catch {
      // Сайт продолжит работать, даже если браузер блокирует localStorage.
    }
  }
}

try {
  applyTheme(localStorage.getItem(themeKey) || "dark");
} catch {
  applyTheme("dark");
}

themeToggle?.addEventListener("click", () => {
  applyTheme(document.documentElement.classList.contains("theme-light") ? "dark" : "light", true);
});

function closeMenu() {
  if (!navigation || !menuToggle) return;

  navigation.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", uiText.openMenu);
}

menuToggle?.addEventListener("click", () => {
  if (!navigation) return;

  const isOpen = navigation.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? uiText.closeMenu : uiText.openMenu);
});

navigationLinks.forEach(link => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", event => {
  if (!navigation?.classList.contains("open")) return;
  if (navigation.contains(event.target) || menuToggle?.contains(event.target)) return;
  closeMenu();
});

let scrollFrame = 0;
function updateScrollState() {
  scrollFrame = 0;

  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }

  if (progressBar) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  }
}

function requestScrollUpdate() {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(updateScrollState);
  }
}

updateScrollState();
window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate, { passive: true });

const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && sections.length && navigationLinks.length) {
  const menuObserver = new IntersectionObserver(entries => {
    const visibleSection = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    navigationLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  sections.forEach(section => menuObserver.observe(section));
}

const revealItems = [...document.querySelectorAll(".reveal")];

if (!reduceMotion && "IntersectionObserver" in window) {
  revealItems.forEach(item => item.classList.add("will-reveal"));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
}

year?.append(String(new Date().getFullYear()));
