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
  const metaHTML = rows => rows.map(m => `<div><dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd></div>`).join('');

  const pageMounts = [];

  /* Rows for a group of pieces. The first wide piece leads at full width; the rest are
     packed into rows that each fill the width at one shared height. Returns index lists. */
  const layoutRows = items => {
    const r = i => ratioOf(items[i])[0] / ratioOf(items[i])[1];
    const all = items.map((_, i) => i);
    const hero = all.find(i => r(i) >= 1.5);
    const rows = hero == null ? [] : [[hero]];
    let row = [], sum = 0;
    all.filter(i => i !== hero).forEach(i => {
      row.push(i); sum += r(i);
      if (sum >= 2.6) { rows.push(row); row = []; sum = 0; }
    });
    if (row.length) {
      const prev = rows[rows.length - 1];
      const packed = prev && !(hero != null && rows.length === 1);
      if (sum < 1.5 && packed) prev.push(...row); else rows.push(row);
    }
    return rows.map(idxs => ({ idxs, sum: idxs.reduce((n, i) => n + r(i), 0) }));
  };

  const groupHTML = (g, gi, ch) => {
    const key = `${ch.id}-${gi}`;

    if (g.layout === 'pages') {
      pageMounts.push({ key, items: g.items });
      return `<div class="grp" data-pages="${key}">` +
        `<div class="grp-head"><h3>${esc(g.title)}</h3><div class="pg-tabs" role="tablist" aria-label="${esc(g.title)}"></div></div>` +
        `<div class="pg-stack reveal" role="tabpanel" id="pg-${key}"></div>` +
      `</div>`;
    }

    groups[key] = g.items.map((it, k) => ({
      ratio: ratioOf(it)[0] / ratioOf(it)[1], isImg: !!it.image, html: () => pieceMedia(it, g, ch, k),
      kicker: ch.title, title: nameOf(it), note: it.note,
      meta: [['Role', ch.role], ['Period', ch.years], ['Work', g.title]]
    }));
    const rows = layoutRows(g.items).map(({ idxs, sum }) =>
      `<div class="m-row">` + idxs.map(k => {
        const [a, b] = ratioOf(g.items[k]);
        return `<button class="m-item" type="button" data-group="${key}" data-i="${k}" style="--r:${(a / b).toFixed(4)};aspect-ratio:${a}/${b}" aria-label="${esc(nameOf(g.items[k]))}">${pieceMedia(g.items[k], g, ch, k)}</button>`;
      }).join('') +
      // a short row of upright pieces stays at a sensible height instead of filling the width
      (sum < 1.5 ? `<span class="m-fill" style="flex:${(2.4 - sum).toFixed(3)} 1 0%"></span>` : '') +
      `</div>`).join('');
    return `<div class="grp"><div class="grp-head"><h3>${esc(g.title)}</h3></div><div class="mosaic reveal">${rows}</div></div>`;
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
          (ch.credits ? `<div><dt>Credits</dt><dd>${ch.credits.map(c => `${esc(c[0])}: ${esc(c[1])}`).join('<br>')}</dd></div>` : '') +
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

  /* ── Product pages: pick one, see every module at full size ── */
  pageMounts.forEach(({ key, items }) => {
    const el = $(`[data-pages="${key}"]`), tabs = $('.pg-tabs', el), stack = $('.pg-stack', el);
    tabs.innerHTML = items.map((a, i) =>
      `<button class="pg-tab" type="button" role="tab" id="pg-tab-${key}-${i}" aria-controls="pg-${key}" aria-selected="false" tabindex="-1" data-pg="${i}">${esc(a.title)}</button>`).join('');
    const select = (i, user) => {
      $$('.pg-tab', tabs).forEach((t, k) => {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
      });
      stack.setAttribute('aria-labelledby', `pg-tab-${key}-${i}`);
      stack.innerHTML = apMods(items[i]).join('');
      // switching from deep inside a long page: come back to its top
      if (user && el.getBoundingClientRect().top < 0) el.scrollIntoView();
    };
    tabs.addEventListener('click', e => {
      const t = e.target.closest('.pg-tab');
      if (t) select(+t.dataset.pg, true);
    });
    tabs.addEventListener('keydown', e => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const all = $$('.pg-tab', tabs), cur = all.findIndex(t => t.getAttribute('aria-selected') === 'true');
      const next = (cur + step + all.length) % all.length;
      select(next, true);
      all[next].focus();
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

  /* ── Handwriting ─────────────────────────────────────────────
     Each letter is uncovered left to right, one after another, so a line reads as if
     it is being written. data-write says what drives it:
       load   plays once when the page opens
       scroll follows the scroll position as the line moves up the screen
       view   plays once when the line comes into view                         */
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const writers = $$('[data-write]').map(el => {
    const text = el.textContent.trim();
    el.textContent = '';
    const sr = document.createElement('span'); // the whole line, for screen readers and copy
    sr.className = 'vh'; sr.textContent = text;
    const ink = document.createElement('span');
    ink.setAttribute('aria-hidden', 'true');
    ink.innerHTML = text.split(/\s+/).map(w =>
      `<span class="w">${Array.from(w).map(c => `<span class="ch">${esc(c)}</span>`).join('')}</span>`).join(' ');
    el.append(sr, ink);
    const chars = $$('.ch', ink), n = chars.length;
    const span = Math.min(1, 2.4 / n); // share of the whole line one letter takes to appear
    const draw = p => chars.forEach((c, i) => {
      const q = clamp01((p - (i / n) * (1 - span)) / span);
      c.style.clipPath = q >= 1 ? '' : `inset(-30% ${((1.3 - 1.6 * q) * 100).toFixed(1)}% -30% -30%)`;
      c.style.visibility = q <= 0 ? 'hidden' : '';
    });
    draw(0);
    return { el, mode: el.dataset.write, draw, shown: 0, target: 0, n };
  });

  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // play a line over time; roughly constant writing speed whatever its length
  const play = w => {
    if (w.playing || w.shown >= 1) return;
    w.playing = true;
    const ms = Math.max(1500, w.n * 120), t0 = performance.now();
    const tick = now => {
      w.shown = clamp01((now - t0) / ms);
      w.draw(w.shown);
      if (w.shown < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (noMotion) {
    writers.forEach(w => w.draw(1));
  } else {
    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(() => setTimeout(() => writers.filter(w => w.mode === 'load').forEach(play), 250));

    if ('IntersectionObserver' in window) {
      const seen = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) play(writers.find(w => w.el === e.target));
      }), { rootMargin: '0px 0px -18% 0px' });
      writers.filter(w => w.mode === 'view').forEach(w => seen.observe(w.el));
    } else {
      writers.filter(w => w.mode === 'view').forEach(w => w.draw(1));
    }

    // scroll-driven lines: the pen follows the scroll, easing to catch up, and never un-writes
    const scrolled = writers.filter(w => w.mode === 'scroll');
    let ticking = false;
    const follow = () => {
      let moving = false;
      scrolled.forEach(w => {
        const r = w.el.getBoundingClientRect(), vh = window.innerHeight;
        w.target = Math.max(w.target, clamp01((vh * 0.9 - r.top) / (vh * 0.35 + r.height)));
        if (w.target - w.shown > 0.001) { w.shown += (w.target - w.shown) * 0.14; w.draw(w.shown); moving = true; }
        else if (w.shown < w.target) { w.shown = w.target; w.draw(w.shown); }
      });
      ticking = moving;
      if (moving) requestAnimationFrame(follow);
    };
    const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(follow); } };
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
  }

  /* ── Page behaviour ──────────────────────────────────────── */
  // The header steps aside while scrolling down through the work and returns on the way up.
  const head = $('.site-head');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    head.classList.toggle('away', y > lastY && y > 160);
    lastY = y;
  }, { passive: true });

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
