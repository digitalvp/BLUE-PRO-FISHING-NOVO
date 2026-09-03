(function () {
  const grid = document.querySelector('[data-catalog-grid]');
  if (!grid) return;
  const tabs = document.querySelector('[data-catalog-tabs]');
  const status = document.querySelector('[data-catalog-status]');
  const fallback = 'assets/img/produtos/fallback-produto.webp';
  let data;
  const whatsapp = (name, config) => `https://wa.me/${config.whatsappNumero}?text=${encodeURIComponent(config.whatsappMensagem.replace('{nome}', name))}`;
  const render = (category) => {
    const items = data.produtos.filter((item) => item.ativo !== false && (category === 'todos' || item.categoria === category));
    grid.replaceChildren();
    if (!items.length) { status.textContent = 'Nenhum produto disponível nesta categoria no momento.'; return; }
    status.textContent = `${items.length} ${items.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
    items.forEach((item) => {
      const link = document.createElement('a'); link.className = 'catalog-card'; link.href = whatsapp(item.nome, data.config); link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.innerHTML = `<div class="catalog-card-image"><img loading="lazy" decoding="async" alt="${item.nome}" src="${item.imagem || data.config.fallbackImagem || fallback}"></div><div class="catalog-card-body"><h3>${item.nome}</h3><p>${item.descricao || 'Produto disponível para consulta.'}</p><span>Consultar no WhatsApp <span aria-hidden="true">→</span></span></div>`;
      const image = link.querySelector('img'); image.addEventListener('error', () => { if (image.src.endsWith(fallback)) return; image.src = data.config.fallbackImagem || fallback; }, { once: true });
      grid.appendChild(link);
    });
  };
  fetch('assets/data/produtos.json').then((response) => { if (!response.ok) throw new Error('Catálogo indisponível.'); return response.json(); }).then((catalog) => {
    data = catalog; const categories = [{ id: 'todos', nome: 'Todos' }, ...catalog.categorias.filter((category) => category.ativo !== false)];
    categories.forEach((category, index) => { const button = document.createElement('button'); button.type = 'button'; button.className = `catalog-tab${index === 0 ? ' is-active' : ''}`; button.textContent = category.nome; button.dataset.category = category.id; button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', String(index === 0)); button.addEventListener('click', () => { tabs.querySelectorAll('.catalog-tab').forEach((tab) => { const active = tab === button; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); }); render(category.id); }); tabs.appendChild(button); });
    const cta = document.querySelector('[data-catalog-whatsapp]'); if (cta) cta.href = whatsapp('produtos', catalog.config);
    render('todos');
  }).catch((error) => { console.error(error); status.textContent = 'Não foi possível carregar o catálogo agora. Fale com nossa equipe pelo WhatsApp.'; });
})();
