
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmt = n => n.toLocaleString('ru-RU') + ' ₽';

const getCategory       = slug => CATEGORIES.find(c => c.slug === slug);
const getChildren       = slug => CATEGORIES.filter(c => c.parent === slug);
const getTopLevelCats   = ()   => CATEGORIES.filter(c => c.parent === null);
const getProduct        = slug => PRODUCTS.find(p => p.slug === slug);

function getCategoryProducts(slug) {
  const cat = getCategory(slug);
  if (!cat) return [];
  const allowed = new Set([slug, ...getChildren(slug).map(c => c.slug)]);
  return PRODUCTS.filter(p => allowed.has(p.category));
}

function getBrands(products) {
  return ['Все производители', ...new Set(products.map(p => p.brand))];
}

const POWER_RANGES = ['Любая мощность','до 10 кВт','10–18 кВт','18–25 кВт','25–40 кВт','более 40 кВт'];
function matchesPower(product, range) {
  if (!range || range === 'Любая мощность') return true;
  const p = product.power;
  if (p == null) return false;
  if (range === 'до 10 кВт')   return p < 10;
  if (range === '10–18 кВт')  return p >= 10 && p <= 18;
  if (range === '18–25 кВт')  return p >= 18 && p <= 25;
  if (range === '25–40 кВт')  return p >= 25 && p <= 40;
  if (range === 'более 40 кВт') return p > 40;
  return true;
}


function productCardHTML(p) {
  const specs = Object.entries(p.shortSpecs || {})
    .map(([k,v]) => `<div><span class="lbl">${k}</span><span class="val">${v}</span></div>`).join('');
  const suffix = p.priceSuffix ? `<span style="font-size:14px;font-weight:500;color:var(--muted);margin-left:4px">${p.priceSuffix}</span>` : '';
  const alt = p.altPrice ? `<div class="product-alt">${p.altPrice}</div>` : '';
  const photo = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.remove()">`
    : '';
  return `
    <a href="product.html?slug=${p.slug}" class="product-card">
      <div class="product-photo" data-placeholder="Фото: ${p.name}">${photo}</div>
      <div class="product-brand">
        <span class="brand">${p.brand}</span>
        <span class="cat">${getCategory(p.category)?.name || ''}</span>
      </div>
      <h4>${p.name}</h4>
      <div class="product-specs">${specs}</div>
      <div class="product-price">${fmt(p.price)}${suffix}</div>
      ${alt}
      <span class="product-cta">Запросить цену →</span>
    </a>`;
}


function categoryCardHTML(cat) {
  const count = getCategoryProducts(cat.slug).length;
  const brands = (cat.brands || []).map(b => `<span>${b}</span>`).join('');
  return `
    <a href="category.html?cat=${cat.slug}" class="cat-card">
      <div>
        <div class="cat-photo" data-placeholder="Фото: ${cat.name} · 800×500"></div>
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
        <div class="cat-brands">${brands}</div>
      </div>
      <div class="cat-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </div>
    </a>`;
}

/* ====================================================================
   index.html
   ==================================================================== */
function initCatalogPage() {
  
  $('#catGrid').innerHTML = getTopLevelCats().map(categoryCardHTML).join('');

  
  const allBrands = getBrands(PRODUCTS);
  const brandSel = $('#brandSelect');
  brandSel.innerHTML = allBrands.map(b => `<option>${b}</option>`).join('');

  const powerSel = $('#powerSelect');
  powerSel.innerHTML = POWER_RANGES.map(p => `<option>${p}</option>`).join('');

  const search = $('#searchInput');
  const reset  = $('#resetBtn');
  const grid   = $('#productGrid');

  function render() {
    const q    = (search.value || '').toLowerCase().trim();
    const br   = brandSel.value;
    const pow  = powerSel.value;

    const filtered = PRODUCTS.filter(p => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (br !== 'Все производители' && p.brand !== br) return false;
      if (!matchesPower(p, pow)) return false;
      return true;
    });

    grid.innerHTML = filtered.map(productCardHTML).join('');
    $('#resultsCount').textContent = filtered.length;
    $('#noResults').style.display = filtered.length ? 'none' : 'block';
  }

  [search, brandSel, powerSel].forEach(el =>
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', render));
  reset?.addEventListener('click', () => {
    search.value = ''; brandSel.value = allBrands[0]; powerSel.value = POWER_RANGES[0];
    render();
  });
  render();
}

/* ====================================================================
   CATEGORY.HTML   ?cat=<slug>
   ==================================================================== */
