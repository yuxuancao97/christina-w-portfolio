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
    ['Experience', P.experience],
    ['Skills', P.skills],
    ['Certificates', P.certificates]
  ].filter(([, rows]) => rows && rows.length).map(([h, rows]) =>
    `<section class="rs reveal"><h3 class="display">${esc(h)}</h3>` + rows.map(([k, v]) =>
      `<div class="rs-row"><span class="k${tag(k) ? ' tag' : ''}">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('') +
    `</section>`).join('');

  const helloFacts = $('#hello-facts');
  if (helloFacts) helloFacts.innerHTML = (P.facts || []).map(m => `<div><dt>${esc(m[0])}</dt><dd>${esc(m[1])}</dd></div>`).join('');

  const img = (src, alt, cls) => `<img src="${esc(src)}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} loading="lazy" decoding="async">`;
  // pictures fade in as they arrive (load does not bubble, so it is caught on the way down)
  const arrived = e => { if (e.target.tagName === 'IMG') e.target.classList.add('is-in'); };
  document.addEventListener('load', arrived, true);
  document.addEventListener('error', arrived, true);

  /* ── Work: one chapter per role, each holding groups of pieces ── */
  const nameOf = it => it.title || it.label;
  const ratioOf = it => it.ratio || [5, 7];

  // A piece's own image if it has one, otherwise a generated placeholder.
  const pieceMedia = (it, g, ch, k) => {
    if (it.image) return img(it.image, `${nameOf(it)}, ${ch.title}`, it.tall ? 'from-top' : '');
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
  const layoutRows = (items, cols) => {
    const r = i => ratioOf(items[i])[0] / ratioOf(items[i])[1];
    const all = items.map((_, i) => i);
    if (cols) { // even rows of a set number of pieces
      const even = [];
      for (let i = 0; i < all.length; i += cols) even.push({ idxs: all.slice(i, i + cols), sum: 9 });
      return even;
    }
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
      page: !!it.tall,
      meta: [['Project', ch.title], ['Work', g.title], ['Date', ch.years]]
    }));
    const rows = layoutRows(g.items, g.cols).map(({ idxs, sum }) =>
      `<div class="m-row">` + idxs.map(k => {
        const [a, b] = ratioOf(g.items[k]);
        return `<button class="m-item" type="button" data-group="${key}" data-i="${k}" style="--r:${(a / b).toFixed(4)};aspect-ratio:${a}/${b}" aria-label="${esc(nameOf(g.items[k]))}">${pieceMedia(g.items[k], g, ch, k)}</button>`;
      }).join('') +
      // a short row of upright pieces stays at a sensible height instead of filling the width
      (sum < 1.5 ? `<span class="m-fill" style="flex:${(2.4 - sum).toFixed(3)} 1 0%"></span>` : '') +
      `</div>`).join('');
    return `<div class="grp"><div class="grp-head"><h3>${esc(g.title)}</h3>${g.text ? `<p class="grp-text">${esc(g.text)}</p>` : ''}</div><div class="mosaic reveal">${rows}</div></div>`;
  };

  const tint = ch => ch.accent ? ` style="--c:${esc(ch.accent)}"` : '';
  $('#chapters').innerHTML = D.work.map((ch, ci) =>
    `<section class="chapter" id="work-${esc(ch.id)}"${tint(ch)}>` +
      `<div class="panel cover-panel">` +
        `<div class="panel-top"><span><i class="dot"></i>${pad2(ci + 1)}. ${esc(ch.title)}</span><span>${esc(ch.kind || '')}</span></div>` +
        `<h2 class="wordmark reveal" style="--n:${(ch.mark || ch.title).length}" aria-label="${esc(ch.title)}">${esc(ch.mark || ch.title)}</h2>` +
        `<dl class="panel-meta">` +
          `<div><dt>Overview</dt><dd>${esc(ch.summary)}</dd></div>` +
          (ch.facts || []).map(f => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join('') +
        `</dl>` +
      `</div>` +
      ch.groups.map((g, gi) => groupHTML(g, gi, ch)).join('') +
    `</section>`).join('');

  /* Index: the projects at a glance, each linking to its chapter. The picture beside
     the list follows the row under the pointer, or the focused one. */
  const countOf = ch => ch.groups.reduce((n, g) => n + g.items.length, 0);
  $('#work-index').innerHTML = D.work.map((ch, i) =>
    `<li><a href="#work-${esc(ch.id)}" data-peek="${i}"${tint(ch)}>` +
      `<span class="n">${pad2(i + 1)}.</span>` +
      `<span class="t">${esc(ch.title)}</span>` +
      `<span class="d">${esc(ch.kind || '')}</span>` +
      `<span class="y">${pad2(countOf(ch))} pieces</span>` +
    `</a></li>`).join('');
  const peek = $('#index-peek');
  if (peek) {
    peek.innerHTML = D.work.map((ch, i) => ch.cover ? `<img src="${esc(ch.cover)}" alt="" data-peek="${i}" decoding="async">` : '').join('') +
      `<figcaption></figcaption>`;
    const showPeek = i => {
      $$('img', peek).forEach(im => im.classList.toggle('on', +im.dataset.peek === i));
      $$('#work-index a').forEach(a => a.classList.toggle('on', +a.dataset.peek === i));
      $('figcaption', peek).textContent = `${pad2(i + 1)} / ${D.work[i].title}`;
    };
    const fromRow = e => { const a = e.target.closest('a[data-peek]'); if (a) showPeek(+a.dataset.peek); };
    $('#work-index').addEventListener('pointerover', fromRow);
    $('#work-index').addEventListener('focusin', fromRow);
    showPeek(0);
  }

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
    lbMedia.style.setProperty('--page-w', it.page && it.isImg ? '680px' : '970px'); // a long poster scrolls at its own width
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
        g.items.forEach((it, k) => it.reel !== false && !it.tall && pieces.push({
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
      kicker: seasCh.title, title: x.title, meta: [['Project', seasCh.title], ['Work', x.work], ['Date', seasCh.years]]
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

  /* ── Signature ───────────────────────────────────────────────
     Ink on a canvas, from the strokes in js/signature.js. The first scroll starts it, the
     cover holds still until it is written, and its pace never depends on the scrolling.
     Each frame only stamps the newest stretch of line, so there is nothing to re-render. */
  const SG = window.SIGNATURE, coverTitle = $('.cover-title');
  let ink = null;
  if (SG && coverTitle && window.requestAnimationFrame) {
    const [vx, vy, vw, vh] = SG.viewBox, pace = SG.pace, pen = SG.pen;
    const STEP = 0.5; // distance between stamps, in drawing units

    // round the traced corners (never overshoots), then space the points evenly
    const smooth = pts => {
      for (let n = 0; n < 3; n++) {
        const out = [pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
        }
        out.push(pts[pts.length - 1]);
        pts = out;
      }
      const even = [pts[0]];
      let carry = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
        for (let t = STEP - carry; t <= d; t += STEP) even.push([a[0] + (b[0] - a[0]) * t / d, a[1] + (b[1] - a[1]) * t / d]);
        carry = (carry + d) % STEP;
      }
      return even;
    };

    /* Tempo. For every point along a stroke, work out when the pen reaches it:
         - it slows in tight curves and runs faster where the line is straighter
           (handwriting research calls this the two-thirds power law)
         - it starts each stroke from rest and settles again at the end
         - between strokes the hand pauses, longer the further it has to travel */
    const ease = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
    let at = 0, prevEnd = null, holdFor = 0;
    const strokes = SG.strokes.map(st => {
      const pts = smooth(st.pts.split(' ').map(q => q.split(',').map(Number)));
      const n = pts.length, len = n * STEP;

      // line thickness: thinner where the pen lands and where it leaves; a dot is a single dab
      const land = Math.min(12, len * 0.3), leave = Math.min(18, len * 0.35);
      const radius = pts.map((_, i) => {
        if (st.dab) return pen.width * 0.6;
        const d = i * STEP, k = Math.min(1, d / land, (len - d) / leave + 0.25);
        return pen.width / 2 * (1 - pen.taper * (1 - k) * (1 - k));
      });

      // how sharply the line turns at each point, then the speed that goes with it
      const span = 7; // points either side, about 3.5 units
      let factor = pts.map((q, i) => {
        const a = pts[Math.max(0, i - span)], b = pts[Math.min(n - 1, i + span)];
        const ux = q[0] - a[0], uy = q[1] - a[1], vx2 = b[0] - q[0], vy2 = b[1] - q[1];
        const turn = Math.abs(Math.atan2(ux * vy2 - uy * vx2, ux * vx2 + uy * vy2));
        const curve = turn / (span * STEP * 2) + 1e-4;        // curvature, 1 / radius
        return Math.max(pace.slowest, Math.min(pace.fastest, Math.cbrt((1 / 45) / curve)));
      });
      // even the speed out a little so it changes like a hand, not a switch
      factor = factor.map((_, i) => {
        let sum = 0, c = 0;
        for (let k = Math.max(0, i - 10); k <= Math.min(n - 1, i + 10); k++) { sum += factor[k]; c++; }
        return sum / c;
      });

      // when the pen reaches each point, in ms from the start of the stroke
      const rise = Math.min(18, len * 0.3), fall = Math.min(24, len * 0.38);
      const when = new Float32Array(n);
      let t = 0;
      for (let i = 0; i < n; i++) {
        const d = i * STEP;
        const fromRest = Math.min(0.3 + 0.7 * ease(d / rise), 0.34 + 0.66 * ease((len - d) / fall));
        t += STEP / (pace.speed * factor[i] * fromRest);
        when[i] = t;
      }
      const dur = st.dab ? pace.dab : Math.max(t, pace.shortest || 0);
      if (st.dab) for (let i = 0; i < n; i++) when[i] = dur * 0.45 * (i + 1) / n; // a dab lands almost at once
      else if (dur > t) for (let i = 0; i < n; i++) when[i] *= dur / t;           // stretch a stroke that would be too quick

      // the pause before it: set by hand, none for a joined stroke, otherwise by distance through the air
      const air = prevEnd ? Math.hypot(pts[0][0] - prevEnd[0], pts[0][1] - prevEnd[1]) : 0;
      at += st.lift != null ? st.lift : st.join || !prevEnd ? 0 : pace.liftBase + air * pace.liftPerUnit;
      const s = { pts, radius, when, start: at, dur, drawn: 0 };
      at += dur;
      prevEnd = pts[n - 1];
      if (!st.dab) holdFor = at; // the page waits for the writing, not for the dots that follow
      return s;
    });
    // for tuning: the timetable, readable from the page (ms from the first scroll)
    coverTitle.dataset.timetable = strokes.map(s => `${Math.round(s.start)}+${Math.round(s.dur)}`).join(' ');

    const canvas = document.createElement('canvas');
    canvas.className = 'ink';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');
    coverTitle.innerHTML = `<span class="vh">${esc(SG.text)}</span>`;
    coverTitle.append(canvas);
    coverTitle.classList.add('is-sig');
    coverTitle.style.setProperty('--sig-ratio', vw / vh);

    // stamp a stretch of one stroke: a run of overlapping dots along the line
    const stamp = (s, from, to) => {
      if (to <= from) return;
      ctx.beginPath();
      for (let i = from; i < to; i++) {
        const [x, y] = s.pts[i], r = s.radius[i];
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, 6.2832);
      }
      ctx.fill();
    };
    // match the canvas to its size on screen, then put back whatever has been written so far
    const fit = () => {
      const w = canvas.clientWidth, dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      if (!w) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr * vh / vw);
      const k = canvas.width / vw;
      ctx.setTransform(k, 0, 0, k, -vx * k, -vy * k);
      ctx.fillStyle = getComputedStyle(coverTitle).color;
      strokes.forEach(s => stamp(s, 0, s.drawn));
    };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(canvas);
    else window.addEventListener('resize', fit);

    ink = {
      time: at,          // the whole signature, dots included
      holdFor,           // how long the cover is held still
      write(onHeld) {
        const t0 = performance.now();
        let released = false;
        const frame = now => {
          const t = now - t0;
          strokes.forEach(s => {
            const n = s.pts.length;
            if (t < s.start || s.drawn >= n) return;
            let upTo = s.drawn;
            const local = t - s.start;
            while (upTo < n && s.when[upTo] <= local) upTo++;
            stamp(s, s.drawn, upTo);
            s.drawn = upTo;
          });
          if (!released && t >= holdFor) { released = true; if (onHeld) onHeld(); }
          if (t < at + 60) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }
    };
  }

  let held = !location.hash && !!ink, started = false;
  const release = () => { held = false; };
  const begin = () => {
    if (started || !ink) return;
    started = true;
    ink.write(release);
    setTimeout(release, ink.holdFor + 3000); // never keep the page held if something goes wrong
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
