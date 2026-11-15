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
  document.title = `${P.name}, ${P.role}`;
  $$('[data-t]').forEach(el => { if (P[el.dataset.t] != null) el.textContent = P[el.dataset.t]; });
  $$('[data-mail]').forEach(a => { a.href = 'mailto:' + P.email; });
  $$('[data-n]').forEach(el => { el.textContent = pad2(D.work.length + +el.dataset.n); });
  $('#yr').textContent = new Date().getFullYear();
  $('#socials').innerHTML = (P.socials || []).map(s => `<li><a href="${esc(s.url)}">${esc(s.label)}</a></li>`).join('');
  $('#socials').hidden = !(P.socials || []).length;
  $('#about-cols').innerHTML = (P.about || []).map(([h, items]) =>
    `<div class="reveal"><h3>${esc(h)}</h3><ul>${items.map(it => `<li>${esc(it)}</li>`).join('')}</ul></div>`).join('');

  const img = (src, alt) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;

  /* ── Work: one chapter per role, each holding groups of pieces ── */
  const nameOf = it => it.title || it.label;
  const ratioOf = it => it.ratio || [5, 7];

  // A piece's own image if it has one, otherwise a generated placeholder.
  const pieceMedia = (it, g, ch, k) => {
    if (it.image) return img(it.image, `${nameOf(it)}, ${ch.title}`);
    const [a, b] = ratioOf(it), r = a / b, art = it.art || g.art || ['orb', 'paper'];
    const spec = { title: nameOf(it), client: ch.title, year: ch.short || ch.years, style: art[0], palette: art[1], glyph: it.glyph || g.glyph, seed: g.title + nameOf(it) + k };
    return r >= 1 ? Art.poster(spec, 600 * r, 600) : Art.poster(spec, 600, 600 / r);
  };

  // One entry per content module of a product page.
  const apMods = a => a.modules
    ? a.modules.map((src, i) => img(src, `${a.brand} ${a.title}, module ${i + 1}`))
    : Art.aplusModules(a);
  const apCount = a => (a.modules || a.layout || Art.MODULES).length;
  const apMeta = a => [['Brand', a.brand], ['Channel', a.marketplace], ['Role', a.role],
    ['Modules', String(apCount(a))], ['Year', a.year], ['Result', a.result]].filter(m => m[1]);
  const metaHTML = rows => rows.map(m => `<div><dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd></div>`).join('');

  const reel = []; // portrait pieces for the strip under the intro
  const pageMounts = [];

  const groupHTML = (g, gi, ch) => {
    const key = `${ch.id}-${gi}`;
    let body;

    if (g.layout === 'pages') {
      groups[key] = g.items.map(a => ({
        page: true, html: () => apMods(a).join(''),
        kicker: ch.title, title: a.title, note: a.summary, meta: apMeta(a)
      }));
      pageMounts.push({ key, items: g.items });
      body = `<div class="ap reveal" data-ap="${key}">` +
        `<div class="ap-side"><div class="ap-index" role="tablist" aria-label="${esc(g.title)}"></div><div class="ap-info"></div></div>` +
        `<div class="ap-stage" role="tabpanel" id="ap-stage-${key}"></div></div>`;
    } else {
      groups[key] = g.items.map((it, k) => ({
        ratio: ratioOf(it)[0] / ratioOf(it)[1], isImg: !!it.image, html: () => pieceMedia(it, g, ch, k),
        kicker: ch.title, title: nameOf(it), note: it.note,
        meta: [['Role', ch.role], ['Period', ch.years], ['Work', g.title]]
      }));
      if (g.layout === 'tiles') {
        g.items.forEach((it, k) => reel.push(pieceMedia(it, g, ch, k)));
        body = `<div class="poster-grid">` + g.items.map((it, k) =>
          `<button class="tile reveal" type="button" data-group="${key}" data-i="${k}" style="transition-delay:${(k % 4) * 70}ms">` +
            `<span class="tile-art">${pieceMedia(it, g, ch, k)}</span>` +
            `<span class="tile-cap"><span class="t">${esc(nameOf(it))}</span></span>` +
          `</button>`).join('') + `</div>`;
      } else {
        const tall = g.items.findIndex(it => ratioOf(it)[0] < ratioOf(it)[1]);
        if (tall >= 0) reel.push(pieceMedia(Object.assign({}, g.items[tall], { ratio: [5, 7] }), g, ch, tall));
        body = `<div class="g-rows reveal">` + g.items.map((it, k) => {
          const [a, b] = ratioOf(it);
          return `<figure class="c-item" style="--r:${(a / b).toFixed(4)}">` +
            `<button class="c-art" type="button" data-group="${key}" data-i="${k}" style="aspect-ratio:${a}/${b}" aria-label="${esc(nameOf(it))}">${pieceMedia(it, g, ch, k)}</button>` +
            `<figcaption><span>${esc(nameOf(it))}</span></figcaption>` +
          `</figure>`;
        }).join('') + `</div>`;
      }
    }
    return `<div class="grp"><div class="grp-head"><h3>${esc(g.title)}</h3></div>${body}</div>`;
  };

  $('#chapters').innerHTML = D.work.map((ch, ci) =>
    `<section class="section chapter" id="work-${esc(ch.id)}">` +
      `<header class="sec-head">` +
        `<div class="sec-top"><span>${pad2(ci + 1)}</span><span>${esc(ch.years)}</span></div>` +
        `<div class="sec-main"><h2>${esc(ch.title)}</h2><p><span class="role">${esc(ch.role)}, ${esc(ch.industry)}</span>${esc(ch.summary)}</p></div>` +
      `</header>` +
      ch.groups.map((g, gi) => groupHTML(g, gi, ch)).join('') +
    `</section>`).join('');

  /* Overview: the three roles at a glance, each linking to its chapter */
  $('#work-index').innerHTML = D.work.map(ch =>
    `<a class="xp-row reveal" href="#work-${esc(ch.id)}">` +
      `<span class="xp-years">${esc(ch.years)}</span>` +
      `<h3>${esc(ch.title)}<span>${esc(ch.role)}, ${esc(ch.industry)}</span></h3>` +
      `<ul>${ch.groups.map(g => `<li>${esc(g.title)}</li>`).join('')}</ul>` +
    `</a>`).join('');

  /* Strip under the intro: a drifting row of pieces (two copies for a seamless loop) */
  const strip = reel.slice(0, 10).map(m => `<div class="m-item">${m}</div>`).join('');
  $('#marquee').innerHTML = strip + strip;

  /* ── Product pages: list on the left, scrolling preview on the right ── */
  pageMounts.forEach(({ key, items }) => {
    const el = $(`[data-ap="${key}"]`);
    const apIndex = $('.ap-index', el), apStage = $('.ap-stage', el), apInfo = $('.ap-info', el);
    apIndex.innerHTML = items.map((a, i) =>
      `<button class="ap-tab" type="button" role="tab" id="ap-tab-${key}-${i}" aria-controls="ap-stage-${key}" aria-selected="false" tabindex="-1" data-ap-i="${i}">` +
        `<span class="n">${pad2(i + 1)}</span>` +
        `<span class="t">${esc(a.title)}${a.category ? `<span class="c">${esc(a.category)}</span>` : ''}</span>` +
        `<span class="m">${apCount(a)} modules</span>` +
      `</button>`).join('');

    // Hovering the page preview scrolls it to the bottom; this measures how far.
    const apRO = 'ResizeObserver' in window ? new ResizeObserver(() => {
      const view = $('.ap-view', apStage), stack = view && view.firstElementChild;
      if (stack) view.style.setProperty('--shift', Math.min(0, view.clientHeight - stack.offsetHeight) + 'px');
    }) : null;

    const select = i => {
      const a = items[i];
      $$('.ap-tab', apIndex).forEach((t, k) => {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
      });
      apStage.setAttribute('aria-labelledby', `ap-tab-${key}-${i}`);
      apStage.innerHTML =
        `<div class="ap-stage-top"><span>${esc(a.brand)}</span><span>${esc(a.marketplace)}</span></div>` +
        `<button class="ap-frame" type="button" data-group="${key}" data-i="${i}" aria-label="Open the full ${esc(a.title)} page">` +
          `<span class="ap-bar"><i></i><i></i><i></i><span>${esc(a.brand)} / ${esc(a.title)}</span></span>` +
          `<span class="ap-view"><span class="ap-stack">${apMods(a).join('')}</span></span>` +
        `</button>` +
        `<div class="ap-strip">` + apMods(a).map((m, k) =>
          `<button class="ap-thumb" type="button" data-group="${key}" data-i="${i}" data-mod="${k}" aria-label="Open module ${k + 1} of ${esc(a.title)}">${m}</button>`).join('') +
        `</div>`;
      apInfo.innerHTML =
        `<p class="ap-summary">${esc(a.summary)}</p>` +
        `<dl class="ap-meta">${metaHTML(apMeta(a).filter(m => ['Year', 'Role', 'Result'].includes(m[0])))}</dl>` +
        `<button class="btn" type="button" data-group="${key}" data-i="${i}">View full page ↗</button>`;
      if (apRO) { apRO.disconnect(); apRO.observe($('.ap-view', apStage)); apRO.observe($('.ap-stack', apStage)); }
    };

    apIndex.addEventListener('click', e => {
      const t = e.target.closest('.ap-tab');
      if (t) select(+t.dataset.apI);
    });
    apIndex.addEventListener('keydown', e => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const tabs = $$('.ap-tab', apIndex), cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
      const next = (cur + step + tabs.length) % tabs.length;
      select(next);
      tabs[next].focus();
    });
    if (items.length) select(0);
  });

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
    $('.lb-meta', lb).innerHTML = metaHTML((it.meta || []).filter(m => m[1]));
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
      const id = e.target.id.indexOf('work') === 0 ? 'work' : e.target.id;
      links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false'));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }
})();
