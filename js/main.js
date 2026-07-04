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
  ? { openMenu: "Open menu", closeMenu: "Close menu", enableLightTheme: "Enable light theme", enableDarkTheme: "Enable dark theme", lightTheme: "Light theme", darkTheme: "Dark theme" }
  : { openMenu: "Открыть меню", closeMenu: "Закрыть меню", enableLightTheme: "Включить светлую тему", enableDarkTheme: "Включить тёмную тему", lightTheme: "Светлая тема", darkTheme: "Тёмная тема" };

function applyTheme(theme, save = false) {
  const isLight = theme === "light";
  document.documentElement.classList.toggle("theme-light", isLight);
  document.documentElement.style.colorScheme = isLight ? "light" : "dark";
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? uiText.enableDarkTheme : uiText.enableLightTheme);
    themeToggle.title = isLight ? uiText.darkTheme : uiText.lightTheme;
  }
  if (save) { try { localStorage.setItem(themeKey, theme); } catch {} }
}
try { applyTheme(localStorage.getItem(themeKey) || "dark"); } catch { applyTheme("dark"); }
themeToggle?.addEventListener("click", () => applyTheme(document.documentElement.classList.contains("theme-light") ? "dark" : "light", true));

function closeMenu() {
  if (!navigation || !menuToggle) return;
  navigation.classList.remove("open"); menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false"); menuToggle.setAttribute("aria-label", uiText.openMenu);
}
function scrollToAbsoluteTop() {
  closeMenu(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  if (window.location.hash) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}
brandLink?.addEventListener("click", event => {
  const href = brandLink.getAttribute("href") || "";
  if (href === "#top") { event.preventDefault(); scrollToAbsoluteTop(); return; }
  if (href.endsWith("#top")) { event.preventDefault(); window.location.href = href.slice(0, -4); }
});
absoluteTopLinks.forEach(link => link.addEventListener("click", event => { event.preventDefault(); scrollToAbsoluteTop(); }));
menuToggle?.addEventListener("click", () => {
  if (!navigation) return;
  const isOpen = navigation.classList.toggle("open"); menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen)); menuToggle.setAttribute("aria-label", isOpen ? uiText.closeMenu : uiText.openMenu);
});
navigationLinks.forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
document.addEventListener("click", event => {
  if (!navigation?.classList.contains("open")) return;
  if (navigation.contains(event.target) || menuToggle?.contains(event.target)) return;
  closeMenu();
});

