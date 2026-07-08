(() => {
  const lang = document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "ru";
  const devlogEntries = Array.isArray(window.BubiDevlog?.[lang]) ? window.BubiDevlog[lang] : [];
  const developmentData = window.BubiDevelopment?.[lang];
  const developmentTarget = document.querySelector("[data-bubi-development]");
  const devlogTarget = document.querySelector("[data-bubi-devlog-list]");
  const devlogModal = document.querySelector("[data-bubi-devlog-modal]");
  const devlogClose = document.querySelector("[data-bubi-devlog-close]");
  let lastTrigger = null;

  function clampProgress(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(100, Math.round(number)));
  }

  function renderDevelopment() {
    if (!developmentTarget || !developmentData) return;

    const info = document.createElement("div");
    info.className = "bubi-development-card__info";

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = developmentData.eyebrow || "";

    const title = document.createElement("h2");
    title.className = "bubi-development-card__title";
    title.textContent = developmentData.title || "";

    const text = document.createElement("p");
    text.className = "bubi-development-card__text";
    text.textContent = developmentData.text || "";

    const progressTitle = document.createElement("p");
    progressTitle.className = "bubi-development-progress-title";
    progressTitle.textContent = developmentData.progressTitle || "";

    const list = document.createElement("div");
    list.className = "bubi-development-progress";

    (developmentData.items || []).slice(0, 5).forEach(row => {
      const value = clampProgress(row.value);
      const item = document.createElement("div");
      item.className = "bubi-development-progress__item";
      item.style.setProperty("--progress", `${value}%`);

      const top = document.createElement("div");
      top.className = "bubi-development-progress__top";

      const name = document.createElement("strong");
      name.textContent = row.title || "";

      const percent = document.createElement("span");
      percent.textContent = `${value}%`;

      const bar = document.createElement("div");
      bar.className = "bubi-development-progress__bar";
      bar.setAttribute("aria-hidden", "true");

      top.append(name, percent);
      item.append(top, bar);
      list.append(item);
    });

    const button = document.createElement("button");
    button.className = "bubi-development-more";
    button.type = "button";
    button.setAttribute("data-bubi-devlog-open", "");
    button.innerHTML = `<span>${developmentData.detailsButton || "Devlog"}</span><b aria-hidden="true">→</b>`;

    info.append(eyebrow, title, text, progressTitle, list, button);

    const art = document.createElement("figure");
    art.className = "bubi-development-card__art";

    const image = document.createElement("img");
    image.src = developmentData.image || "assets/projects/bubi/bubi-worker.png";
    image.alt = developmentData.imageAlt || "Bubi";
    image.loading = "lazy";
    image.decoding = "async";

    const caption = document.createElement("figcaption");
    caption.textContent = developmentData.imageCaption || "";

    art.append(image, caption);
    developmentTarget.append(info, art);
  }

  function renderDevlog() {
    if (!devlogTarget) return;

    if (!devlogEntries.length) {
      const empty = document.createElement("p");
      empty.className = "bubi-devlog-empty";
      empty.textContent = lang === "en" ? "No devlog entries yet." : "Записей пока нет.";
      devlogTarget.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();

    devlogEntries.forEach(entry => {
      const item = document.createElement("article");
      item.className = "bubi-devlog-entry";

      const meta = document.createElement("div");
      meta.className = "bubi-devlog-entry__meta";

      const date = document.createElement("time");
      date.textContent = entry.date || "";

      const tag = document.createElement("span");
      tag.textContent = entry.tag || "";

      meta.append(date, tag);

      const content = document.createElement("div");
      content.className = "bubi-devlog-entry__content";

      const title = document.createElement("h4");
      title.textContent = entry.title || "";

      const text = document.createElement("p");
      text.textContent = entry.text || "";

      content.append(title, text);
      item.append(meta, content);
      fragment.append(item);
    });

    devlogTarget.append(fragment);
  }

  function fillModalHeader() {
    if (!developmentData) return;

    const eyebrow = document.querySelector("[data-bubi-devlog-modal-eyebrow]");
    const title = document.querySelector("[data-bubi-devlog-modal-title]");
    const text = document.querySelector("[data-bubi-devlog-modal-text]");

    if (eyebrow) eyebrow.textContent = developmentData.modalEyebrow || "";
    if (title) title.textContent = developmentData.modalTitle || "";
    if (text) text.textContent = developmentData.modalText || "";
  }

  function openDevlogModal(trigger) {
    if (!devlogModal) return;
    lastTrigger = trigger || null;

    if (typeof devlogModal.showModal === "function") {
      devlogModal.showModal();
    } else {
      devlogModal.setAttribute("open", "");
    }

    devlogClose?.focus();
  }

  function closeDevlogModal() {
    if (!devlogModal) return;

    if (devlogModal.open && typeof devlogModal.close === "function") {
      devlogModal.close();
      return;
    }

    devlogModal.removeAttribute("open");
    lastTrigger?.focus();
  }

  function setupModal() {
    document.addEventListener("click", event => {
      const openButton = event.target.closest("[data-bubi-devlog-open]");
      if (openButton) openDevlogModal(openButton);
    });

    devlogClose?.addEventListener("click", closeDevlogModal);

    devlogModal?.addEventListener("click", event => {
      if (event.target === devlogModal) closeDevlogModal();
    });

    devlogModal?.addEventListener("cancel", event => {
      event.preventDefault();
      closeDevlogModal();
    });

    devlogModal?.addEventListener("close", () => {
      lastTrigger?.focus();
    });
  }

  function setupScrollPassThrough() {
    document.querySelectorAll("[data-bubi-devlog-scroll]").forEach(scroller => {
      scroller.addEventListener("wheel", event => {
        const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
        if (maxScrollTop <= 0) return;

        const atTop = scroller.scrollTop <= 0;
        const atBottom = scroller.scrollTop >= maxScrollTop - 1;
        const wheelDown = event.deltaY > 0;
        const wheelUp = event.deltaY < 0;

        if ((wheelDown && atBottom) || (wheelUp && atTop)) {
          event.preventDefault();
          window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
        }
      }, { passive: false });
    });
  }

  renderDevelopment();
  renderDevlog();
  fillModalHeader();
  setupModal();
  setupScrollPassThrough();
})();
