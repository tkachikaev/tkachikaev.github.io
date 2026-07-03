const header = document.querySelector(".site-header");
const bar = document.querySelector(".progress span");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];

function loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = href;
  document.head.append(stylesheet);
}

function setupCampfireBanner() {
  const banner = document.querySelector(".campfire-banner");
  if (!banner || banner.dataset.layoutReady === "true") return;

  const image = banner.querySelector("img");
  if (!image) return;

  loadStylesheet("css/campfire.css");
  image.alt = "Костёр в игровом мире";

  const media = document.createElement("div");
  media.className = "campfire-media";
  media.append(image);

  const copy = document.createElement("figcaption");
  copy.className = "campfire-copy";
  copy.innerHTML = `
    <svg class="campfire-heart" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.2 4.55 12.9a4.62 4.62 0 0 1 0-6.56 4.79 4.79 0 0 1 6.69 0L12 7.09l.76-.75a4.79 4.79 0 0 1 6.69 0 4.62 4.62 0 0 1 0 6.56Z" />
    </svg>
    <blockquote>
      <p>Я не делаю игры, чтобы кому-то что-то доказать.</p>
      <p>Я делаю их, потому что не могу иначе.</p>
    </blockquote>
  `;

  banner.replaceChildren(media, copy);
  banner.dataset.layoutReady = "true";
}

function setupThemeToggle() {
  const headerInner = document.querySelector(".header-inner");
  if (!headerInner || document.querySelector(".theme-toggle")) return;

  loadStylesheet("css/theme.css");

  const themeKey = "site-theme";
  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.type = "button";
  button.innerHTML = `
    <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
    </svg>
    <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.1 15.2A8.5 8.5 0 0 1 8.8 3.9 8.5 8.5 0 1 0 20.1 15.2Z"></path>
    </svg>
  `;

  const applyTheme = (theme, save = false) => {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("theme-light", isLight);
    document.documentElement.style.colorScheme = isLight ? "light" : "dark";
    button.setAttribute("aria-pressed", String(isLight));
    button.setAttribute(
      "aria-label",
      isLight ? "Включить тёмную тему" : "Включить светлую тему"
    );
    button.title = isLight ? "Тёмная тема" : "Светлая тема";

    if (save) {
      try {
        localStorage.setItem(themeKey, theme);
      } catch {
        // Сайт продолжит работать, даже если браузер блокирует localStorage.
      }
    }
  };

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem(themeKey) || "dark";
  } catch {
    // По умолчанию сайт остаётся в текущей тёмной теме.
  }

  headerInner.append(button);
  applyTheme(savedTheme);

  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.classList.contains("theme-light")
      ? "dark"
      : "light";

    applyTheme(nextTheme, true);
  });
}

setupCampfireBanner();
setupThemeToggle();

function handleScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
  header.classList.toggle("scrolled", window.scrollY > 10);
}
handleScroll();
window.addEventListener("scroll", handleScroll, { passive: true });

toggle?.addEventListener("click", () => {
  toggle.classList.toggle("open");
  nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(nav.classList.contains("open")));
});
navLinks.forEach(link => link.addEventListener("click", () => {
  toggle?.classList.remove("open");
  nav.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
}));

const sections = [...document.querySelectorAll("main section[id]")];

const menuObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${visible.target.id}`
    );
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

sections.forEach(section => menuObserver.observe(section));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(item => observer.observe(item));
document.getElementById("year").textContent = new Date().getFullYear();
