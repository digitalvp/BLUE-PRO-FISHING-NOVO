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
const portableHeroSlides = [
  {
    desktopSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-01.png",
    mobileSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-01.png",
    alt: "Blue Pro Fishing, referência em pesca em Palmas",
  },
  {
    desktopSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-02.png",
    mobileSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-02.png",
    alt: "Blue Pro Fishing para quem vive a pesca",
  },
  {
    desktopSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-03.png",
    mobileSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-03.png",
    alt: "Aventura, pesca, náutica e camping na Blue Pro Fishing",
  },
  {
    desktopSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-04.png",
    mobileSrc: "assets/images/hero/desktop/LOJA-DE-PESCA-EM-PALMAS-04.png",
    alt: "Equipamentos de pesca para todos os estilos na Blue Pro Fishing",
  },
];

function appendPortableHeroSlides() {
  if (!heroTrack) return;

  const existingSources = new Set(
    Array.from(heroTrack.querySelectorAll("img")).map((image) => image.getAttribute("src")),
  );
  const hasCurrentHeroSet = portableHeroSlides.some((slideData) => existingSources.has(slideData.desktopSrc));

  if (!hasCurrentHeroSet) heroTrack.replaceChildren();

  portableHeroSlides.forEach((slideData) => {
    const alreadyExists = Array.from(heroTrack.querySelectorAll("img")).some(
      (image) => image.getAttribute("src") === slideData.desktopSrc,
    );
    if (alreadyExists) return;

    const isFirstSlide = heroTrack.children.length === 0;
    const figure = document.createElement("figure");
    figure.className = `hero-slide${isFirstSlide ? " is-active" : ""}`;
    figure.setAttribute("aria-hidden", String(!isFirstSlide));

    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.media = "(max-width: 767px)";
    source.srcset = slideData.mobileSrc;

    const image = document.createElement("img");
    image.src = slideData.desktopSrc;
    image.alt = slideData.alt;
    image.loading = isFirstSlide ? "eager" : "lazy";
    image.decoding = "async";
    if (isFirstSlide) image.fetchPriority = "high";

    picture.append(source, image);
    figure.appendChild(picture);
    heroTrack.appendChild(figure);
  });
}

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
  .finally(() => {
    appendPortableHeroSlides();
    initializeHeroCarousel();
  });

const benefitsTrack = document.querySelector("[data-hero-benefits]");
const benefitCards = Array.from(benefitsTrack?.querySelectorAll(".benefit-card") || []);
const benefitPreviousButton = document.querySelector("[data-benefit-prev]");
const benefitNextButton = document.querySelector("[data-benefit-next]");
const benefitMobileQuery = window.matchMedia("(max-width: 767px)");
let activeBenefitIndex = 0;
let benefitTimerId = null;

const stopBenefitsAutoPlay = () => {
  window.clearInterval(benefitTimerId);
  benefitTimerId = null;
};

const showBenefit = (index, restart = false) => {
  if (!benefitsTrack || !benefitCards.length) return;

  const isMobile = benefitMobileQuery.matches;
  activeBenefitIndex = (index + benefitCards.length) % benefitCards.length;
  benefitsTrack.classList.toggle("is-ready", isMobile);

  benefitCards.forEach((card, cardIndex) => {
    const isActive = !isMobile || cardIndex === activeBenefitIndex;
    card.classList.toggle("is-active", isMobile && cardIndex === activeBenefitIndex);
    card.setAttribute("aria-hidden", String(!isActive));
  });

  if (restart) startBenefitsAutoPlay();
};

const startBenefitsAutoPlay = () => {
  stopBenefitsAutoPlay();
  if (!benefitMobileQuery.matches || benefitCards.length < 2 || reducedMotionQuery.matches || document.hidden) return;
  benefitTimerId = window.setInterval(() => showBenefit(activeBenefitIndex + 1), 5000);
};

benefitPreviousButton?.addEventListener("click", () => showBenefit(activeBenefitIndex - 1, true));
benefitNextButton?.addEventListener("click", () => showBenefit(activeBenefitIndex + 1, true));
benefitMobileQuery.addEventListener?.("change", () => {
  showBenefit(activeBenefitIndex);
  startBenefitsAutoPlay();
});
reducedMotionQuery.addEventListener?.("change", startBenefitsAutoPlay);
document.addEventListener("visibilitychange", () => document.hidden ? stopBenefitsAutoPlay() : startBenefitsAutoPlay());
showBenefit(0);
startBenefitsAutoPlay();

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

function renderAboutCarousel(images) {
  const validImages = Array.isArray(images)
    ? images.filter((image) => image && typeof image.src === "string" && image.src.trim())
    : [];

  if (!validImages.length) throw new Error("Manifesto do carrossel Sobre sem imagens válidas.");

  const carousel = document.createElement("div");
  carousel.className = "about-carousel";
  carousel.dataset.carousel = "";
  carousel.setAttribute("aria-label", "Galeria de fotos da Blue Pro Fishing");

  const track = document.createElement("div");
  track.className = "about-carousel-track";

  validImages.forEach((image, index) => {
    const figure = document.createElement("figure");
    figure.className = `about-carousel-slide${index === 0 ? " is-active" : ""}`;
    figure.setAttribute("aria-hidden", String(index !== 0));

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt || `Blue Pro Fishing — foto ${index + 1}`;
    img.loading = index === 0 ? "eager" : "lazy";
    img.decoding = "async";

    figure.appendChild(img);
    track.appendChild(figure);
  });

  carousel.appendChild(track);

  if (validImages.length > 1) {
    const previousButton = document.createElement("button");
    previousButton.className = "about-carousel-control about-carousel-control-prev";
    previousButton.type = "button";
    previousButton.dataset.carouselPrev = "";
    previousButton.setAttribute("aria-label", "Foto anterior");
    previousButton.innerHTML = "&#10094;";

    const nextButton = document.createElement("button");
    nextButton.className = "about-carousel-control about-carousel-control-next";
    nextButton.type = "button";
    nextButton.dataset.carouselNext = "";
    nextButton.setAttribute("aria-label", "Próxima foto");
    nextButton.innerHTML = "&#10095;";

    const dots = document.createElement("div");
    dots.className = "about-carousel-dots";
    dots.setAttribute("role", "tablist");
    dots.setAttribute("aria-label", "Selecionar foto");

    validImages.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `about-carousel-dot${index === 0 ? " is-active" : ""}`;
      dot.type = "button";
      dot.dataset.carouselDot = String(index);
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
      dot.setAttribute("aria-selected", String(index === 0));
      dots.appendChild(dot);
    });

    carousel.append(previousButton, nextButton, dots);
  }

  aboutCarousel.replaceChildren(carousel);
  aboutCarousel.classList.remove("about-carousel-loading", "about-carousel-fallback");
  aboutCarousel.removeAttribute("aria-busy");
  initializeCarousels();
}

fetch("assets/img/sobre/carousel.json", { cache: "no-cache" })
  .then((response) => {
    if (!response.ok) throw new Error("Não foi possível carregar o manifesto do carrossel Sobre.");
    return response.json();
  })
  .then((manifest) => renderAboutCarousel(manifest.images))
  .catch(() => {
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