(function () {
  'use strict';

  const D = window.PORTFOLIO, Art = window.Art;
  const root = document.documentElement;
  root.classList.add('js');
  // Always open at the cover (or at the section a link names), never where a refresh left off.
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
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
    `<section class="rs reveal"><h3 class="display">${esc(h)}</h3>` + rows.map(([k, v]) =>
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

  /* ── Feature band: headline, facts and a moving strip of one chapter's pieces ── */
  const F = D.feature, seasCh = F && D.work.find(c => c.id === F.from);
  if (seasCh) {
    $$('[data-f]').forEach(el => { if (F[el.dataset.f] != null) el.textContent = F[el.dataset.f]; });
    $('#seas-facts').innerHTML = metaHTML(F.facts || []) +
      `<div><dt>Full work</dt><dd><a href="#work-${esc(seasCh.id)}">${pad2(D.work.indexOf(seasCh) + 1)}. ${esc(seasCh.title)} ↓</a></dd></div>`;

    // the opening module of each product page, with the other pieces dealt in between
    const openers = [], pieces = [];
    seasCh.groups.forEach(g => {
      if (g.layout === 'pages') {
        g.items.forEach(a => {
          const html = apMods(a)[0], vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(html);
          openers.push({ html, ratio: vb ? vb[1] / vb[2] : 0, isImg: !!a.modules, title: a.title, work: g.title });
        });
      } else {
        g.items.forEach((it, k) => pieces.push({
          html: pieceMedia(it, g, seasCh, k), ratio: ratioOf(it)[0] / ratioOf(it)[1], isImg: !!it.image, title: nameOf(it), work: g.title
        }));
      }
    });
    const strip = [];
    while (openers.length || pieces.length) {
      if (openers.length) strip.push(openers.shift());
      strip.push(...pieces.splice(0, 2));
    }
    groups.seas = strip.map(x => ({
      ratio: x.ratio || 2, isImg: x.isImg, html: () => x.html,
      kicker: seasCh.title, title: x.title, meta: [['Work', x.work], ['Period', seasCh.years]]
    }));
    // two copies in a row make the loop seamless; the second is hidden from keyboards and screen readers
    const stripHTML = copy => strip.map((x, i) =>
      `<button class="s-item" type="button" data-group="seas" data-i="${i}"${x.ratio ? ` style="aspect-ratio:${x.ratio.toFixed(4)}"` : ''}` +
      ` aria-label="${esc(x.title)}"${copy ? ' tabindex="-1" aria-hidden="true"' : ''}>${x.html}</button>`).join('');
    const track = $('#seas-track');
    track.innerHTML = stripHTML(false) + stripHTML(true);
    track.style.setProperty('--dur', Math.max(40, strip.length * 7) + 's');
    // the strip only moves while it is on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => es.forEach(e => track.classList.toggle('paused', !e.isIntersecting))).observe(track.parentNode);
    }
  } else {
    $('#seas').hidden = true;
  }

  /* ── Handwriting ─────────────────────────────────────────────
     A line is uncovered letter by letter with a soft, slanted edge, paced like a pen:
     wide letters take longer, each letter speeds up and slows down, and there is a
     short lift between letters and a longer one between words.
     The first scroll starts it; from there it runs at its own pace. Pacing is set just below. */
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const penEase = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

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
    const chars = $$('.ch', ink);
    const w = { el, chars, n: chars.length, plan: [] };

    // when each letter starts and how long it takes, as shares of the whole line
    w.pace = () => {
      const widths = chars.map(c => c.getBoundingClientRect().width || 1);
      const avg = widths.reduce((a, b) => a + b, 0) / widths.length;
      let t = 0;
      w.plan = chars.map((c, i) => {
        const ch = c.textContent;
        let d = 0.55 * avg + 0.45 * widths[i];            // wider letters take longer
        if (/[A-Z]/.test(ch)) d *= 1.3;                    // capitals are drawn with more care
        if (/[.,;:'’]/.test(ch)) d = avg * 0.35;           // a dot or comma is a flick
        const start = t;
        const lastInWord = !c.nextElementSibling;
        t += d + avg * (lastInWord ? 0.95 : 0.16);         // pen lift: long between words, short between letters
        return { start, d };
      });
      w.plan.forEach(pl => { pl.start /= t; pl.d /= t; });
    };
    w.draw = p => chars.forEach((c, i) => {
      const pl = w.plan[i];
      const q = p >= 1 ? 1 : penEase(clamp01((p - pl.start) / pl.d));
      if (q === c._q) return;
      c._q = q;
      c.style.setProperty('--q', q.toFixed(4));
      c.classList.toggle('done', q >= 1);
    });
    w.pace();
    w.draw(0);
    return w;
  });

  /* Pacing of the signature, in milliseconds:
       WRITE_BASE         time added once per line
       WRITE_PER_LETTER   time per letter; raise it to write more slowly
     "Christina W" takes WRITE_BASE + 10 x WRITE_PER_LETTER. Within that, the plan built
     above gives it its rhythm (wide letters slower, lifts between letters and words).
     It runs even when the device asks for reduced motion (the owner's choice): letters
     appear in place and nothing slides. */
  const WRITE_BASE = 450, WRITE_PER_LETTER = 215;
  const writeTime = w => WRITE_BASE + w.n * WRITE_PER_LETTER;
  const play = (w, onDone) => {
    if (w.playing) return;
    w.playing = true;
    w.pace(); // measured now, with the handwriting font in place
    const ms = writeTime(w), t0 = performance.now();
    const tick = now => {
      const p = clamp01((now - t0) / ms);
      w.draw(p);
      if (p < 1) requestAnimationFrame(tick); else if (onDone) onDone();
    };
    requestAnimationFrame(tick);
  };

  /* The first scroll starts the signature. The cover is held still while it is written,
     always at the same pace however hard the reader scrolls, and then the page moves on.
     A tap, click or key press starts it too. A link that names a section skips the hold. */
  let held = !location.hash && writers.length > 0, started = false;
  const release = () => { held = false; };
  const begin = () => {
    if (started) return;
    started = true;
    const longest = Math.max(0, ...writers.map(writeTime));
    writers.forEach(w => play(w, () => setTimeout(release, 200)));
    setTimeout(release, longest + 1500); // never keep the page held if a frame is missed
  };
  const SCROLL_KEYS = [' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'End', 'Home'];
  const intent = e => {
    if (!held) return;
    if (e.type === 'keydown' && !SCROLL_KEYS.includes(e.key)) return;
    if (e.cancelable) e.preventDefault(); // hold the cover where it is
    begin();
  };
  if (held) {
    window.addEventListener('wheel', intent, { passive: false });
    window.addEventListener('touchmove', intent, { passive: false });
    window.addEventListener('keydown', intent);
    window.addEventListener('scroll', begin, { passive: true }); // a dragged scrollbar
    $('.cover').addEventListener('click', begin);
  } else {
    begin();
  }

  /* ── Page behaviour ──────────────────────────────────────── */
  const head = $('.site-head'), chaptersEl = $('#chapters'), darkBands = [$('#seas'), chaptersEl];
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    // the opening screen shows only the signature and the portrait; the menu arrives once the reader moves on
    root.classList.toggle('intro-done', y > window.innerHeight * 0.45);
    // the menu turns light while it sits over a black band
    head.classList.toggle('on-dark', darkBands.some(d => { const r = d.getBoundingClientRect(); return r.top < 40 && r.bottom > 40; }));
    // over the work chapters it steps aside while scrolling down and returns on the way up
    const r = chaptersEl.getBoundingClientRect();
    head.classList.toggle('away', y > lastY && r.top < 60 && r.bottom > 60);
    lastY = y;
  };
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
      const id = e.target.id.indexOf('work-') === 0 ? 'index' : e.target.id;
      links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false'));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  // a link to a section (#resume, #work-…) lands there once the page is built; anything else lands at the top
  if (location.hash) {
    let to = null;
    try { to = document.querySelector(location.hash); } catch (e) {}
    if (to) to.scrollIntoView({ behavior: 'instant' }); else window.scrollTo({ top: 0, behavior: 'instant' });
  }
})();
