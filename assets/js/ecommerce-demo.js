(() => {
  'use strict';

  const get = (id) => document.getElementById(id);
  const grid = get('demo-grid');
  if (!grid) return;

  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const localImage = (path) => typeof path === 'string' && /^assets\/[a-z0-9/_ .%-]+\.(webp|png|jpe?g|avif|svg)$/i.test(path) && !path.includes('..') ? `/${path}` : '/assets/img/produtos/fallback-produto.webp';
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const button = (label, className, action) => {
    const element = create('button', className, label);
    element.type = 'button';
    element.addEventListener('click', action);
    return element;
  };
  const columns = () => window.innerWidth < 540 ? 1 : window.innerWidth < 1100 ? 2 : 3;
  const state = { catalog: null, category: 'todos', page: 1, size: columns() * 3, cart: new Map() };
  let toastTimer;
  let loading = false;

  function notify(message) {
    const toast = get('demo-toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
  }

  function resetFilters() {
    state.category = 'todos';
    state.page = 1;
    get('search').value = '';
    get('brand').value = 'todas';
    get('nautica-type').value = 'todos';
    get('price-range').value = 'todos';
    get('category-filters').querySelector('input[value="todos"]').checked = true;
    render();
  }

  function matchingItems() {
    const query = normalize(get('search').value.trim());
    const brand = get('brand').value;
    const subtype = get('nautica-type').value;
    const price = get('price-range').value;
    const items = state.catalog.produtos.filter((item) => {
      const category = state.catalog.categorias.find((entry) => entry.id === item.categoria);
      return item.ativo !== false
        && (state.category === 'todos' || item.categoria === state.category)
        && (brand === 'todas' || (brand === 'pendente' ? !item.marca : item.marca === brand))
        && (subtype === 'todos' || (item.categoria === 'nautica' && item.subcategoria === subtype))
        && (price === 'todos' || (price === 'ate200' ? item.precoDemo <= 200 : item.precoDemo > 200))
        && (!query || normalize(`${item.nome} ${item.marca || ''} ${category?.nome || ''} ${item.subcategoria || ''}`).includes(query));
    });
    const sort = get('sort').value;
    if (sort === 'nome') items.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    if (sort === 'preco-asc') items.sort((a, b) => a.precoDemo - b.precoDemo);
    if (sort === 'preco-desc') items.sort((a, b) => b.precoDemo - a.precoDemo);
    return items;
  }

  function productCard(item) {
    const card = create('article', 'demo-card');
    card.dataset.productId = item.id;
    const media = create('figure', 'demo-card-media');
    const image = create('img');
    image.src = localImage(item.imagem);
    image.alt = `Imagem de referência da demonstração — ${item.nome}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 640;
    image.height = 480;
    image.addEventListener('error', () => {
      image.src = localImage(state.catalog.config.fallbackImagem);
      image.alt = `PENDÊNCIA DE ASSET: foto de ${item.nome}`;
    }, { once: true });
    media.append(image, create('figcaption', '', 'Imagem de referência · DEMO'));
    const body = create('div', 'demo-card-body');
    const brand = create('p', 'demo-card-brand', item.marca || 'Marca: PENDÊNCIA DE DADO');
    const title = create('h3', '', item.nome);
    const price = create('p', 'demo-card-price');
    price.append(create('small', '', 'PREÇO DEMO'), document.createTextNode(currency.format(item.precoDemo)));
    const installments = state.catalog.config.parcelasDemo;
    const payment = create('p', 'demo-card-payment', `${installments}x de ${currency.format(item.precoDemo / installments)} · condição DEMO`);
    const add = button('Adicionar ao carrinho', 'demo-primary', () => {
      const quantity = state.cart.get(item.id) || 0;
      if (quantity >= 99) { notify('Limite de 99 unidades por item nesta demonstração.'); return; }
      state.cart.set(item.id, quantity + 1);
      renderCart();
      notify(`${item.nome} adicionado ao carrinho DEMO. Nenhuma compra realizada.`);
    });
    add.setAttribute('aria-label', `Adicionar ${item.nome}${item.marca ? ` ${item.marca}` : ''} ao carrinho DEMO`);
    body.append(brand, title, price, payment, add);
    card.append(media, body);
    return card;
  }

  function render() {
    if (!state.catalog) return;
    const items = matchingItems();
    const pages = Math.max(1, Math.ceil(items.length / state.size));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * state.size;
    grid.replaceChildren(...items.slice(start, start + state.size).map(productCard));
    const count = items.length;
    get('result-count').textContent = count ? `${count} ${count === 1 ? 'item encontrado' : 'itens encontrados'} · exibindo ${start + 1}–${Math.min(start + state.size, count)}` : 'Nenhum item encontrado';
    get('empty-state').hidden = Boolean(count);
    get('empty-state').textContent = state.category === 'camping'
      ? 'PENDÊNCIA DE ASSET/DADO: ainda não há produtos de camping cadastrados na demonstração. Explore as demais categorias.'
      : 'Nenhum item corresponde à busca e aos filtros selecionados. Limpe os filtros para explorar a demonstração.';
    get('pagination').hidden = pages < 2;
    get('page-count').textContent = `Página ${state.page} de ${pages}`;
    get('previous-page').disabled = state.page === 1;
    get('next-page').disabled = state.page === pages;
  }

  function renderCart() {
    const list = get('cart-items');
    list.replaceChildren();
    let total = 0;
    let count = 0;
    state.cart.forEach((quantity, id) => {
      const item = state.catalog.produtos.find((entry) => entry.id === id);
      if (!item) return;
      total += item.precoDemo * quantity;
      count += quantity;
      const row = create('li', 'demo-cart-item');
      const copy = create('div');
      copy.append(create('strong', '', `${item.nome}${item.marca ? ` · ${item.marca}` : ''}`), create('small', '', `${currency.format(item.precoDemo)} por unidade · DEMO`));
      const controls = create('div', 'demo-quantity');
      const changeQuantity = (change) => {
        const next = quantity + change;
        if (next > 99) return;
        if (next <= 0) state.cart.delete(id); else state.cart.set(id, next);
        renderCart();
        get('cart-update').textContent = next <= 0 ? `${item.nome} removido do carrinho DEMO.` : `${item.nome}: ${next} unidades no carrinho DEMO.`;
        const focusButton = Array.from(list.querySelectorAll('button')).find((entry) => entry.dataset.productId === id && entry.dataset.change === String(change) && !entry.disabled);
        (focusButton || get('close-cart')).focus();
      };
      [-1, 1].forEach((change) => {
        const control = button(change < 0 ? '−' : '+', '', () => changeQuantity(change));
        control.setAttribute('aria-label', `${change < 0 ? 'Diminuir' : 'Aumentar'} quantidade de ${item.nome}${item.marca ? ` ${item.marca}` : ''}`);
        control.dataset.productId = id;
        control.dataset.change = String(change);
        control.disabled = change > 0 && quantity >= 99;
        controls.append(control);
        if (change < 0) controls.append(create('span', '', String(quantity)));
      });
      row.append(copy, controls);
      list.append(row);
    });
    if (!count) list.append(create('li', 'demo-muted', 'Seu carrinho DEMO está vazio. Adicione um item para experimentar.'));
    get('cart-count').textContent = String(count);
    get('open-cart').setAttribute('aria-label', `Abrir carrinho DEMO, ${count} ${count === 1 ? 'item' : 'itens'}`);
    get('cart-total').textContent = currency.format(total);
    get('clear-cart').disabled = count === 0;
  }

  function populateFilters() {
    const activeItems = state.catalog.produtos.filter((item) => item.ativo !== false);
    const categories = [{ id: 'todos', nome: 'Todas as categorias' }, ...state.catalog.categorias];
    get('category-filters').replaceChildren();
    categories.forEach((category) => {
      const label = create('label', 'demo-category');
      const input = create('input');
      input.type = 'radio'; input.name = 'category'; input.value = category.id;
      input.checked = category.id === 'todos';
      input.addEventListener('change', () => {
        state.category = input.value;
        state.page = 1;
        get('nautica-type').value = 'todos';
        render();
      });
      const count = activeItems.filter((item) => category.id === 'todos' || item.categoria === category.id).length;
      label.append(input, document.createTextNode(category.nome), create('span', '', String(count)));
      get('category-filters').append(label);
    });
    const brands = [...new Set(activeItems.map((item) => item.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    get('brand').replaceChildren(new Option('Todas as marcas', 'todas'), ...brands.map((brand) => new Option(brand, brand)), new Option('Marca pendente', 'pendente'));
    get('nautica-type').replaceChildren(new Option('Todos os tipos', 'todos'), ...state.catalog.subcategoriasNautica.map((category) => new Option(category.nome, category.id)));
  }

  async function loadCatalog() {
    if (loading) return;
    loading = true;
    grid.setAttribute('aria-busy', 'true');
    get('retry-load').hidden = true;
    get('empty-state').hidden = true;
    get('result-count').textContent = 'Carregando demonstração…';
    try {
      const response = await fetch('/assets/data/ecommerce-demo.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const catalog = await response.json();
      if (!catalog.config?.demo || !Array.isArray(catalog.produtos) || !Array.isArray(catalog.categorias) || !Array.isArray(catalog.subcategoriasNautica)) throw new Error('Dados da demonstração inválidos.');
      const ids = new Set();
      for (const item of catalog.produtos) {
        if (!item.id || ids.has(item.id) || typeof item.nome !== 'string' || !Number.isFinite(item.precoDemo) || item.precoDemo < 0) throw new Error('Cadastro da demonstração inválido.');
        ids.add(item.id);
      }
      if (!Number.isInteger(catalog.config.parcelasDemo) || catalog.config.parcelasDemo < 1) throw new Error('Condição DEMO inválida.');
      state.catalog = catalog;
      populateFilters();
      render();
      renderCart();
    } catch (error) {
      get('result-count').textContent = 'Demonstração indisponível';
      get('empty-state').textContent = 'Não foi possível carregar os dados da demonstração. Tente novamente.';
      get('empty-state').hidden = false;
      get('retry-load').hidden = false;
      console.warn('[Blue Pro DEMO]', error.message);
    } finally {
      grid.setAttribute('aria-busy', 'false');
      loading = false;
    }
  }

  get('demo-search').addEventListener('submit', (event) => { event.preventDefault(); state.page = 1; render(); });
  get('search').addEventListener('input', () => { state.page = 1; render(); });
  ['brand', 'price-range', 'sort', 'nautica-type'].forEach((id) => get(id).addEventListener('change', () => {
    state.page = 1;
    if (id === 'nautica-type' && get(id).value !== 'todos' && state.catalog) {
      state.category = 'nautica';
      get('category-filters').querySelector('input[value="nautica"]').checked = true;
    }
    render();
  }));
  get('clear-filters').addEventListener('click', () => { if (state.catalog) resetFilters(); });
  get('retry-load').addEventListener('click', loadCatalog);
  [['previous-page', -1], ['next-page', 1]].forEach(([id, step]) => get(id).addEventListener('click', () => {
    state.page += step; render();
    get('catalog-title').focus({ preventScroll: true });
    get('catalog-title').scrollIntoView({ block: 'start' });
  }));
  const dialog = get('demo-cart');
  get('open-cart').addEventListener('click', () => { renderCart(); dialog.showModal(); });
  ['close-cart', 'continue-demo'].forEach((id) => get(id).addEventListener('click', () => dialog.close()));
  get('clear-cart').addEventListener('click', () => {
    state.cart.clear(); renderCart();
    get('cart-update').textContent = 'Carrinho DEMO esvaziado.';
    get('continue-demo').focus();
  });
  const mobileFilters = window.matchMedia('(max-width: 767px)');
  const syncFilters = () => { get('filter-panel').open = !mobileFilters.matches; };
  mobileFilters.addEventListener('change', syncFilters);
  syncFilters();
  window.addEventListener('resize', () => {
    const size = columns() * 3;
    if (state.size !== size) { state.size = size; state.page = 1; render(); }
  }, { passive: true });
  loadCatalog();
})();
