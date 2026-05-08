document.querySelectorAll("[data-audio-toggle]").forEach((button) => {
  const audioId = button.getAttribute("data-audio-toggle");
  const audio = document.getElementById(audioId);
  const label = button.querySelector("[data-label]");
  const icon = button.querySelector("[data-icon]");

  if (!audio || !label || !icon) return;

  button.addEventListener("click", () => {
    const isPaused = audio.paused;

    // Pause all audios to keep only one active voice at a time.
    document.querySelectorAll("audio").forEach((a) => {
      if (a !== audio) {
        a.pause();
        a.currentTime = 0;
        const btn = document.querySelector(`[data-audio-toggle="${a.id}"]`);
        if (!btn) return;
        btn.classList.remove("playing");
        const btnLabel = btn.querySelector("[data-label]");
        const btnIcon = btn.querySelector("[data-icon]");
        if (btnLabel) btnLabel.textContent = "СЛУШАТЬ ИСТОРИЮ";
        if (btnIcon) btnIcon.textContent = "▶";
      }
    });

    if (isPaused) {
      audio.play();
      button.classList.add("playing");
      label.textContent = "ПАУЗА";
      icon.textContent = "❚❚";
    } else {
      audio.pause();
      button.classList.remove("playing");
      label.textContent = "СЛУШАТЬ ИСТОРИЮ";
      icon.textContent = "▶";
    }
  });

  audio.addEventListener("ended", () => {
    button.classList.remove("playing");
    label.textContent = "СЛУШАТЬ ИСТОРИЮ";
    icon.textContent = "▶";
  });
});

const balloons = document.querySelectorAll(".balloon");

if (balloons.length) {
  const depths = [0.1, -0.08, 0.16, -0.13, 0.07, -0.05, 0.12, 0.09, -0.11, 0.06, -0.07, 0.14];

  const moveBalloons = () => {
    const scrollY = window.scrollY;

    balloons.forEach((balloon, index) => {
      const depth = depths[index] || 0.1;
      const sideDrift = Math.sin(scrollY / 180 + index) * 18;

      balloon.style.setProperty("--scroll-y", `${scrollY * depth}px`);
      balloon.style.setProperty("--scroll-x", `${sideDrift}px`);
    });
  };

  moveBalloons();
  window.addEventListener("scroll", moveBalloons, { passive: true });
}

/* Анимация только целых секций: карточки историй и др. не отдельно — иначе на
   мобильных Safari IntersectionObserver часто не даёт им .is-visible, и блок
   остаётся с opacity: 0 при сохранении высоты макета. */
const revealTargets = document.querySelectorAll("main section, footer");

if (revealTargets.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    revealTargets.forEach((element) => element.classList.add("reveal-on-scroll"));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }
}

const siteHeader = document.querySelector(".site-header");
const burgerButton = document.querySelector(".burger-btn");
const headerMenu = document.querySelector(".header-menu");

if (siteHeader && burgerButton && headerMenu) {
  const closeMenu = () => {
    siteHeader.classList.remove("is-open");
    burgerButton.setAttribute("aria-expanded", "false");
  };

  burgerButton.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-open");
    burgerButton.setAttribute("aria-expanded", String(isOpen));
  });

  headerMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (siteHeader.contains(target)) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeMenu();
  });
}
