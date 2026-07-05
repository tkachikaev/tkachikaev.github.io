(() => {
  const header = document.querySelector(".site-header");
  const progressBar = document.querySelector(".progress span");
  let scrollFrame = 0;

  function updateScrollState() {
    scrollFrame = 0;
    header?.classList.toggle("scrolled", window.scrollY > 10);

    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  }

  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
  }

  updateScrollState();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
})();
