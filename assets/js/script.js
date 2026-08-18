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

const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");
let successTimer;

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  contactForm.hidden = true;
  formSuccess.classList.add("visible");
  clearTimeout(successTimer);
  successTimer = setTimeout(() => {
    formSuccess.classList.remove("visible");
    contactForm.hidden = false;
  }, 3000);
});

document.getElementById("current-year").textContent = new Date().getFullYear();
