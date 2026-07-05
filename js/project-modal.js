(() => {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const copy = Site.isEnglish
    ? { defaultText: "Project description will appear later.", fallbackTitle: "Project", fallbackStatus: "Soon" }
    : { defaultText: "Описание проекта появится позже.", fallbackTitle: "Проект", fallbackStatus: "Скоро" };

  const titleElement = modal.querySelector("[data-project-modal-title]");
  const statusElement = modal.querySelector("[data-project-modal-status]");
  const textElement = modal.querySelector("[data-project-modal-body]");
  const closeControls = [...modal.querySelectorAll("[data-modal-close]")];
  const triggers = [...document.querySelectorAll(".project-card-overlay-button")];
  let lastTrigger = null;

  function restoreFocus() {
    lastTrigger?.focus();
    lastTrigger = null;
  }

  function closeModal() {
    if (modal.open && typeof modal.close === "function") {
      modal.close();
      return;
    }

    modal.removeAttribute("open");
    document.body.classList.remove("modal-open");
    restoreFocus();
  }

  function openModal(trigger) {
    lastTrigger = trigger;
    titleElement.textContent = trigger.dataset.projectName || copy.fallbackTitle;
    statusElement.textContent = trigger.dataset.projectStatus || copy.fallbackStatus;
    textElement.textContent = trigger.dataset.projectDescription || copy.defaultText;

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
      document.body.classList.add("modal-open");
    }

    modal.querySelector(".project-modal__close")?.focus();
  }

  triggers.forEach(trigger => trigger.addEventListener("click", () => openModal(trigger)));
  closeControls.forEach(control => control.addEventListener("click", closeModal));

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener("cancel", event => {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    restoreFocus();
  });
})();
