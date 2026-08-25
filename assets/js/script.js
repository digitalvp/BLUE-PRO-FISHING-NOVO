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
    return response.text();
  })
  .then((markup) => {
    if (!markup.trim()) throw new Error("Não há imagens disponíveis para o carrossel.");
    aboutCarousel.innerHTML = markup;
    initializeCarousels();
  })
  .catch(() => {
    aboutCarousel.classList.add("about-carousel-fallback");
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
    `Email: ${email}`,
    `Mensagem: ${message}`,
  ].join("\n");

  window.open(
    `https://wa.me/5563992569790?text=${encodeURIComponent(whatsappMessage)}`,
    "_blank",
    "noopener,noreferrer",
  );
});

document.getElementById("current-year").textContent = new Date().getFullYear();
