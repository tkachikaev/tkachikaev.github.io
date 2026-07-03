const parallaxScene = document.querySelector(".bubi-parallax");

if (parallaxScene) {
  const loadStyle = href => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.append(link);
  };

  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  loadStyle("css/bubi-parallax-assets.css?v=2");

  Promise.all([
    loadScript("js/bubi-parallax-sky.js?v=1"),
    loadScript("js/bubi-parallax-sun.js?v=1"),
    loadScript("js/bubi-parallax-far.js?v=1"),
    loadScript("js/bubi-parallax-mid.js?v=1"),
    loadScript("js/bubi-parallax-front.js?v=1"),
    loadScript("js/bubi-parallax-mountains.js?v=1")
  ]).then(() => loadScript("js/bubi-parallax.js?v=2")).catch(() => {
    // CSS fallback remains visible if a game layer fails to load.
  });
}

const galleryItems = [...document.querySelectorAll(".bubi-gallery-item")];
const lightbox = document.querySelector(".gallery-lightbox");

if (galleryItems.length && lightbox) {
  const lightboxImage = lightbox.querySelector(".gallery-lightbox__image");
  const lightboxCaption = lightbox.querySelector(".gallery-lightbox__caption");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const previousButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");
  let activeIndex = 0;
  let lastTrigger = null;

  function setActiveItem(index) {
    activeIndex = (index + galleryItems.length) % galleryItems.length;

    const item = galleryItems[activeIndex];
    const image = item.querySelector("img");
    const caption = item.dataset.caption || image.alt;

    lightboxImage.src = item.dataset.full || image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption;
  }

  function restoreFocus() {
    lastTrigger?.focus();
  }

  function closeLightbox() {
    if (lightbox.open && typeof lightbox.close === "function") {
      lightbox.close();
      return;
    }

    lightbox.removeAttribute("open");
    restoreFocus();
  }

  function openLightbox(index) {
    lastTrigger = galleryItems[index];
    setActiveItem(index);

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }

    closeButton?.focus();
  }

  function showPrevious() {
    setActiveItem(activeIndex - 1);
  }

  function showNext() {
    setActiveItem(activeIndex + 1);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", showPrevious);
  nextButton?.addEventListener("click", showNext);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener("cancel", event => {
    event.preventDefault();
    closeLightbox();
  });

  lightbox.addEventListener("close", restoreFocus);

  document.addEventListener("keydown", event => {
    if (!lightbox.open) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  });
}
