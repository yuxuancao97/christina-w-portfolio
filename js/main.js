(function () {
  'use strict';

  const D = window.PORTFOLIO, Art = window.Art;
  const root = document.documentElement;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = Art.esc;
  const pad2 = n => String(n).padStart(2, '0');
  const groups = {}; // viewer item lists, keyed by group name

  /* ── Profile ─────────────────────────────────────────────── */
  const P = D.profile;
  document.title = `${P.name} — ${P.role}`;
  $$('[data-t]').forEach(el => { if (P[el.dataset.t] != null) el.textContent = P[el.dataset.t]; });
  $$('[data-mail]').forEach(a => { a.href = 'mailto:' + P.email; });
  $$('[data-count]').forEach(el => { el.textContent = (D[el.dataset.count] || []).length; });
  $('#yr').textContent = new Date().getFullYear();
  $('#socials').innerHTML = P.socials.map(s => `<li><a href="${esc(s.url)}">${esc(s.label)}</a></li>`).join('');
  $('#client-list').innerHTML = P.clients.map(c => `<li>${esc(c)}</li>`).join('');

  const img = (src, alt) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;

  /* ── Posters ─────────────────────────────────────────────── */
  const posterSpec = p => ({ title: p.title, client: p.client, year: p.year, style: (p.art || [])[0], palette: (p.art || [])[1], seed: p.title });
  const posterMedia = p => p.image ? img(p.image, `${p.title}, poster for ${p.client}`) : Art.poster(posterSpec(p), 500, 700);

  groups.posters = D.posters.map(p => ({
    ratio: 5 / 7, isImg: !!p.image, html: () => posterMedia(p),
    kicker: 'Poster', title: p.title, note: p.note,
    meta: [['Client', p.client], ['Year', p.year], ['Format', p.format]]
  }));

  const initial = D.postersInitial || D.posters.length;
  $('#count-posters').textContent = `${D.posters.length} pieces`;
  $('#poster-grid').innerHTML = D.posters.map((p, i) =>
    `<button class="tile reveal" type="button" data-group="posters" data-i="${i}" style="transition-delay:${(i % 4) * 70}ms"${i >= initial ? ' hidden' : ''}>` +
      `<span class="tile-art">${posterMedia(p)}</span>` +
      `<span class="tile-cap"><span class="t">${esc(p.title)}<span class="c">${esc(p.client)}</span></span><span class="m">${esc(p.year)}</span></span>` +
    `</button>`).join('');

  const more = $('#poster-more');
  if (D.posters.length > initial) {
    more.hidden = false;
    more.textContent = `Show all ${D.posters.length} posters`;
    more.addEventListener('click', () => {
      $$('#poster-grid .tile[hidden]').forEach(t => { t.hidden = false; });
      more.hidden = true;
    });
  }

  /* Hero strip: a drifting row of posters (two copies for a seamless loop) */
  const strip = D.posters.slice(0, 10).map(p => `<div class="m-item">${posterMedia(p)}</div>`).join('');
  $('#marquee').innerHTML = strip + D.posters.slice(0, 10).map(p => `<div class="m-item">${posterMedia(p)}</div>`).join('');

  /* ── Campaigns ───────────────────────────────────────────── */
  $('#count-campaigns').textContent = `${D.campaigns.length} projects`;
  $('#campaign-list').innerHTML = D.campaigns.map((c, ci) => {
    const key = 'campaign-' + ci;
    const spec = { title: c.title, client: c.client, year: c.year, style: c.art[0], palette: c.art[1], glyph: c.glyph, seed: c.title };
    const media = fm => {
      if (fm.image) return img(fm.image, `${c.title}, ${fm.label}`);
      const r = fm.ratio[0] / fm.ratio[1];
      return r >= 1 ? Art.poster(spec, 600 * r, 600) : Art.poster(spec, 600, 600 / r);
    };

    groups[key] = c.formats.map(fm => ({
      ratio: fm.ratio[0] / fm.ratio[1], isImg: !!fm.image, html: () => media(fm),
      kicker: 'Campaign', title: c.title, note: c.summary,
      meta: [['Client', c.client], ['Year', c.year], ['Format', `${fm.label} · ${fm.ratio[0]}:${fm.ratio[1]}`]]
    }));

    // First format gets its own row; the rest are packed into equal-height rows.
    const rows = [[0]];
    let row = [], sum = 0;
    c.formats.forEach((fm, i) => {
      if (i === 0) return;
      const r = fm.ratio[0] / fm.ratio[1];
      if (row.length && sum + r > 3.3) { rows.push(row); row = []; sum = 0; }
      row.push(i); sum += r;
    });
    if (row.length) rows.push(row);

    const rowsHTML = rows.map(idxs => {
      const total = idxs.reduce((n, i) => n + c.formats[i].ratio[0] / c.formats[i].ratio[1], 0);
      // A short final row stays left-aligned at a sensible height instead of blowing up.
      const filler = idxs.length > 1 && total < 1.6 ? `<div style="flex:${(2.2 - total).toFixed(3)} 1 0%"></div>` : '';
      return '<div class="c-row">' + idxs.map(i => {
        const fm = c.formats[i], r = fm.ratio[0] / fm.ratio[1];
        return `<figure class="c-item" style="flex:${r.toFixed(4)} 1 0%">` +
          `<button class="c-art" type="button" data-group="${key}" data-i="${i}" style="aspect-ratio:${fm.ratio[0]}/${fm.ratio[1]}" aria-label="${esc(c.title)}, ${esc(fm.label)}">${media(fm)}</button>` +
          `<figcaption><span>${esc(fm.label)}</span><span>${fm.ratio[0]}:${fm.ratio[1]}</span></figcaption>` +
        `</figure>`;
      }).join('') + filler + '</div>';
    }).join('');

    return `<article class="campaign">` +
      `<div class="c-info reveal">` +
        `<p class="c-meta"><span>C/${pad2(ci + 1)}</span><span>${esc(c.client)}</span><span>${esc(c.year)}</span></p>` +
        `<h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p>` +
        `<ul class="c-scope">${c.scope.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` +
      `</div>` +
      `<div class="c-media reveal">${rowsHTML}</div>` +
    `</article>`;
  }).join('');

  /* ── A+ content ──────────────────────────────────────────── */
  // One entry per content module: the designer's own images if given, placeholders if not.
  const apMods = a => a.modules
    ? a.modules.map((src, i) => img(src, `${a.brand} ${a.title}, module ${i + 1}`))
    : Art.aplusModules(a);
  const apCount = a => (a.modules || a.layout || Art.MODULES).length;
  const apMeta = a => [['Brand', a.brand], ['Category', a.category], ['Channel', a.marketplace], ['Role', a.role],
    ['Modules', String(apCount(a))], ['Year', a.year], ['Result', a.result]].filter(m => m[1]);
  const metaHTML = rows => rows.map(m => `<div><dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd></div>`).join('');

  $('#count-aplus').textContent = `${D.aplus.length} product pages`;
  groups.aplus = D.aplus.map(a => ({
    page: true, html: () => apMods(a).join(''),
    kicker: 'A+ Content', title: a.title, note: a.summary, meta: apMeta(a)
  }));

  const apIndex = $('#ap-index'), apStage = $('#ap-stage'), apInfo = $('#ap-info');
  apIndex.innerHTML = D.aplus.map((a, i) =>
    `<button class="ap-tab" type="button" role="tab" id="ap-tab-${i}" aria-controls="ap-stage" aria-selected="false" tabindex="-1" data-ap="${i}">` +
      `<span class="n">${pad2(i + 1)}</span>` +
      `<span class="t">${esc(a.title)}<span class="c">${esc(a.brand)} · ${esc(a.category)}</span></span>` +
      `<span class="m">${apCount(a)} modules</span>` +
    `</button>`).join('');

  // Hovering the page preview scrolls it to the bottom; this measures how far.
  const apRO = 'ResizeObserver' in window ? new ResizeObserver(() => {
    const view = $('.ap-view', apStage), stack = view && view.firstElementChild;
    if (stack) view.style.setProperty('--shift', Math.min(0, view.clientHeight - stack.offsetHeight) + 'px');
  }) : null;

  function selectAp(i) {
    const a = D.aplus[i];
    $$('.ap-tab', apIndex).forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    apStage.setAttribute('aria-labelledby', 'ap-tab-' + i);
    apStage.innerHTML =
      `<div class="ap-stage-top"><span>${esc(a.brand)}</span><span>${esc(a.marketplace)}</span></div>` +
      `<button class="ap-frame" type="button" data-group="aplus" data-i="${i}" aria-label="Open the full ${esc(a.title)} page">` +
        `<span class="ap-bar"><i></i><i></i><i></i><span>${esc(a.brand)} / ${esc(a.title)}</span></span>` +
        `<span class="ap-view"><span class="ap-stack">${apMods(a).join('')}</span></span>` +
      `</button>` +
      `<div class="ap-strip">` + apMods(a).map((m, k) =>
        `<button class="ap-thumb" type="button" data-group="aplus" data-i="${i}" data-mod="${k}" aria-label="Open module ${k + 1} of ${esc(a.title)}">${m}</button>`).join('') +
      `</div>`;
    apInfo.innerHTML =
      `<p class="ap-summary">${esc(a.summary)}</p>` +
      `<dl class="ap-meta">${metaHTML(apMeta(a))}</dl>` +
      `<button class="btn" type="button" data-group="aplus" data-i="${i}">View full page ↗</button>`;
    if (apRO) { apRO.disconnect(); apRO.observe($('.ap-view', apStage)); apRO.observe($('.ap-stack', apStage)); }
  }

  apIndex.addEventListener('click', e => {
    const t = e.target.closest('.ap-tab');
    if (t) selectAp(+t.dataset.ap);
  });
  apIndex.addEventListener('keydown', e => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const tabs = $$('.ap-tab', apIndex), cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const next = (cur + step + tabs.length) % tabs.length;
    selectAp(next);
    tabs[next].focus();
  });
  if (D.aplus.length) selectAp(0);

  /* ── Viewer ──────────────────────────────────────────────── */
  const lb = $('#lb'), lbMedia = $('.lb-media', lb), lbStage = $('.lb-stage', lb);
  const cur = { items: [], i: 0 };

  function show(i) {
    const n = cur.items.length;
    cur.i = (i + n) % n;
    const it = cur.items[cur.i];
    lb.classList.toggle('is-page', !!it.page);
    lbMedia.classList.toggle('is-img', !!it.isImg);
    lbMedia.style.setProperty('--r', it.ratio || 1);
    lbMedia.innerHTML = it.html();
    $('.lb-count', lb).textContent = `${pad2(cur.i + 1)} / ${pad2(n)}`;
    $('.lb-kicker', lb).textContent = it.kicker || '';
    $('.lb-title', lb).textContent = it.title;
    $('.lb-note', lb).textContent = it.note || '';
    $('.lb-meta', lb).innerHTML = (it.meta || []).filter(m => m[1]).map(m => `<div><dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd></div>`).join('');
    $('.lb-nav', lb).hidden = n < 2;
    lbStage.scrollTop = 0;
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-group]');
    if (!t || !groups[t.dataset.group]) return;
    cur.items = groups[t.dataset.group];
    show(+t.dataset.i);
    if (!lb.open) lb.showModal();
    root.classList.add('lb-open');
    if (t.dataset.mod) { // opened from a module thumbnail: jump to that module
      const el = lbMedia.children[+t.dataset.mod];
      if (el) lbStage.scrollTop += el.getBoundingClientRect().top - lbMedia.getBoundingClientRect().top;
    }
  });
  lb.addEventListener('close', () => {
    if (lb.open) return; // reopened before this event arrived
    root.classList.remove('lb-open');
    lbMedia.innerHTML = '';
  });
  $('.lb-close', lb).addEventListener('click', () => lb.close());
  lbStage.addEventListener('click', e => { if (e.target === lbStage) lb.close(); });
  $$('[data-step]', lb).forEach(b => b.addEventListener('click', () => show(cur.i + +b.dataset.step)));
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') show(cur.i + 1);
    if (e.key === 'ArrowLeft') show(cur.i - 1);
  });

  /* ── Page behaviour ──────────────────────────────────────── */
  $('#theme').addEventListener('click', () => {
    const dark = getComputedStyle(root).getPropertyValue('--is-dark').trim() === '1';
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  const head = $('.site-head');
  const onScroll = () => head.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(el => io.observe(el));

    const links = $$('.nav a');
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }
})();