function initCategoryPage() {
  const params  = new URLSearchParams(location.search);
  const catSlug = params.get('cat') || 'kotly';
  const cat     = getCategory(catSlug);
  if (!cat) { document.body.innerHTML = '<p style="padding:60px;text-align:center">Категория не найдена. <a href="index.html">Вернуться в каталог</a></p>'; return; }

  document.title = cat.name + ' — ТЕРРАТЕРМ';
  $('#catTitle').innerHTML = cat.name.replace(/(отопления|котлы|оборудование|пол|конвекторы|КИП|баки)/i,
    '<span class="accent">$1</span>');
  $('#catLead').textContent = cat.description;
  $('#breadcrumbCurrent').textContent = cat.name;

  const products = getCategoryProducts(catSlug);
  const children = getChildren(catSlug);

  
  if (children.length) {
    const qf = $('#quickFilters');
    qf.style.display = 'grid';
    qf.innerHTML = `
      <button class="quick-filter-btn active" data-cat="${catSlug}">
        <h3>${cat.shortName || cat.name}</h3><p>Все модели</p>
      </button>
      ${children.map(ch => `
        <button class="quick-filter-btn" data-cat="${ch.slug}">
          <h3>${ch.shortName}</h3><p>${ch.name}</p>
        </button>`).join('')}`;
    qf.addEventListener('click', e => {
      const btn = e.target.closest('.quick-filter-btn'); if (!btn) return;
      location.href = `category.html?cat=${btn.dataset.cat}`;
    });
  }

  
  const typeSel = $('#categorySelect');
  if (children.length) {
    typeSel.innerHTML = `
      <option value="${catSlug}">Все (${cat.shortName})</option>
      ${children.map(ch => `<option value="${ch.slug}">${ch.name}</option>`).join('')}`;
    typeSel.closest('.filter-group').style.display = '';
  } else {
    typeSel.closest('.filter-group').style.display = 'none';
  }

  
  const brandSel = $('#brandSelect');
  brandSel.innerHTML = getBrands(products).map(b => `<option>${b}</option>`).join('');
  const powerSel = $('#powerSelect');
  powerSel.innerHTML = POWER_RANGES.map(p => `<option>${p}</option>`).join('');

  const search = $('#searchInput');
  const grid   = $('#productGrid');

  function render() {
    const q   = (search.value || '').toLowerCase().trim();
    const sub = typeSel.closest('.filter-group').style.display === 'none' ? catSlug : typeSel.value;
    const br  = brandSel.value;
    const pw  = powerSel.value;

    const filtered = getCategoryProducts(sub).filter(p => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (br !== 'Все производители' && p.brand !== br) return false;
      if (!matchesPower(p, pw)) return false;
      return true;
    });

    grid.innerHTML = filtered.map(productCardHTML).join('');
    $('#resultsCount').textContent = filtered.length;
    $('#noResults').style.display = filtered.length ? 'none' : 'block';
  }

  typeSel.addEventListener('change', () => {
    
    const list = getCategoryProducts(typeSel.value);
    const all  = getBrands(list);
    brandSel.innerHTML = all.map(b => `<option>${b}</option>`).join('');
    render();
  });
  [search, brandSel, powerSel].forEach(el =>
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', render));
  $('#resetBtn')?.addEventListener('click', () => {
    if (children.length) typeSel.value = catSlug;
    brandSel.selectedIndex = 0; powerSel.selectedIndex = 0; search.value = '';
    render();
  });

  render();
}

/* ====================================================================
   PRODUCT.HTML   ?slug=<slug>
   ==================================================================== */
function initProductPage() {
  const slug = new URLSearchParams(location.search).get('slug');
  const p = getProduct(slug);
  if (!p) { document.body.innerHTML = '<p style="padding:60px;text-align:center">Товар не найден. <a href="index.html">Вернуться в каталог</a></p>'; return; }

  document.title = p.name + ' — ТЕРРАТЕРМ';
  $('#breadcrumbCurrent').textContent = p.name;
  $('#prodCountry').textContent = p.country || '';
  $('#prodTitle').textContent   = p.name;
  $('#prodSku').textContent     = 'Артикул: ' + (p.sku || '—');

  
  const images = (p.images && p.images.length) ? p.images : [p.image].filter(Boolean);
  const mainImg = $('#mainImage');
  const thumbs  = $('#galleryThumbs');
  if (images.length) {
    mainImg.src = images[0];
    mainImg.alt = p.name;
    if (images.length > 1) {
      thumbs.innerHTML = images.map((src, i) => `
        <button class="thumb${i===0?' active':''}" data-src="${src}">
          <img src="${src}" alt="${p.name} — фото ${i+1}" loading="lazy">
        </button>`).join('');
      thumbs.addEventListener('click', e => {
        const b = e.target.closest('.thumb'); if (!b) return;
        mainImg.src = b.dataset.src;
        $$('.thumb').forEach(t => t.classList.remove('active'));
        b.classList.add('active');
      });
    } else {
      thumbs.style.display = 'none';
    }
  } else {
    mainImg.remove();
    $('#galleryMain').insertAdjacentHTML('beforeend',
      `<span style="color:var(--muted);font-size:12px;text-align:center;padding:0 16px">Фото товара скоро появится</span>`);
  }

  
  $('#tabDesc').innerHTML  = p.description || '<p>Описание уточняется.</p>';
  $('#tabSpecs').innerHTML = `<table class="specs-table"><tbody>${Object.entries(p.specs || {})
    .map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</tbody></table>`;
  const docs = (p.documents || []);
  $('#tabDocs').innerHTML = docs.length
    ? `<div class="docs-list">${docs.map(d => `
        <a href="#" class="doc-item">
          <div class="doc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="doc-info"><h4>${d.name}</h4><span>PDF, ${d.size}</span></div>
          <div class="doc-download">Скачать →</div>
        </a>`).join('')}</div>`
    : `<p style="color:var(--muted);font-size:14px">Документация для этой модели — по запросу.</p>`;

  
  $('#prodPrice').textContent = fmt(p.price) + (p.priceSuffix || '');

  
  const prodOrderBtn = document.getElementById('prodOrderBtn');
  if (prodOrderBtn) {
    prodOrderBtn.dataset.prefill = 'Интересует товар: ' + p.name + (p.sku ? ' (арт. ' + p.sku + ')' : '') + (p.price ? ' — ' + fmt(p.price) + ' ₽' : '');
  }

  
    
  const ctaBtn = $('#ctaRequest');
  if (ctaBtn) {
    ctaBtn.removeAttribute('href');
    ctaBtn.setAttribute('data-open-callback', '');
    ctaBtn.dataset.prefill = `Запрос цены и наличия: ${p.name} (арт. ${p.sku || '—'})`;
  }

}


window.openTab = (ev, id) => {
  $$('.tab-btn').forEach(b => b.classList.remove('active'));
  $$('.tab-content').forEach(c => c.classList.remove('active'));
  ev.currentTarget.classList.add('active');
  $('#' + id).classList.add('active');
};