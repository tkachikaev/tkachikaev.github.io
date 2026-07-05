(() => {
  const revealItems = [...document.querySelectorAll(".reveal")];
  if (Site.reduceMotion || !("IntersectionObserver" in window)) return;

  revealItems.forEach(item => item.classList.add("will-reveal"));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
})();
