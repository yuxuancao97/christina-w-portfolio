/* ─────────────────────────────────────────────────────────────
   Placeholder artwork
   Draws stand-in posters, campaign formats and A+ modules as SVG
   so the site looks complete before real images are added.
   Any item in data.js that has an `image` (or `modules`) path
   skips this file entirely.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  let uid = 0;
  const f = n => Math.round(n * 10) / 10;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Seeded random, so each piece always draws the same way.
  function rng(seed) {
    let s = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) s = (Math.imul(s, 31) + str.charCodeAt(i)) | 0;
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const PALETTES = {
    // bold, for posters and campaigns
    paper:   { bg: '#EFE9DD', ink: '#17130F', a: '#E5391B', b: '#1D3FBF' },
    cobalt:  { bg: '#1F3BD8', ink: '#F3EFE6', a: '#FFB629', b: '#F26B5E' },
    forest:  { bg: '#12372A', ink: '#F1E9D2', a: '#F26B3A', b: '#A8C66C' },
    rose:    { bg: '#F4C6D0', ink: '#2A1420', a: '#E3311D', b: '#2B3A8C' },
    noir:    { bg: '#121212', ink: '#F2EFE8', a: '#F5D90A', b: '#FF5B2E' },
    lilac:   { bg: '#CFC4F5', ink: '#1B1440', a: '#FF5B2E', b: '#3D2BD1' },
    tang:    { bg: '#F2542D', ink: '#FBF1E3', a: '#0F2A44', b: '#F7C948' },
    sand:    { bg: '#E3D9C6', ink: '#0E3B43', a: '#D94F30', b: '#E0A526' },
    mint:    { bg: '#BFE3D0', ink: '#10261C', a: '#2743D2', b: '#F0563A' },
    oxblood: { bg: '#5A0F1C', ink: '#F3E3D3', a: '#F0A202', b: '#E86A5C' },
    sky:     { bg: '#DCE8F2', ink: '#0D1B2A', a: '#1E5BFF', b: '#FF7A45' },
    butter:  { bg: '#F4D94E', ink: '#161616', a: '#E23D28', b: '#1846C9' },
    // tonal, for product pages
    apricot: { bg: '#FBEEDD', ink: '#2B1A12', a: '#EE6B2F', b: '#F7C59F' },
    matcha:  { bg: '#EEF0DF', ink: '#1E2A1A', a: '#4E7A3A', b: '#C9D8A3' },
    glacier: { bg: '#E4EDF3', ink: '#0F1D2B', a: '#1F56D6', b: '#B5CCE4' },
    roast:   { bg: '#F1E6D8', ink: '#24140C', a: '#7A3B1D', b: '#E0B88F' }
  };

  const FONT = {
    serif: "'Instrument Serif', 'Times New Roman', serif",
    sans: "'Geist', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace"
  };

  function txt(x, y, s, o) {
    o = o || {};
    return `<text x="${f(x)}" y="${f(y)}" font-family="${FONT[o.font || 'sans']}" font-size="${f(o.size || 16)}"` +
      (o.weight ? ` font-weight="${o.weight}"` : '') +
      (o.italic ? ' font-style="italic"' : '') +
      (o.anchor ? ` text-anchor="${o.anchor}"` : '') +
      (o.ls ? ` letter-spacing="${o.ls}"` : '') +
      (o.opacity != null ? ` opacity="${o.opacity}"` : '') +
      ` fill="${o.fill || '#000'}">${esc(s)}</text>`;
  }

  function wrap(str, max) {
    const out = [];
    let cur = '';
    String(str || '').split(/\s+/).forEach(w => {
      if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; }
      else cur = cur ? cur + ' ' + w : w;
    });
    if (cur) out.push(cur);
    return out;
  }

  function para(x, y, str, max, step, o) {
    return wrap(str, max).map((l, i) => txt(x, y + i * step, l, o)).join('');
  }

  const rect = (x, y, w, h, fill, rx, extra) =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${rx ? ` rx="${f(rx)}"` : ''} fill="${fill}"${extra || ''}/>`;

  /* ── Graphic styles ─────────────────────────────────────────
     Each draws into a w × h box using a palette p and a seeded
     random r. They work at any aspect ratio. */
  const STYLES = {
    orb(w, h, p, r) {
      const m = Math.min(w, h);
      const R = m * (0.36 + r() * 0.08);
      const cx = w * (0.42 + r() * 0.16), cy = h * (0.46 + r() * 0.1);
      const dx = R * (0.5 + r() * 0.3) * (r() > 0.5 ? 1 : -1), dy = R * (0.35 + r() * 0.3);
      return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="${p.a}"/>` +
        `<circle cx="${f(cx + dx)}" cy="${f(cy + dy)}" r="${f(R * 0.55)}" fill="${p.b}"/>` +
        `<circle cx="${f(cx - dx * 0.9)}" cy="${f(cy - dy * 1.1)}" r="${f(R * 0.78)}" fill="none" stroke="${p.ink}" stroke-width="${f(m * 0.006)}"/>`;
    },

    arcs(w, h, p, r) {
      const corner = Math.floor(r() * 4);
      const cx = corner % 2 ? w : 0, cy = corner > 1 ? h : 0;
      const n = 6 + Math.floor(r() * 3);
      const max = Math.hypot(w, h) * 0.92;
      const cols = [p.a, p.bg, p.b, p.bg, p.ink, p.bg];
      let s = '';
      for (let i = n; i >= 1; i--) s += `<circle cx="${cx}" cy="${cy}" r="${f(max * i / n)}" fill="${cols[(n - i) % cols.length]}"/>`;
      return s;
    },

    dots(w, h, p, r) {
      const m = Math.min(w, h), c = m / 11;
      const cols = Math.ceil(w / c), rows = Math.ceil(h / c);
      const ox = (w - cols * c) / 2 + c / 2, oy = (h - rows * c) / 2 + c / 2;
      const fx = w * (0.25 + r() * 0.5), fy = h * (0.25 + r() * 0.5);
      const maxd = Math.hypot(w, h) * 0.62;
      let s = '';
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const X = ox + x * c, Y = oy + y * c;
        const d = Math.hypot(X - fx, Y - fy) / maxd;
        const k = Math.max(0.07, 1 - d);
        s += `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(c * 0.5 * k)}" fill="${d < 0.17 ? p.a : p.ink}"/>`;
      }
      return s;
    },

    glyph(w, h, p, r, spec) {
      const ch = spec.glyph || String(spec.title || 'A').trim()[0] || 'A';
      const fs = Math.min(w * 1.55, h * 1.25);
      return `<circle cx="${f(w * (0.2 + r() * 0.6))}" cy="${f(h * (0.22 + r() * 0.3))}" r="${f(Math.min(w, h) * 0.2)}" fill="${p.b}"/>` +
        `<text x="${f(w / 2)}" y="${f(h / 2 + fs * 0.33)}" text-anchor="middle" font-family="${FONT.serif}" font-style="italic" font-size="${f(fs)}" fill="${p.a}">${esc(ch)}</text>`;
    },

    bands(w, h, p, r) {
      const cols = [p.a, p.b, p.ink, p.a, p.b];
      const amp = h * 0.05, ph = r() * 6.28, freq = 1 + r() * 1.2;
      let s = '';
      for (let i = 0; i < cols.length; i++) {
        const y0 = h * (0.2 + i * 0.165);
        let d = '';
        for (let x = 0; x <= 48; x++) {
          const Y = y0 + Math.sin(ph + i * 0.9 + (x / 48) * 6.28 * freq) * amp;
          d += `${x ? 'L' : 'M'}${f(w * x / 48)} ${f(Y)}`;
        }
        s += `<path d="${d}L${w} ${h}L0 ${h}Z" fill="${cols[i]}"/>`;
      }
      return s;
    },

    blocks(w, h, p, r) {
      const m = Math.min(w, h), cell = m / (3 + Math.floor(r() * 2));
      const cols = Math.max(2, Math.round(w / cell)), rows = Math.max(2, Math.round(h / cell));
      const cw = w / cols, ch = h / rows, fills = [p.a, p.b, p.ink];
      let s = '';
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = f(i * cw), y = f(j * ch), X = f(i * cw + cw), Y = f(j * ch + ch);
        const t = r(), col = fills[Math.floor(r() * 3)], k = Math.floor(r() * 4);
        const A = `A${f(cw)} ${f(ch)} 0 0 1`;
        if (t < 0.34) {
          const d = [
            `M${x} ${y}L${X} ${y}${A} ${x} ${Y}Z`,
            `M${X} ${y}L${X} ${Y}${A} ${x} ${y}Z`,
            `M${X} ${Y}L${x} ${Y}${A} ${X} ${y}Z`,
            `M${x} ${Y}L${x} ${y}${A} ${X} ${Y}Z`
          ][k];
          s += `<path d="${d}" fill="${col}"/>`;
        } else if (t < 0.52) {
          s += `<ellipse cx="${f(i * cw + cw / 2)}" cy="${f(j * ch + ch / 2)}" rx="${f(cw / 2)}" ry="${f(ch / 2)}" fill="${col}"/>`;
        } else if (t < 0.66) {
          s += rect(i * cw, j * ch, cw, ch, col);
        } else if (t < 0.82) {
          s += `<path d="M${x} ${Y}A${f(cw / 2)} ${f(ch)} 0 0 1 ${X} ${Y}Z" fill="${col}"/>`;
        }
      }
      return s;
    },

    rays(w, h, p, r) {
      const cx = w * (0.35 + r() * 0.3), cy = h * (0.55 + r() * 0.2);
      const n = 20 + 2 * Math.floor(r() * 5), R = Math.hypot(w, h);
      let s = '';
      for (let i = 0; i < n; i += 2) {
        const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
        s += `<path d="M${f(cx)} ${f(cy)}L${f(cx + R * Math.cos(a0))} ${f(cy + R * Math.sin(a0))}L${f(cx + R * Math.cos(a1))} ${f(cy + R * Math.sin(a1))}Z" fill="${p.a}"/>`;
      }
      return s + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(Math.min(w, h) * 0.18)}" fill="${p.b}"/>`;
    },

    lines(w, h, p, r, spec, id) {
      const m = Math.min(w, h), g = f(m / 20);
      const cx = w * (0.4 + r() * 0.2), cy = h * (0.45 + r() * 0.15), R = m * (0.3 + r() * 0.1);
      const pat = (n, rot, col) => `<pattern id="${id}${n}" width="${g * 2}" height="${g * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot})"><rect width="${g * 2}" height="${g}" fill="${col}"/></pattern>`;
      return `<defs>${pat('l', 35, p.ink)}${pat('m', -35, p.a)}</defs>` +
        rect(0, 0, w, h, `url(#${id}l)`) +
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="${p.bg}"/>` +
        `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="url(#${id}m)"/>`;
    }
  };

  /* ── Title fitting ─────────────────────────────────────────── */
  const TYPE = {
    serif: { cw: 0.43, lh: 0.94, font: 'serif', ls: '-0.01em' },
    sans:  { cw: 0.55, lh: 0.96, font: 'sans', weight: 600, ls: '-0.04em' },
    caps:  { cw: 0.66, lh: 0.92, font: 'sans', weight: 700, ls: '-0.03em', upper: true }
  };

  function balance(words, n) {
    const total = words.join(' ').length;
    const target = Math.max(total / n, Math.max.apply(null, words.map(w => w.length)));
    const lines = [];
    let cur = '';
    words.forEach(w => {
      if (cur && (cur + ' ' + w).length > target * 1.1 && lines.length < n - 1) { lines.push(cur); cur = w; }
      else cur = cur ? cur + ' ' + w : w;
    });
    lines.push(cur);
    return lines;
  }

  function fit(text, bw, bh, cfg) {
    const words = String(text).split(/\s+/);
    let best = null;
    for (let n = 1; n <= Math.min(4, words.length); n++) {
      const lines = balance(words, n);
      const longest = Math.max.apply(null, lines.map(l => l.length));
      const fs = Math.min(bw / (longest * cfg.cw), bh / (lines.length * cfg.lh));
      if (!best || fs > best.fs) best = { fs, lines };
    }
    return best;
  }

  /* ── Poster / campaign format ──────────────────────────────── */
  function poster(spec, w, h) {
    const p = PALETTES[spec.palette] || PALETTES.paper;
    const r = rng(spec.seed || spec.title || 'x');
    const id = 'art' + (++uid);
    const m = Math.min(w, h), pad = m * 0.065, ratio = w / h;
    const style = STYLES[spec.style] ? spec.style : 'orb';
    const cfg = TYPE[spec.type] || TYPE[['serif', 'sans', 'caps'][Math.floor(r() * 3)]];
    let layout = spec.layout || ['top', 'inset', 'bottom'][Math.floor(r() * 3)];
    if (ratio > 1.2) layout = 'side';

    let A, T; // art box and text box: [x, y, w, h]
    if (layout === 'side') {
      const aw = w * (ratio > 2.4 ? 0.46 : 0.54);
      A = [w - aw, 0, aw, h];
      T = [pad, pad, w - aw - pad * 2, h - pad * 2];
    } else if (layout === 'top') {
      const ah = h * 0.64;
      A = [0, 0, w, ah];
      T = [pad, ah + pad * 0.7, w - pad * 2, h - ah - pad * 1.7];
    } else if (layout === 'inset') {
      const ah = h * 0.6;
      A = [pad, pad, w - pad * 2, ah];
      T = [pad, pad + ah + pad * 0.7, w - pad * 2, h - ah - pad * 2.7];
    } else {
      const th = h * 0.3;
      T = [pad, pad, w - pad * 2, th];
      A = [0, th + pad * 1.6, w, h - th - pad * 1.6];
    }

    const art = `<svg x="${f(A[0])}" y="${f(A[1])}" width="${f(A[2])}" height="${f(A[3])}" viewBox="0 0 ${f(A[2])} ${f(A[3])}">` +
      STYLES[style](A[2], A[3], p, r, spec, id) + '</svg>';

    const metaFs = Math.max(m * 0.027, 6);
    const tx = T[0], ty = T[1], tw = T[2], th = T[3];
    let s = txt(tx, ty + metaFs, String(spec.client || '').toUpperCase(), { font: 'mono', size: metaFs, ls: '0.08em', fill: p.ink }) +
      txt(tx + tw, ty + metaFs, spec.year || '', { font: 'mono', size: metaFs, ls: '0.08em', fill: p.ink, anchor: 'end' }) +
      `<line x1="${f(tx)}" x2="${f(tx + tw)}" y1="${f(ty + metaFs * 1.9)}" y2="${f(ty + metaFs * 1.9)}" stroke="${p.ink}" stroke-width="${f(Math.max(m * 0.003, 0.6))}"/>`;

    const title = cfg.upper ? String(spec.title || '').toUpperCase() : String(spec.title || '');
    const boxTop = ty + metaFs * 3, boxH = th - metaFs * 3;
    const fitted = fit(title, tw, boxH, cfg);
    const fs = Math.min(fitted.fs, m * 0.24);
    const bottom = ty + th - fs * 0.06;
    fitted.lines.forEach((line, i) => {
      const y = bottom - (fitted.lines.length - 1 - i) * fs * cfg.lh;
      s += txt(tx, Math.max(y, boxTop + fs * 0.8), line, { font: cfg.font, size: fs, weight: cfg.weight, ls: cfg.ls, fill: p.ink });
    });

    return `<svg class="art" viewBox="0 0 ${f(w)} ${f(h)}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(spec.title)}${spec.client ? ', ' + esc(spec.client) : ''}">` +
      rect(0, 0, w, h, p.bg) + art + s + '</svg>';
  }

  /* ── Product silhouettes for A+ modules ────────────────────── */
  function product(kind, cx, base, H, c, brand) {
    let s = `<ellipse cx="${f(cx)}" cy="${f(base)}" rx="${f(H * 0.32)}" ry="${f(H * 0.035)}" fill="${c.ink}" opacity=".16"/>`;
    let lx, ly, lw, lh;
    if (kind === 'jar') {
      const bw = H * 0.66, bh = H * 0.5, x = cx - bw / 2, y = base - bh;
      s += rect(x, y, bw, bh, c.body, bw * 0.1) + rect(cx - bw * 0.53, y - H * 0.15, bw * 1.06, H * 0.19, c.cap, H * 0.03);
      lx = x; ly = y + bh * 0.3; lw = bw; lh = bh * 0.45;
    } else if (kind === 'can') {
      const bw = H * 0.38, bh = H * 0.84, x = cx - bw / 2, y = base - bh;
      s += rect(x, y, bw, bh, c.body, bw * 0.14) + rect(cx - bw * 0.36, y - H * 0.1, bw * 0.72, H * 0.13, c.cap, H * 0.025);
      lx = x; ly = y + bh * 0.34; lw = bw; lh = bh * 0.3;
    } else if (kind === 'pouch') {
      const bw = H * 0.6, bh = H * 0.86, x = cx - bw / 2, y = base - bh;
      s += `<path d="M${f(x + bw * 0.07)} ${f(y)}H${f(x + bw * 0.93)}L${f(x + bw)} ${f(base - bh * 0.06)}Q${f(x + bw)} ${f(base)} ${f(x + bw * 0.9)} ${f(base)}H${f(x + bw * 0.1)}Q${f(x)} ${f(base)} ${f(x)} ${f(base - bh * 0.06)}Z" fill="${c.body}"/>` +
        rect(x + bw * 0.07, y, bw * 0.86, bh * 0.07, c.cap);
      lx = x + bw * 0.16; ly = y + bh * 0.3; lw = bw * 0.68; lh = bh * 0.38;
    } else {
      const bw = H * 0.34, bh = H * 0.62, x = cx - bw / 2, y = base - bh;
      s += rect(x, y, bw, bh, c.body, bw * 0.16) +
        rect(cx - bw * 0.2, y - H * 0.07, bw * 0.4, H * 0.1, c.body, 2) +
        rect(cx - bw * 0.27, y - H * 0.31, bw * 0.54, H * 0.25, c.cap, bw * 0.1);
      lx = x; ly = y + bh * 0.3; lw = bw; lh = bh * 0.42;
    }
    s += rect(lx, ly, lw, lh, c.label);
    if (brand) s += txt(lx + lw / 2, ly + lh / 2 + H * 0.022, String(brand).split(' ')[0], { font: 'serif', size: H * 0.07, anchor: 'middle', fill: c.ink });
    return s;
  }

  /* ── A+ modules (970 px wide, like a marketplace content block) ── */
  const W = 970;

  function aplusModule(pr, type, idx) {
    const p = PALETTES[pr.palette] || PALETTES.apricot;
    const c = pr.copy || {}, kind = pr.product || 'bottle';
    const base = { body: p.a, label: p.bg, cap: p.ink, ink: p.ink };
    const id = 'art' + (++uid);
    let H = 300, s = '';

    if (type === 'hero') {
      H = 600;
      s = rect(0, 0, W, H, p.bg) + `<circle cx="700" cy="310" r="235" fill="${p.b}"/>` +
        product(kind, 700, 505, 390, base, pr.brand) +
        txt(64, 150, String(pr.brand || '').toUpperCase(), { font: 'mono', size: 14, ls: '0.12em', fill: p.ink });
      const head = wrap(c.headline, 15);
      head.forEach((l, i) => { s += txt(64, 236 + i * 66, l, { font: 'serif', size: 66, ls: '-0.015em', fill: p.ink }); });
      const subY = 236 + (head.length - 1) * 66 + 52;
      const sub = wrap(c.sub, 40);
      s += para(64, subY, c.sub, 40, 28, { size: 19, fill: p.ink, opacity: 0.72 });
      if (c.badge) {
        const by = subY + (sub.length - 1) * 28 + 34, bw = c.badge.length * 8.4 + 40;
        s += rect(64, by, bw, 38, 'none', 19, ` stroke="${p.ink}" stroke-width="1.2"`) +
          txt(64 + bw / 2, by + 24.5, c.badge, { size: 14.5, weight: 500, anchor: 'middle', fill: p.ink });
      }
    } else if (type === 'features') {
      H = 330;
      s = rect(0, 0, W, H, p.ink);
      (c.features || []).slice(0, 3).forEach((ft, i) => {
        const x = 64 + i * 290;
        s += `<circle cx="${x + 24}" cy="86" r="24" fill="${p.a}"/>`;
        s += i === 0 ? `<circle cx="${x + 24}" cy="86" r="8" fill="${p.ink}"/>`
          : i === 1 ? `<rect x="${x + 16}" y="78" width="16" height="16" fill="${p.ink}" transform="rotate(45 ${x + 24} 86)"/>`
          : `<circle cx="${x + 24}" cy="86" r="10" fill="none" stroke="${p.ink}" stroke-width="4"/>`;
        s += txt(x, 164, ft[0], { font: 'serif', size: 31, fill: p.bg }) +
          para(x, 196, ft[1], 30, 22, { size: 15, fill: p.bg, opacity: 0.7 });
      });
    } else if (type === 'split') {
      H = 460;
      const flip = idx % 2 === 1, ax = flip ? 485 : 0, tx = flip ? 64 : 549;
      const alt = { bg: p.a, ink: p.ink, a: p.bg, b: p.b };
      const st = STYLES[pr.style] ? pr.style : 'arcs';
      const story = c.story || {};
      s = rect(0, 0, W, H, p.bg) +
        `<svg x="${ax}" y="0" width="485" height="${H}" viewBox="0 0 485 ${H}">` + rect(0, 0, 485, H, p.a) +
        STYLES[st](485, H, alt, rng(pr.title + idx), {}, id) +
        product(kind, 242, 402, 300, { body: p.bg, label: p.a, cap: p.ink, ink: p.ink }, pr.brand) + '</svg>';
      const head = wrap(story.head, 17);
      head.forEach((l, i) => { s += txt(tx, 150 + i * 46, l, { font: 'serif', size: 45, ls: '-0.01em', fill: p.ink }); });
      s += para(tx, 150 + (head.length - 1) * 46 + 48, story.body, 42, 26, { size: 16.5, fill: p.ink, opacity: 0.74 });
    } else if (type === 'banner') {
      H = 230;
      const lines = wrap(c.statement, 40);
      s = rect(0, 0, W, H, p.a);
      const y0 = H / 2 + 14 - (lines.length - 1) * 27;
      lines.forEach((l, i) => { s += txt(W / 2, y0 + i * 54, l, { font: 'serif', italic: true, size: 52, anchor: 'middle', fill: p.bg }); });
    } else if (type === 'compare') {
      H = 480;
      const cmp = c.compare || { cols: [], rows: [] };
      const X = [470, 650, 830], bodies = [p.a, p.b, p.ink];
      s = rect(0, 0, W, H, p.bg) + txt(64, 86, cmp.title || 'Compare', { font: 'serif', size: 40, fill: p.ink }) +
        rect(380, 118, 180, 330, p.ink, 16, ' opacity=".06"');
      cmp.cols.slice(0, 3).forEach((name, i) => {
        s += product(kind, X[i], 236, 96, { body: bodies[i], label: p.bg, cap: i === 2 ? p.a : p.ink, ink: p.ink }) +
          txt(X[i], 272, name, { size: 15, weight: 600, anchor: 'middle', fill: p.ink });
      });
      cmp.rows.slice(0, 4).forEach((row, j) => {
        const y = 322 + j * 38;
        s += `<line x1="64" x2="906" y1="${y - 24}" y2="${y - 24}" stroke="${p.ink}" opacity=".14"/>` +
          txt(64, y, row[0], { size: 15, fill: p.ink, opacity: 0.82 });
        X.forEach((x, i) => {
          s += row[i + 1]
            ? `<circle cx="${x}" cy="${y - 5}" r="9.5" fill="${p.a}"/><path d="M${x - 4.5} ${y - 5}l3.2 3.4 5.6-6.4" fill="none" stroke="${p.bg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<line x1="${x - 6}" x2="${x + 6}" y1="${y - 5}" y2="${y - 5}" stroke="${p.ink}" opacity=".35" stroke-width="1.5"/>`;
        });
      });
    } else if (type === 'steps') {
      H = 320;
      s = rect(0, 0, W, H, p.bg) + rect(0, 0, W, H, p.ink, 0, ' opacity=".05"') +
        txt(64, 66, String(c.stepsTitle || 'How to use').toUpperCase(), { font: 'mono', size: 13, ls: '0.12em', fill: p.ink, opacity: 0.7 });
      (c.steps || []).slice(0, 3).forEach((st, i) => {
        const x = 64 + i * 290;
        s += txt(x, 164, '0' + (i + 1), { font: 'serif', italic: true, size: 84, fill: p.a }) +
          txt(x, 208, st[0], { size: 19, weight: 600, fill: p.ink }) +
          para(x, 236, st[1], 30, 22, { size: 15, fill: p.ink, opacity: 0.72 });
      });
    }

    return `<svg class="mod" viewBox="0 0 ${W} ${H}" style="aspect-ratio:${W}/${H}" role="img" aria-label="${esc(pr.brand)} ${esc(type)} module">${s}</svg>`;
  }

  const DEFAULT_MODULES = ['hero', 'features', 'split', 'banner', 'compare', 'steps'];
  function aplusModules(pr) {
    return (pr.layout || DEFAULT_MODULES).map((t, i) => aplusModule(pr, t, i));
  }

  window.Art = { poster, aplusModules, MODULES: DEFAULT_MODULES, esc, PALETTES, STYLES: Object.keys(STYLES) };
})();
