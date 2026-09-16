// Ano do rodapé compartilhado por todas as páginas públicas.
const footerYear = document.getElementById("current-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();

// Ativa o CTA de avaliação da Link Bio usando o link direto oficial do Google Maps.
const googleReviewButton = document.querySelector("button.bio-link-unavailable");
if (googleReviewButton && googleReviewButton.textContent.includes("Avalie a Blue no Google")) {
  const googleReviewLink = document.createElement("a");
  googleReviewLink.className = "bio-link";
  googleReviewLink.href = "https://www.google.com/maps/place//data=!4m3!3m2!1s0x9324cb1b0cf47fed:0xb0015e11825b71a3!12e1";
  googleReviewLink.target = "_blank";
  googleReviewLink.rel = "noopener noreferrer";
  googleReviewLink.innerHTML = googleReviewButton.innerHTML;

  const unavailableText = googleReviewLink.querySelector("small");
  if (unavailableText) unavailableText.remove();

  const label = googleReviewLink.querySelector("span");
  if (label) label.textContent = "Avalie a Blue no Google";

  googleReviewButton.replaceWith(googleReviewLink);
}
