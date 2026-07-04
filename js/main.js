const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".progress span");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const themeToggle = document.querySelector(".theme-toggle");
const brandLink = document.querySelector(".brand");
const absoluteTopLinks = [...document.querySelectorAll(".footer-links a[href^='#']")];
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

function scrollToAbsoluteTop() {
  closeMenu();
  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth"
  });

  if (window.location.hash) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
}

brandLink?.addEventListener("click", event => {
  const href = brandLink.getAttribute("href") || "";

  if (href === "#top") {
    event.preventDefault();
    scrollToAbsoluteTop();
    return;
  }

  if (href.endsWith("#top")) {
    event.preventDefault();
    window.location.href = href.slice(0, -4);
  }
});

absoluteTopLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    scrollToAbsoluteTop();
  });
});

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

const heroArt = document.querySelector(".hero-art");

if (heroArt) {
  const bubiHref = isEnglish ? "bubi-en.html" : "bubi.html";
  const bubiCtaText = isEnglish ? "Learn more about Bubi" : "Подробнее о Bubi";
  const styleId = "bubi-hero-cta-styles";

  const cta = document.createElement("a");
  cta.className = "hero-art-cta";
  cta.href = bubiHref;
  cta.innerHTML = `<span>${bubiCtaText}</span><b aria-hidden="true">→</b>`;
  heroArt.append(cta);

  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .hero-art-cta {
        position: absolute;
        z-index: 3;
        right: 16px;
        bottom: 16px;
        display: inline-flex;
        align-items: center;
        gap: 14px;
        padding: 10px 13px 10px 15px;
        border: 1px solid rgba(255, 255, 255, .22);
        border-radius: 999px;
        background: rgba(9, 17, 24, .70);
        box-shadow: 0 10px 24px rgba(0, 0, 0, .20);
        color: #fff;
        cursor: pointer;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .01em;
        line-height: 1;
        backdrop-filter: blur(12px) saturate(130%);
        -webkit-backdrop-filter: blur(12px) saturate(130%);
        transition: transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease;
      }
      .hero-art-cta b {
        font-size: 18px;
        font-weight: 400;
        line-height: .7;
        transition: transform .2s ease;
      }
      .hero-art-cta:hover,
      .hero-art-cta:focus-visible {
        border-color: rgba(255, 188, 99, .82);
        background: rgba(9, 17, 24, .84);
        box-shadow: 0 12px 28px rgba(0, 0, 0, .26);
        transform: translateY(-2px);
      }
      .hero-art-cta:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 4px;
      }
      .hero-art-cta:hover b,
      .hero-art-cta:focus-visible b {
        transform: translateX(3px);
      }
      @media (max-width: 680px) {
        .hero-art-cta {
          right: 12px;
          bottom: 12px;
          gap: 11px;
          padding: 9px 11px 9px 13px;
          font-size: 11px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .hero-art-cta,
        .hero-art-cta b { transition: none; }
      }
    `;
    document.head.append(style);
  }
}
