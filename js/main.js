const header = document.querySelector(".site-header");
const bar = document.querySelector(".progress span");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];

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
