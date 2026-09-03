(() => {
  const normalizePublicLinks = () => {
    document.querySelectorAll('a[href="produtos.html"]').forEach((link) => { link.href = '/produtos'; });

    const vesselService = Array.from(document.querySelectorAll('#servicos .service-card')).find((card) =>
      card.querySelector('h3')?.textContent.trim() === 'Embarcações'
    );
    const vesselServiceLink = vesselService?.querySelector('.service-body a');
    if (vesselServiceLink) vesselServiceLink.href = '/embarcacoes';

    document.querySelectorAll('.footer a').forEach((link) => {
      const text = link.textContent.trim().toLowerCase();
      if (text === 'embarcações' || text === 'peças e motores') link.href = '/embarcacoes';
      if (link.getAttribute('href') === 'produtos.html') link.href = '/produtos';
      if (link.getAttribute('href')?.startsWith('index.html#')) {
        link.href = `/${link.getAttribute('href').slice('index.html'.length)}`;
      }
    });

    document.querySelectorAll('meta[property="og:image"], meta[property="og:image:secure_url"], meta[name="twitter:image"]').forEach((meta) => {
      meta.content = meta.content.replace('https://blue-pro-fishing-novo.vercel.app', '');
    });
  };

  const core = document.createElement('script');
  core.src = '/assets/js/script-core.js';
  core.onload = normalizePublicLinks;
  core.onerror = normalizePublicLinks;
  document.head.appendChild(core);
})();
