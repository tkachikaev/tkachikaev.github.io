(() => {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navigationLinks = [...document.querySelectorAll(".main-nav a")];

  if (!("IntersectionObserver" in window) || !sections.length || !navigationLinks.length) return;

  const menuObserver = new IntersectionObserver(entries => {
    const visibleSection = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    navigationLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
      link.classList.toggle("active", isActive);
      link.toggleAttribute("aria-current", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

  sections.forEach(section => menuObserver.observe(section));
})();
