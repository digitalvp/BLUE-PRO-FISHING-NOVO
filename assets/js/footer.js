// Ano do rodapé compartilhado por todas as páginas públicas.
const footerYear = document.getElementById("current-year");
if (footerYear) footerYear.textContent = new Date().getFullYear();
