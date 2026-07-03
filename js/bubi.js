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
