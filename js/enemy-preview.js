document.querySelectorAll("[data-enemy-preview]").forEach(preview => {
  const image = preview.querySelector("img[data-animated]");
  const button = preview.querySelector("[data-enemy-play]");
  const label = button?.querySelector("[data-enemy-play-label]");

  if (!image || !button || !label) return;

  const playLabel = label.textContent.trim();
  const resetLabel = document.documentElement.lang.toLowerCase().startsWith("en") ? "Reset" : "Сбросить";

  button.addEventListener("click", () => {
    const isPlaying = preview.classList.toggle("is-playing");

    if (isPlaying) {
      image.src = image.dataset.animated;
      button.setAttribute("aria-pressed", "true");
      button.querySelector(".bubi-enemy-play__icon").textContent = "↻";
      label.textContent = resetLabel;
      return;
    }

    image.src = image.dataset.poster;
    button.setAttribute("aria-pressed", "false");
    button.querySelector(".bubi-enemy-play__icon").textContent = "▶";
    label.textContent = playLabel;
  });
});
