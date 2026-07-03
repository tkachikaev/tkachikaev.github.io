const header = document.querySelector(".site-header");
const bar = document.querySelector(".progress span");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];

function setupCampfireBanner() {
  const banner = document.querySelector(".campfire-banner");
  if (!banner || banner.dataset.layoutReady === "true") return;

  const image = banner.querySelector("img");
  if (!image) return;

  if (!document.querySelector('link[href="css/campfire.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "css/campfire.css";
    document.head.append(stylesheet);
  }

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

setupCampfireBanner();

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
