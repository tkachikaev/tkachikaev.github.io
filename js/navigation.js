(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const navigationLinks = [...document.querySelectorAll(".main-nav a")];
  const brandLink = document.querySelector(".brand");
  const absoluteTopLinks = [...document.querySelectorAll(".footer-links a[href^='#']")];
  const { text, reduceMotion } = Site;

  function closeMenu() {
    if (!navigation || !menuToggle) return;
    navigation.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", text.openMenu);
  }

  function scrollToAbsoluteTop() {
    closeMenu();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

    if (window.location.hash) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  brandLink?.addEventListener("click", event => {
    const href = brandLink.getAttribute("href") || "";

    if (href === "#top") {
      event.preventDefault();
      scrollToAbsoluteTop();
      return;
    }

    if (href.endsWith("#top")) {
      event.preventDefault();
      window.location.href = href.slice(0, -4);
    }
  });

  absoluteTopLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      scrollToAbsoluteTop();
    });
  });

  menuToggle?.addEventListener("click", () => {
    if (!navigation) return;
    const isOpen = navigation.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? text.closeMenu : text.openMenu);
  });

  navigationLinks.forEach(link => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (!navigation?.classList.contains("open")) return;
    if (navigation.contains(event.target) || menuToggle?.contains(event.target)) return;
    closeMenu();
  });
})();
