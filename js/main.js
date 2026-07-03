const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".progress span");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const themeToggle = document.querySelector(".theme-toggle");
const themeKey = "site-theme";

function applyTheme(theme, save = false) {
  const isLight = theme === "light";

  document.documentElement.classList.toggle("theme-light", isLight);
  document.documentElement.style.colorScheme = isLight ? "light" : "dark";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Включить тёмную тему" : "Включить светлую тему"
    );
    themeToggle.title = isLight ? "Тёмная тема" : "Светлая тема";
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
  const nextTheme = document.documentElement.classList.contains("theme-light")
    ? "dark"
    : "light";

  applyTheme(nextTheme, true);
});

function handleScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${maxScroll ? (window.scrollY / maxScroll) * 100 : 0}%`;
  header.classList.toggle("scrolled", window.scrollY > 10);
}

handleScroll();
window.addEventListener("scroll", handleScroll, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
});

navigationLinks.forEach(link => link.addEventListener("click", () => {
  menuToggle?.classList.remove("open");
  navigation.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Открыть меню");
}));

const sections = [...document.querySelectorAll("main section[id]")];

const menuObserver = new IntersectionObserver((entries) => {
  const visibleSection = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visibleSection) return;

  navigationLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${visibleSection.target.id}`
    );
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

sections.forEach(section => menuObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("in");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));
document.getElementById("year").textContent = new Date().getFullYear();
