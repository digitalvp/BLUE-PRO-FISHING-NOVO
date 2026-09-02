const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menu-toggle");

function syncHeader() {
  header.classList.toggle("scrolled", window.scrollY > 50);
}

function closeMenu() {
  nav.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) closeMenu();
});
syncHeader();

const heroCarousel = document.querySelector("[data-hero-carousel]");
const heroTrack = document.getElementById("hero-track");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function initializeHeroCarousel() {
  if (!heroCarousel || heroCarousel.dataset.ready === "true") return;

  const slides = Array.from(heroCarousel.querySelectorAll(".hero-slide"));
  const dotsContainer = heroCarousel.querySelector("[data-hero-dots]");
  const previousButton = heroCarousel.querySelector("[data-hero-prev]");
  const nextButton = heroCarousel.querySelector("[data-hero-next]");
  let activeIndex = 0;
  let timerId = null;
  let touchStartX = 0;

  if (!slides.length) return;

  heroCarousel.dataset.ready = "true";
  heroCarousel.classList.toggle("has-single-slide", slides.length === 1);
  dotsContainer.replaceChildren();

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = `hero-dot${index === 0 ? " is-active" : ""}`;
    dot.type = "button";
    dot.dataset.heroDot = String(index);
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Ver banner ${index + 1}`);
    dot.setAttribute("aria-selected", String(index === 0));
    dotsContainer.appendChild(dot);
    return dot;
  });

  const stopAutoPlay = () => {
    window.clearInterval(timerId);
    timerId = null;
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (slides.length < 2 || reducedMotionQuery.matches || document.hidden) return;
    timerId = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  };

  const showSlide = (index, restart = false) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
    if (restart) startAutoPlay();
  };

  previousButton.addEventListener("click", () => showSlide(activeIndex - 1, true));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1, true));
  dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index, true)));
  heroCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1, true);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1, true);
  });
  heroCarousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    stopAutoPlay();
  }, { passive: true });
  heroCarousel.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1));
    startAutoPlay();
  }, { passive: true });
  heroCarousel.addEventListener("mouseenter", stopAutoPlay);
  heroCarousel.addEventListener("mouseleave", startAutoPlay);
  heroCarousel.addEventListener("focusin", stopAutoPlay);
  heroCarousel.addEventListener("focusout", (event) => {
    if (!heroCarousel.contains(event.relatedTarget)) startAutoPlay();
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stopAutoPlay() : startAutoPlay());
  reducedMotionQuery.addEventListener?.("change", startAutoPlay);
  showSlide(0);
  startAutoPlay();
}

fetch("assets/php/hero-carousel.php")
  .then((response) => {
    if (!response.ok || response.status === 204) throw new Error("Hero dinâmico indisponível.");
    if (response.headers.get("content-type")?.includes("application/x-httpd-php")) {
      throw new Error("O servidor local não executa o PHP do hero.");
    }
    return response.text();
  })
  .then((markup) => {
    if (!markup.trim() || markup.includes("<?php")) throw new Error("Resposta PHP inválida.");
    heroTrack.innerHTML = markup;
  })
  .catch(() => {})
  .finally(initializeHeroCarousel);

const benefitsTrack = document.querySelector("[data-hero-benefits]");
const scrollBenefits = (direction) => {
  const firstCard = benefitsTrack?.querySelector(".benefit-card");
  if (!firstCard) return;
  benefitsTrack.scrollBy({ left: direction * (firstCard.offsetWidth + 12), behavior: reducedMotionQuery.matches ? "auto" : "smooth" });
};
document.querySelector("[data-benefit-prev]")?.addEventListener("click", () => scrollBenefits(-1));
document.querySelector("[data-benefit-next]")?.addEventListener("click", () => scrollBenefits(1));

const revealElements = document.querySelectorAll(".reveal");
revealElements.forEach((element) => {
  element.style.transitionDelay = `${element.dataset.delay || 0}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "-50px 0px" });
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      element.classList.add("is-visible");
    } else {
      revealObserver.observe(element);
    }
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const brandsTrack = document.getElementById("brands-track");
Array.from(brandsTrack.children).forEach((brand) => {
  const duplicate = brand.cloneNode(true);
  duplicate.setAttribute("aria-hidden", "true");
  brandsTrack.appendChild(duplicate);
});

function initializeCarousels() {
  document.querySelectorAll("[data-carousel]:not([data-carousel-ready])").forEach((carousel) => {
  carousel.dataset.carouselReady = "true";
  const slides = Array.from(carousel.querySelectorAll(".about-carousel-slide"));
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  let activeIndex = 0;
  let timerId;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const startAutoPlay = () => {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  };

  previousButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startAutoPlay();
  });
  nextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startAutoPlay();
  });
  dots.forEach((dot, index) => dot.addEventListener("click", () => {
    showSlide(index);
    startAutoPlay();
  }));
  carousel.addEventListener("mouseenter", () => window.clearInterval(timerId));
  carousel.addEventListener("mouseleave", startAutoPlay);
  carousel.addEventListener("focusin", () => window.clearInterval(timerId));
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoPlay();
  });
  startAutoPlay();
  });
}

const aboutCarousel = document.getElementById("about-carousel");
fetch("assets/php/about-carousel.php")
  .then((response) => {
    if (!response.ok) throw new Error("Não foi possível carregar o carrossel.");
    if (response.headers.get("content-type")?.includes("application/x-httpd-php")) {
      throw new Error("O servidor local não executa o PHP do carrossel.");
    }
    return response.text();
  })
  .then((markup) => {
    if (!markup.trim() || markup.includes("<?php")) {
      throw new Error("O servidor local não executa o PHP do carrossel.");
    }
    aboutCarousel.innerHTML = markup;
    aboutCarousel.removeAttribute("aria-busy");
    initializeCarousels();
  })
  .catch(() => {
    aboutCarousel.innerHTML =
      '<img src="assets/img/sobre/sobre-blue-pro-fishing.webp" alt="Blue Pro Fishing" loading="lazy" decoding="async">';
    aboutCarousel.classList.remove("about-carousel-loading");
    aboutCarousel.classList.add("about-carousel-fallback");
    aboutCarousel.removeAttribute("aria-busy");
  });

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();
  const whatsappMessage = [
    "Olá! Entrei em contato pelo site da Blue Pro Fishing.",
    `Nome: ${name}`,
    ...(email ? [`Email: ${email}`] : []),
    `Mensagem: ${message}`,
  ].join("\n");

  window.open(
    `https://wa.me/5563992569790?text=${encodeURIComponent(whatsappMessage)}`,
    "_blank",
    "noopener,noreferrer",
  );
});

document.getElementById("current-year").textContent = new Date().getFullYear();
