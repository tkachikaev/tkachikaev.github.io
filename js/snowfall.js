(() => {
  const siteSettings = window.SiteCosmetics || {};
  const snowfallSettings = typeof siteSettings.snowfall === "object"
    ? siteSettings.snowfall
    : { enabled: siteSettings.snowfall === true };

  if (snowfallSettings.enabled !== true) return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reduceMotion) return;

  const flakeSettings = snowfallSettings.flakes || {};

  function readCount(value, fallback) {
    const count = Number(value);
    if (!Number.isFinite(count)) return fallback;
    return Math.max(0, Math.min(150, Math.round(count)));
  }

  function getFlakeCount() {
    const desktopCount = readCount(flakeSettings.desktop, 26);
    const tabletCount = readCount(flakeSettings.tablet, 18);
    const mobileCount = readCount(flakeSettings.mobile, 12);
    const lowPerformanceCount = readCount(flakeSettings.lowPerformance, 12);

    const width = window.innerWidth;
    let count = width < 520
      ? mobileCount
      : width < 900
        ? tabletCount
        : desktopCount;

    const lowMemory = Number(navigator.deviceMemory || 8) <= 4;
    const lowCpu = Number(navigator.hardwareConcurrency || 8) <= 4;

    if (lowMemory || lowCpu) {
      count = Math.min(count, lowPerformanceCount);
    }

    return count;
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createSnowfall() {
    if (document.querySelector("[data-snowfall]")) return;

    const layer = document.createElement("div");
    layer.className = "snowfall";
    layer.dataset.snowfall = "";
    layer.setAttribute("aria-hidden", "true");

    const fragment = document.createDocumentFragment();
    const count = getFlakeCount();

    for (let index = 0; index < count; index += 1) {
      const flake = document.createElement("i");
      flake.className = "snowfall__flake";
      flake.style.setProperty("--snow-x", `${random(0, 100).toFixed(2)}vw`);
      flake.style.setProperty("--snow-size", `${random(3, 7).toFixed(2)}px`);
      flake.style.setProperty("--snow-opacity", random(.24, .66).toFixed(2));
      flake.style.setProperty("--snow-duration", `${random(13, 24).toFixed(2)}s`);
      flake.style.setProperty("--snow-delay", `${random(-24, 0).toFixed(2)}s`);
      flake.style.setProperty("--snow-drift", `${random(-9, 9).toFixed(2)}vw`);
      fragment.append(flake);
    }

    layer.append(fragment);
    document.body.append(layer);

    document.addEventListener("visibilitychange", () => {
      layer.classList.toggle("is-paused", document.hidden);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSnowfall, { once: true });
  } else {
    createSnowfall();
  }
})();
