(() => {
  const grid = document.querySelector('[data-vessel-grid]');
  if (!grid) return;
  const tabs = document.querySelector('[data-vessel-tabs]');
  const brandFilter = document.querySelector('[data-brand-filter]');
  const mobileBrandFilter = document.querySelector('[data-brand-filter-mobile]');
  const status = document.querySelector('[data-vessel-status]');
  const drawer = document.querySelector('[data-brand-drawer]');
  const drawerBackdrop = document.querySelector('[data-brand-backdrop]');
  const openDrawerButton = document.querySelector('[data-open-brand-drawer]');
  const closeDrawerButton = document.querySelector('[data-close-brand-drawer]');
  const fallback = '../assets/img/servicos/servico-embarcacoes.webp';
  let catalog = null;
  let selectedCategory = 'todos';
  let selectedBrand = 'todas';

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const whatsapp = (name, config) => {
    const number = config?.whatsappNumero || '5563992569790';
    const template = config?.whatsappMensagem || 'Olá! Vi "{nome}" no site da Blue Pro Fishing e gostaria de mais informações.';
    return `https://wa.me/${number}?text=${encodeURIComponent(template.replaceAll('{nome}', name))}`;
  };

  const activeItems = () => catalog.itens.filter((item) => item.ativo !== false);
  const filteredItems = () => activeItems().filter((item) =>
    (selectedCategory === 'todos' || item.categoria === selectedCategory) &&
    (selectedBrand === 'todas' || item.marca === selectedBrand)
  );

  const updateFilterLabels = () => {
    const activeBrand = selectedBrand === 'todas' ? 'Todas as marcas' : catalog.marcas.find((b) => b.id === selectedBrand)?.nome || 'Marca';
    openDrawerButton?.querySelector('[data-current-brand]')?.replaceChildren(document.createTextNode(activeBrand));
  };

  const syncControls = () => {
    tabs?.querySelectorAll('[data-category]').forEach((button) => {
      const active = button.dataset.category === selectedCategory;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-brand]').forEach((button) => {
      const active = button.dataset.brand === selectedBrand;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateFilterLabels();
  };

  const clearFilters = () => {
    selectedCategory = 'todos';
    selectedBrand = 'todas';
    syncControls();
    if (catalog) render();
  };

  const installImageFallback = (img) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.src = catalog?.config?.fallbackImagem || fallback;
    });
  };

  const render = () => {
    if (!catalog) return;
    const items = filteredItems();
    grid.replaceChildren();
    if (!items.length) {
      status.innerHTML = 'Nenhum item encontrado com estes filtros. <button type="button" class="vessels-clear-inline" data-clear-filters>Limpar filtros</button>';
      status.querySelector('[data-clear-filters]')?.addEventListener('click', clearFilters);
      return;
    }
    status.textContent = `${items.length} ${items.length === 1 ? 'item encontrado' : 'itens encontrados'}`;
    items.forEach((item) => {
      const brand = catalog.marcas.find((entry) => entry.id === item.marca);
      const link = document.createElement('a');
      link.className = 'vessel-card';
      link.href = whatsapp(item.nome, catalog.config);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${item.nome}: consultar no WhatsApp`);
      link.innerHTML = `<div class="vessel-card-image"><img loading="lazy" decoding="async" src="${escapeHtml(item.imagem)}" alt="${escapeHtml(item.nome)}"></div><div class="vessel-card-body"><span class="vessel-brand">${escapeHtml(brand?.nome || item.marca)}</span><h3>${escapeHtml(item.nome)}</h3><p>${escapeHtml(item.descricao || 'Item disponível para consulta.')}</p><span class="vessel-cta">Consultar no WhatsApp <span aria-hidden="true">→</span></span></div>`;
      installImageFallback(link.querySelector('img'));
      grid.appendChild(link);
    });
  };

  const buildCategories = () => {
    const categories = [{ id: 'todos', nome: 'Todos' }, ...catalog.categorias.filter((c) => c.ativo !== false)];
    categories.forEach((category) => {
      const count = activeItems().filter((item) => category.id === 'todos' || item.categoria === category.id).length;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'catalog-tab'; button.dataset.category = category.id;
      button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', 'false');
      button.innerHTML = `${escapeHtml(category.nome)} <span>(${count})</span>`;
      button.addEventListener('click', () => { selectedCategory = category.id; syncControls(); render(); });
      tabs.appendChild(button);
    });
  };

  const visibleBrands = () => catalog.marcas.filter((brand) => {
    if (brand.ativo === false) return false;
    if (catalog.config?.mostrarMarcasSemItens) return true;
    return activeItems().some((item) => item.marca === brand.id);
  });

  const brandButton = (brand, container) => {
    const count = activeItems().filter((item) => brand.id === 'todas' || item.marca === brand.id).length;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'brand-filter-button'; button.dataset.brand = brand.id;
    button.setAttribute('aria-pressed', 'false');
    const visual = brand.logo ? `<img src="${escapeHtml(brand.logo)}" alt="" loading="lazy">` : `<span class="brand-initials" aria-hidden="true">${escapeHtml(brand.nome.slice(0, 3).toUpperCase())}</span>`;
    button.innerHTML = `${visual}<span class="brand-filter-copy"><strong>${escapeHtml(brand.nome)}</strong><small>${count} ${count === 1 ? 'item' : 'itens'}</small></span>`;
    button.addEventListener('click', () => { selectedBrand = brand.id; syncControls(); render(); closeDrawer(); });
    container.appendChild(button);
  };

  const buildBrands = () => {
    const options = [{ id: 'todas', nome: 'Todas as marcas', logo: '' }, ...visibleBrands()];
    options.forEach((brand) => { brandButton(brand, brandFilter); brandButton(brand, mobileBrandFilter); });
  };

  const openDrawer = () => {
    if (!drawer) return;
    drawer.hidden = false; drawerBackdrop.hidden = false; document.body.classList.add('brand-drawer-open');
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    closeDrawerButton?.focus();
  };
  const closeDrawer = () => {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open'); drawerBackdrop.hidden = true; document.body.classList.remove('brand-drawer-open');
    window.setTimeout(() => { drawer.hidden = true; }, 180);
  };
  openDrawerButton?.addEventListener('click', openDrawer);
  closeDrawerButton?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); });
  document.querySelectorAll('[data-clear-filters]').forEach((button) => button.addEventListener('click', clearFilters));

  fetch('../assets/data/embarcacoes.json', { cache: 'no-cache' })
    .then((response) => { if (!response.ok) throw new Error(`Catálogo indisponível (${response.status}).`); return response.json(); })
    .then((data) => {
      catalog = data; buildCategories(); buildBrands(); syncControls(); render();
      const cta = document.querySelector('[data-vessel-whatsapp]'); if (cta) cta.href = whatsapp('embarcações', catalog.config);
    })
    .catch((error) => {
      console.error('[Blue Pro Embarcações]', error);
      status.textContent = 'Não foi possível carregar o catálogo agora. Fale com nossa equipe pelo WhatsApp.';
    });
})();
