(() => {
  const DATA_URL = 'assets/data/produtos.json';
  const DEFAULT_FALLBACK = 'assets/img/produtos/fallback-produto.webp';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const whatsappUrl = (name, config) => {
    const number = config?.whatsappNumero || '5563992569790';
    const template = config?.whatsappMensagem || 'Olá! Vi "{nome}" no site da Blue Pro Fishing e gostaria de mais informações.';
    const message = template.replaceAll('{nome}', name);
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const installImageFallback = (image, fallback) => {
    let applied = false;
    image.addEventListener('error', () => {
      if (applied) return;
      applied = true;
      image.src = fallback || DEFAULT_FALLBACK;
    });
  };

  const updateSharedNavigation = () => {
    document.querySelectorAll('#nav a').forEach((link) => {
      if (link.textContent.trim().toLowerCase() === 'produtos') link.href = 'produtos.html';
    });

    const heading = document.querySelector('#produtos .section-heading');
    if (heading) {
      const description = heading.querySelector('p:last-child');
      if (description && !description.querySelector('a')) {
        description.innerHTML = '<a class="products-page-link" href="produtos.html">Conheça nossos produtos!</a>';
      } else if (description?.querySelector('a')) {
        const link = description.querySelector('a');
        link.href = 'produtos.html';
        link.textContent = 'Conheça nossos produtos!';
        link.classList.add('products-page-link');
      }
    }

    const fishingService = Array.from(document.querySelectorAll('#servicos .service-card')).find((card) =>
      card.querySelector('h3')?.textContent.trim() === 'Artigos de Pesca, Caça e Camping'
    );
    const serviceLink = fishingService?.querySelector('.service-body a');
    if (serviceLink) serviceLink.href = 'produtos.html';
  };

  const createCategoryCard = (category, config, fallback) => {
    const link = document.createElement('a');
    link.className = 'product-card';
    link.href = whatsappUrl(category.nome, config);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${category.nome}: consultar no WhatsApp`);

    const image = document.createElement('img');
    image.src = category.imagem || fallback || DEFAULT_FALLBACK;
    image.alt = category.nome;
    image.loading = 'lazy';
    image.decoding = 'async';
    installImageFallback(image, fallback);

    const title = document.createElement('h3');
    title.textContent = category.nome;
    link.append(image, title);
    return link;
  };

  const initializeInfiniteHomeCarousel = (catalog) => {
    const oldCarousel = document.querySelector('[data-products-carousel]');
    if (!oldCarousel) return;

    const categories = catalog.categorias.filter((category) => category.ativo !== false);
    if (!categories.length) return;

    const carousel = oldCarousel.cloneNode(false);
    carousel.className = oldCarousel.className;
    carousel.dataset.productsCarousel = '';
    carousel.setAttribute('aria-label', 'Categorias de produtos');

    const prev = document.createElement('button');
    prev.className = 'products-control products-control-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Categoria anterior');
    prev.innerHTML = '&#10094;';

    const next = document.createElement('button');
    next.className = 'products-control products-control-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Próxima categoria');
    next.innerHTML = '&#10095;';

    const viewport = document.createElement('div');
    viewport.className = 'products-window products-loop-window';
    const track = document.createElement('div');
    track.className = 'products-track products-loop-track';
    viewport.appendChild(track);
    carousel.append(prev, viewport, next);
    oldCarousel.replaceWith(carousel);

    let offset = 0;
    let loopDistance = 0;
    let cardStep = 0;
    let lastTime = 0;
    let paused = false;
    let pointerStartX = null;
    let rafId = null;
    const speed = 34;

    const normalize = () => {
      if (!loopDistance) return;
      while (offset >= loopDistance) offset -= loopDistance;
      while (offset < 0) offset += loopDistance;
    };

    const applyTransform = () => {
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const visibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

    const rebuild = () => {
      const visible = visibleCount();
      const gap = window.innerWidth < 768 ? 16 : 24;
      const viewportWidth = viewport.clientWidth;
      const cardWidth = Math.max(220, (viewportWidth - gap * (visible - 1)) / visible);
      cardStep = cardWidth + gap;
      loopDistance = cardStep * categories.length;
      normalize();
      track.style.gap = `${gap}px`;
      track.replaceChildren();
      [...categories, ...categories].forEach((category) => {
        const card = createCategoryCard(category, catalog.config, catalog.config?.fallbackImagem);
        card.style.flex = `0 0 ${cardWidth}px`;
        track.appendChild(card);
      });
      applyTransform();
    };

    const frame = (time) => {
      if (!lastTime) lastTime = time;
      const delta = Math.min(64, time - lastTime);
      lastTime = time;
      if (!paused && !document.hidden && !reducedMotion.matches && loopDistance) {
        offset += speed * (delta / 1000);
        normalize();
        applyTransform();
      }
      rafId = requestAnimationFrame(frame);
    };

    const nudge = (direction) => {
      if (!cardStep) return;
      offset += direction * cardStep;
      normalize();
      applyTransform();
    };

    prev.addEventListener('click', () => nudge(-1));
    next.addEventListener('click', () => nudge(1));
    carousel.addEventListener('mouseenter', () => { paused = true; });
    carousel.addEventListener('mouseleave', () => { paused = false; });
    carousel.addEventListener('focusin', () => { paused = true; });
    carousel.addEventListener('focusout', (event) => { if (!carousel.contains(event.relatedTarget)) paused = false; });
    carousel.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      pointerStartX = event.clientX;
      paused = true;
    });
    carousel.addEventListener('pointerup', (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      if (Math.abs(distance) > 45) nudge(distance < 0 ? 1 : -1);
      pointerStartX = null;
      paused = false;
    });
    window.addEventListener('resize', rebuild, { passive: true });
    document.addEventListener('visibilitychange', () => { lastTime = performance.now(); });
    reducedMotion.addEventListener?.('change', () => { lastTime = performance.now(); });

    rebuild();
    rafId = requestAnimationFrame(frame);
    window.addEventListener('pagehide', () => cancelAnimationFrame(rafId), { once: true });
  };

  const initializeCatalogPageChrome = () => {
    if (!document.body.classList.contains('products-page')) return;
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('menu-toggle');
    if (header) header.classList.add('scrolled');
    if (nav && toggle) {
      const close = () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      };
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      });
      nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
      window.addEventListener('resize', () => { if (window.innerWidth >= 768) close(); }, { passive: true });
    }
    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
  };

  const initializeCatalogGrid = (catalog) => {
    const grid = document.querySelector('[data-catalog-grid]');
    const tabs = document.querySelector('[data-catalog-tabs]');
    const status = document.querySelector('[data-catalog-status]');
    if (!grid || !tabs || !status) return;

    const activeProducts = catalog.produtos.filter((item) => item.ativo !== false);
    const categories = catalog.categorias.filter((item) => item.ativo !== false);
    let selected = 'todos';

    const render = () => {
      const items = selected === 'todos'
        ? activeProducts
        : activeProducts.filter((item) => item.categoria === selected);
      grid.replaceChildren();
      status.textContent = items.length
        ? `${items.length} ${items.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`
        : 'Nenhum produto disponível nesta categoria no momento.';

      items.forEach((item) => {
        const link = document.createElement('a');
        link.className = 'catalog-card';
        link.href = whatsappUrl(item.nome, catalog.config);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${item.nome}: consultar no WhatsApp`);

        const media = document.createElement('div');
        media.className = 'catalog-card-image';
        const image = document.createElement('img');
        image.src = item.imagem || catalog.config?.fallbackImagem || DEFAULT_FALLBACK;
        image.alt = item.nome;
        image.loading = 'lazy';
        image.decoding = 'async';
        installImageFallback(image, catalog.config?.fallbackImagem);
        media.appendChild(image);

        const body = document.createElement('div');
        body.className = 'catalog-card-body';
        body.innerHTML = `<h3>${escapeHtml(item.nome)}</h3><p>${escapeHtml(item.descricao || 'Produto disponível para consulta.')}</p><span>Consultar no WhatsApp <span aria-hidden="true">→</span></span>`;
        link.append(media, body);
        grid.appendChild(link);
      });
    };

    const tabData = [{ id: 'todos', nome: 'Todos', count: activeProducts.length }, ...categories.map((category) => ({
      id: category.id,
      nome: category.nome,
      count: activeProducts.filter((item) => item.categoria === category.id).length,
    }))];

    tabData.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `catalog-tab${index === 0 ? ' is-active' : ''}`;
      button.dataset.category = item.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(index === 0));
      button.innerHTML = `${escapeHtml(item.nome)} <span aria-hidden="true">(${item.count})</span>`;
      button.addEventListener('click', () => {
        selected = item.id;
        tabs.querySelectorAll('.catalog-tab').forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', String(active));
        });
        render();
      });
      tabs.appendChild(button);
    });

    const cta = document.querySelector('[data-catalog-whatsapp]');
    if (cta) cta.href = whatsappUrl('produtos', catalog.config);
    render();
  };

  initializeCatalogPageChrome();
  updateSharedNavigation();

  fetch(DATA_URL, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`Catálogo indisponível (${response.status}).`);
      return response.json();
    })
    .then((catalog) => {
      initializeInfiniteHomeCarousel(catalog);
      initializeCatalogGrid(catalog);
    })
    .catch((error) => {
      console.error('[Blue Pro Produtos]', error);
      const status = document.querySelector('[data-catalog-status]');
      if (status) status.textContent = 'Não foi possível carregar o catálogo agora. Fale com nossa equipe pelo WhatsApp.';
    });
})();
