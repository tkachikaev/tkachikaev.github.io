(() => {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const copy = isEnglish
    ? { defaultText: "Project details will appear later.", fallbackTitle: "Project", fallbackStatus: "Coming soon" }
    : { defaultText: "Описание проекта появится позже.", fallbackTitle: "Проект", fallbackStatus: "Скоро" };

  const titleElement = modal.querySelector("[data-project-modal-title]");
  const statusElement = modal.querySelector("[data-project-modal-status]");
  const textElement = modal.querySelector("[data-project-modal-body]");
  const triggers = [...document.querySelectorAll(".project-card-overlay-button")];
  const closeControls = [...modal.querySelectorAll("[data-modal-close]")];

  function openModal(projectName, projectStatus) {
    titleElement.textContent = projectName || copy.fallbackTitle;
    statusElement.textContent = projectStatus || copy.fallbackStatus;
    textElement.textContent = copy.defaultText;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      openModal(trigger.dataset.projectName, trigger.dataset.projectStatus);
    });
  });

  closeControls.forEach(control => control.addEventListener("click", closeModal));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
})();
