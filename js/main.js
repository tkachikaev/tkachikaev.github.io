(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year in footer.
  document.getElementById('year').textContent = new Date().getFullYear();

  // Scroll progress.
  const progress = document.querySelector('.scroll-progress span');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Mobile navigation.
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
    }));
  }

  // Reveal sections on scroll.
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px' });
    reveals.forEach(el => observer.observe(el));
  }

  // Active navigation link.
  const links = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const shown = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!shown) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${shown.target.id}`));
    }, { threshold: 0.45 });
    sections.forEach(section => navObserver.observe(section));
  }

  // Gallery modal.
  const modal = document.querySelector('.image-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const closeModal = () => modal?.close();
  document.querySelectorAll('.mood-card').forEach(card => {
    card.addEventListener('click', () => {
      modalImage.src = card.dataset.image;
      modalImage.alt = card.querySelector('img').alt;
      modalTitle.textContent = card.dataset.title;
      modal.showModal();
    });
  });
  document.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeModal();
  });

  // Modest magnetic movement on the primary buttons.
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(button => {
      button.addEventListener('mousemove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * .13;
        const y = (event.clientY - rect.top - rect.height / 2) * .13;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener('mouseleave', () => { button.style.transform = ''; });
    });
  }

  // Ambient spark field in the hero.
  const canvas = document.getElementById('spark-canvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  const count = Math.min(86, Math.max(34, Math.floor(window.innerWidth / 17)));

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = box.width;
    height = box.height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.45 + .25,
      speed: Math.random() * .22 + .05,
      drift: (Math.random() - .5) * .14,
      alpha: Math.random() * .43 + .08,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.y -= particle.speed;
      particle.x += particle.drift;
      if (particle.y < -8) { particle.y = height + 8; particle.x = Math.random() * width; }
      if (particle.x < -8) particle.x = width + 8;
      if (particle.x > width + 8) particle.x = -8;
      const pulse = .55 + Math.sin(time * .0014 + particle.phase) * .45;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(199, 255, 138, ${particle.alpha * pulse})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();