let scrollFrame = 0;
function updateScrollState() {
  scrollFrame = 0; header?.classList.toggle("scrolled", window.scrollY > 10);
  if (progressBar) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  }
}
function requestScrollUpdate() { if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState); }
updateScrollState(); window.addEventListener("scroll", requestScrollUpdate, { passive: true }); window.addEventListener("resize", requestScrollUpdate, { passive: true });

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window && sections.length && navigationLinks.length) {
  const menuObserver = new IntersectionObserver(entries => {
    const visibleSection = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visibleSection) return;
    navigationLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  sections.forEach(section => menuObserver.observe(section));
}

function enableRevealAnimations() {
  const revealItems = [...document.querySelectorAll(".reveal")];
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  revealItems.forEach(item => item.classList.add("will-reveal"));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("in"); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
}
enableRevealAnimations();
year?.append(String(new Date().getFullYear()));

function addDevlogStyles() {
  if (document.getElementById("devlog-styles")) return;
  const style = document.createElement("style");
  style.id = "devlog-styles";
  style.textContent = `
    .devlog-section{padding:76px 0}.devlog-home{display:grid;grid-template-columns:minmax(0,.75fr) minmax(0,1.25fr);align-items:center;gap:28px;padding:clamp(26px,4vw,44px);border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,rgba(255,156,42,.10),rgba(255,255,255,.018))}.devlog-home h2{margin:0;font:700 clamp(30px,4vw,48px)/1.02 "Space Grotesk",sans-serif;letter-spacing:-.055em}.devlog-home__intro{max-width:380px;margin:16px 0 0;color:var(--muted);font-size:15px;line-height:1.7}.devlog-entry{display:grid;grid-template-columns:118px minmax(0,1fr);gap:18px;padding:20px 0;border-top:1px solid var(--line)}.devlog-entry:first-child{border-top:0;padding-top:0}.devlog-entry time{color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase}.devlog-entry h3{margin:0 0 7px;font:700 21px/1.15 "Space Grotesk",sans-serif;letter-spacing:-.04em}.devlog-entry p{margin:0;color:var(--muted);font-size:14px;line-height:1.65}.devlog-home>.text-link{justify-self:start}.devlog-section .container>.devlog-list{max-width:850px}.devlog-section .bubi-section-heading{margin-bottom:34px}@media(max-width:760px){.devlog-section{padding:60px 0}.devlog-home{grid-template-columns:1fr;gap:24px;border-radius:18px}.devlog-entry{grid-template-columns:1fr;gap:8px}.devlog-home__entry .devlog-entry{padding-bottom:0}}html.theme-light .devlog-home{background:linear-gradient(145deg,rgba(216,120,19,.10),rgba(255,255,255,.68))}`;
  document.head.append(style);
}

function formatDevlogDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat(isEnglish ? "en-US" : "ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
function createDevlogEntry(entry, locale) {
  const content = entry[locale] || entry.ru;
  const article = document.createElement("article"); article.className = "devlog-entry reveal";
  article.innerHTML = `<time datetime="${entry.date}">${formatDevlogDate(entry.date)}</time><div><h3>${content.title}</h3><p>${content.text}</p></div>`;
  return article;
}
async function renderDevlog() {
  const main = document.querySelector("main"); if (!main) return;
  try {
    const response = await fetch("data/devlog.json?v=1", { cache: "no-cache" }); if (!response.ok) return;
    const entries = await response.json(); if (!Array.isArray(entries) || !entries.length) return;
    addDevlogStyles(); entries.sort((a, b) => b.date.localeCompare(a.date));
    const locale = isEnglish ? "en" : "ru"; const isBubiPage = document.body.classList.contains("bubi-page");
    const section = document.createElement("section"); section.className = isBubiPage ? "bubi-section devlog-section" : "devlog-section"; section.id = "devlog";
    const title = isEnglish ? "Development log" : "Дневник разработки";
    const subtitle = isEnglish ? "Small steps that gradually turn into a game." : "Небольшие шаги, из которых постепенно собирается игра.";
    if (isBubiPage) {
      const list = document.createElement("div"); list.className = "devlog-list"; entries.forEach(entry => list.append(createDevlogEntry(entry, locale)));
      section.innerHTML = `<div class="container"><div class="bubi-section-heading"><div><p class="eyebrow">${title}</p><h2 class="bubi-section-title">${subtitle}</h2></div></div></div>`;
      section.querySelector(".container").append(list);
      const gallery = document.getElementById("gallery"); gallery ? main.insertBefore(section, gallery) : main.append(section);
    } else {
      const latest = createDevlogEntry(entries[0], locale); latest.classList.remove("reveal");
      const page = isEnglish ? "bubi-en.html" : "bubi.html";
      section.innerHTML = `<div class="container"><div class="devlog-home"><div><p class="eyebrow">${isEnglish ? "Latest update" : "Последнее обновление"}</p><h2>${title}</h2><p class="devlog-home__intro">${subtitle}</p></div><div class="devlog-home__entry"></div><a class="text-link" href="${page}#devlog">${isEnglish ? "All updates" : "Все обновления"} <span>→</span></a></div></div>`;
      section.querySelector(".devlog-home__entry").append(latest); document.getElementById("projects")?.after(section);
    }
    enableRevealAnimations();
  } catch {}
}
renderDevlog();
