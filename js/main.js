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
  $('#yr').textContent = new Date().getFullYear();
  $('#socials').innerHTML = (P.socials || []).map(s => `<li><a href="${esc(s.url)}">${esc(s.label)}</a></li>`).join('');
  $('#socials').hidden = !(P.socials || []).length;

  /* Resume: handwritten headings over rows of "left ........ right" */
  const tag = k => /^[A-Z][a-z]$/.test(k); // Ps, Ai: drawn as a small app badge
  $('#resume-body').innerHTML = [
    ['Education', P.education],
    ['Experience', D.work.map(ch => [ch.years, `${ch.title}, ${ch.role}`])],
    ['Skills', P.skills],
    ['Certificates', P.certificates]
  ].filter(([, rows]) => rows && rows.length).map(([h, rows]) =>
    `<section class="rs reveal"><h3 class="hand">${esc(h)}</h3>` + rows.map(([k, v]) =>
      `<div class="rs-row"><span class="k${tag(k) ? ' tag' : ''}">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('') +
    `</section>`).join('');

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
        body = `<div class="poster-grid">` + g.items.map((it, k) =>
          `<button class="tile reveal" type="button" data-group="${key}" data-i="${k}" style="transition-delay:${(k % 4) * 70}ms">` +
            `<span class="tile-art">${pieceMedia(it, g, ch, k)}</span>` +
            `<span class="tile-cap">${esc(nameOf(it))}</span>` +
          `</button>`).join('') + `</div>`;
      } else {
        body = `<div class="g-rows reveal">` + g.items.map((it, k) => {
          const [a, b] = ratioOf(it);
          return `<figure class="c-item" style="--r:${(a / b).toFixed(4)}">` +
            `<button class="c-art" type="button" data-group="${key}" data-i="${k}" style="aspect-ratio:${a}/${b}" aria-label="${esc(nameOf(it))}">${pieceMedia(it, g, ch, k)}</button>` +
            `<figcaption><span>${esc(nameOf(it))}</span></figcaption>` +
          `</figure>`;
        }).join('') + `</div>`;
      }
    }
    return `<div class="panel grp"><div class="grp-head"><h3>${esc(g.title)}</h3></div>${body}</div>`;
  };

  $('#chapters').innerHTML = D.work.map((ch, ci) =>
    `<section class="chapter" id="work-${esc(ch.id)}">` +
      `<div class="panel cover-panel">` +
        `<div class="panel-top"><span>${pad2(ci + 1)}. ${esc(ch.title)}</span><span>${esc(ch.industry)}</span></div>` +
        `<h2 class="wordmark reveal" style="--n:${(ch.mark || ch.title).length}" aria-label="${esc(ch.title)}">${esc(ch.mark || ch.title)}</h2>` +
        `<dl class="panel-meta">` +
          `<div><dt>Overview</dt><dd>${esc(ch.summary)}</dd></div>` +
          `<div><dt>Date</dt><dd>${esc(ch.years)}</dd></div>` +
          `<div><dt>Role</dt><dd>${esc(ch.role)}</dd></div>` +
        `</dl>` +
      `</div>` +
      ch.groups.map((g, gi) => groupHTML(g, gi, ch)).join('') +
    `</section>`).join('');

  /* Index: the roles at a glance, each linking to its chapter */
  $('#work-index').innerHTML = D.work.map((ch, i) =>
    `<li><a href="#work-${esc(ch.id)}">` +
      `<span class="n">${pad2(i + 1)}.</span>` +
      `<span class="t">${esc(ch.title)}</span>` +
      `<span class="d">${esc(ch.industry)}</span>` +
      `<span class="y">${esc(ch.years)}</span>` +
    `</a></li>`).join('');

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
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(el => io.observe(el));

    const links = $$('.nav a');
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id.indexOf('work-') === 0 ? 'index' : e.target.id;
      links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false'));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }
})();
