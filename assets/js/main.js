(() => {
  "use strict";

  const body = document.body;
  body.classList.add("reveal-ready");
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const dropdowns = document.querySelectorAll(".has-dropdown");
  const modal = document.querySelector("[data-quote-modal]");
  const productSelect = document.querySelector("[data-product-select]");
  let lastFocus = null;

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;
    menu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    body.classList.toggle("menu-open", open);
    if (!open) dropdowns.forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
    });
  };

  menuToggle?.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  dropdowns.forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle");
    toggle?.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      dropdowns.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });
  });

  const heroSlider = document.querySelector("[data-hero-slider]");
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll("[data-hero-slide]")];
    const dots = [...heroSlider.querySelectorAll("[data-hero-dot]")];
    const pauseButton = heroSlider.querySelector("[data-hero-pause]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let currentSlide = 0;
    let timer = null;
    let manuallyPaused = reduceMotion;
    let temporarilyPaused = false;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentSlide;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentSlide;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });
    };

    const stopTimer = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const startTimer = () => {
      stopTimer();
      if (!manuallyPaused && !temporarilyPaused && !document.hidden) {
        timer = window.setInterval(() => showSlide(currentSlide + 1), 7000);
      }
    };

    const updatePauseButton = () => {
      if (!pauseButton) return;
      pauseButton.setAttribute("aria-pressed", String(manuallyPaused));
      pauseButton.setAttribute("aria-label", manuallyPaused ? "Play slideshow" : "Pause slideshow");
      pauseButton.querySelector("span").textContent = manuallyPaused ? "▶" : "Ⅱ";
    };

    heroSlider.querySelector("[data-hero-prev]")?.addEventListener("click", () => { showSlide(currentSlide - 1); startTimer(); });
    heroSlider.querySelector("[data-hero-next]")?.addEventListener("click", () => { showSlide(currentSlide + 1); startTimer(); });
    dots.forEach((dot) => dot.addEventListener("click", () => { showSlide(Number(dot.dataset.heroDot)); startTimer(); }));
    pauseButton?.addEventListener("click", () => { manuallyPaused = !manuallyPaused; updatePauseButton(); startTimer(); });
    heroSlider.addEventListener("mouseenter", () => { temporarilyPaused = true; stopTimer(); });
    heroSlider.addEventListener("mouseleave", () => { temporarilyPaused = false; startTimer(); });
    heroSlider.addEventListener("focusin", () => { temporarilyPaused = true; stopTimer(); });
    heroSlider.addEventListener("focusout", (event) => {
      if (!heroSlider.contains(event.relatedTarget)) { temporarilyPaused = false; startTimer(); }
    });
    document.addEventListener("visibilitychange", startTimer);
    updatePauseButton();
    showSlide(0);
    startTimer();
  }

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 30);
    document.querySelector("[data-back-top]")?.classList.toggle("is-visible", window.scrollY > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const openModal = (product = "") => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    if (productSelect && product) productSelect.value = product;
    window.setTimeout(() => modal.querySelector("input")?.focus(), 150);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    lastFocus?.focus();
  };

  document.querySelectorAll("[data-quote-open]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.product || ""));
  });
  document.querySelectorAll("[data-quote-close]").forEach((button) => button.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      setMenu(false);
    }
    if (event.key === "Tab" && modal?.classList.contains("is-open")) {
      const focusable = [...modal.querySelectorAll("button, input, select, textarea, a[href]")].filter((el) => !el.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  document.querySelector("[data-back-top]")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.querySelectorAll("[data-year]").forEach((year) => { year.textContent = new Date().getFullYear(); });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const catalogCards = document.querySelectorAll("[data-category]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      catalogCards.forEach((card) => { card.hidden = filter !== "all" && card.dataset.category !== filter; });
    });
  });

  document.querySelectorAll("[data-faq-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const willOpen = !item.classList.contains("is-open");
      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -30px" });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-static-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (form.getAttribute("action") === "#") {
        event.preventDefault();
        const note = form.querySelector("[data-form-note]");
        if (note) note.textContent = "The form is ready for endpoint connection. For immediate help, email sales@patrickstoneventures.com.ng.";
      }
    });
  });
})();
