(() => {
  const grid = document.querySelector("[data-projects-grid]");
  const projects = Site.projects;

  if (!grid || !Array.isArray(projects)) return;

  const locale = Site.isEnglish ? "en" : "ru";
  const fragment = document.createDocumentFragment();

  projects.forEach(project => {
    const copy = project[locale];
    if (!copy) return;

    const card = document.createElement("article");
    card.className = ["project-card", "project-card--interactive", "reveal", project.revealClass]
      .filter(Boolean)
      .join(" ");

    const image = document.createElement("img");
    image.src = project.image;
    image.alt = copy.alt;
    image.loading = "lazy";
    image.decoding = "async";

    const info = document.createElement("div");
    info.className = "project-info";

    const title = document.createElement("h3");
    title.textContent = copy.title;

    const summary = document.createElement("p");
    summary.textContent = copy.summary;

    const status = document.createElement("span");
    status.className = ["status", project.statusClass].filter(Boolean).join(" ");
    status.textContent = copy.status;

    info.append(title, summary, status);

    if (project.type === "link") {
      const link = document.createElement("a");
      link.className = "project-card-overlay-link";
      link.href = copy.href;
      link.setAttribute("aria-label", copy.ariaLabel);
      card.append(link);
    } else {
      const button = document.createElement("button");
      button.className = "project-card-overlay-button";
      button.type = "button";
      button.dataset.projectName = copy.title;
      button.dataset.projectStatus = copy.status;
      button.dataset.projectDescription = copy.modalDescription;
      button.setAttribute("aria-label", copy.ariaLabel);
      card.append(button);
    }

    card.append(image, info);
    fragment.append(card);
  });

  grid.replaceChildren(fragment);
})();
