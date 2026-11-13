/* ==========================================================================
   Yeabkal Dereje — portfolio · vanilla JS, no dependencies
   Sections: helpers · theme · clock · nav · hero field · text effects ·
             work render · lightbox · command palette · cursor · reveal
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const EMAIL = 'ydereje1@gmail.com';
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const WORKS = window.WORKS || [];
  const PROJECTS = window.PROJECTS || [];
  const CAT = { social: 'Social media', brand: 'Branding & logos', print: 'Print & posters', apparel: 'Apparel' };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const themeColor = $('meta[name="theme-color"]');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeColor) themeColor.setAttribute('content', t === 'light' ? '#f6f4ef' : '#08080a');
    document.dispatchEvent(new CustomEvent('themechange'));
  }
  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next); store.set('theme', next);
  }
  applyTheme(root.getAttribute('data-theme') || 'dark');
  $('#theme-btn').addEventListener('click', toggleTheme);
  $('#kbd-hint').textContent = isMac ? '⌘ K' : 'Ctrl K';

  /* ---------- clock (Addis Ababa) ---------- */
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Addis_Ababa', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => { const t = fmt.format(new Date()); $('#clock').textContent = t; $('#clock2').textContent = t; };
  tick(); setInterval(tick, 15000);
  $('#year').textContent = new Date().getFullYear();

  /* ---------- nav: progress, active link, mobile menu ---------- */
  const progress = $('#progress');
  let raf = 0;
  const onScroll = () => {
    raf = 0;
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  const links = $$('.nav-links a');
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.removeAttribute('aria-current'));
      const a = links.find(l => l.getAttribute('href') === '#' + e.target.id);
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'about', 'experience', 'services', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) sectionIO.observe(el); });

  const menuBtn = $('#menu-btn');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- hero: interactive dot field ---------- */
  (function field() {
    const c = $('#field'); if (!c) return;
    const ctx = c.getContext('2d');
    let w = 0, h = 0, dpr = 1, gap = 28, cols = 0, rows = 0, palette = [];
    let px = -1e4, py = -1e4, mx = 0, my = 0, lastMove = -1e9, visible = true, rafId = 0;
    const t0 = performance.now();

    const hex = s => { s = s.trim().replace('#', ''); if (s.length === 3) s = [...s].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)); };
    const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    function buildPalette() {
      const cs = getComputedStyle(root);
      const A = hex(cs.getPropertyValue('--blue')), B = hex(cs.getPropertyValue('--orange')), C = hex(cs.getPropertyValue('--pink'));
      palette = Array.from({ length: 48 }, (_, i) => {
        const t = i / 47; const col = t < .6 ? mix(A, B, t / .6) : mix(B, C, (t - .6) / .4);
        return `rgb(${col[0]},${col[1]},${col[2]})`;
      });
    }
    function resize() {
      const r = c.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2); w = r.width; h = r.height;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 600 ? 22 : 28; cols = Math.ceil(w / gap) + 1; rows = Math.ceil(h / gap) + 1;
      if (px < -9e3) { mx = w * .7; my = h * .4; }
    }
    function draw(now) {
      const t = (now - t0) / 1000;
      const idle = now - lastMove > 2500;
      const tx = idle ? w * (.62 + .28 * Math.sin(t * .45)) : px;
      const ty = idle ? h * (.48 + .3 * Math.sin(t * .31 + 1)) : py;
      mx += (tx - mx) * .07; my += (ty - my) * .07;
      const R = Math.max(150, Math.min(w, h) * .26);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < cols; i++) {
        ctx.fillStyle = palette[Math.min(47, Math.floor(i / cols * 48))];
        for (let j = 0; j < rows; j++) {
          const x = i * gap, y = j * gap;
          const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
          let f = Math.max(0, 1 - d / R); f = f * f * (3 - 2 * f);
          const wave = Math.sin(x * .011 + y * .007 + t * 1.1) * .5 + .5;
          const push = f * 16, k = d > 0.001 ? push / d : 0;
          ctx.globalAlpha = Math.min(1, .16 + wave * .12 + f * .75);
          ctx.beginPath();
          ctx.arc(x + dx * k, y + dy * k, .9 + wave * .35 + f * 3.1, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function loop(now) { draw(now); rafId = visible ? requestAnimationFrame(loop) : 0; }
    buildPalette(); resize();
    new ResizeObserver(resize).observe(c);
    document.addEventListener('themechange', () => { buildPalette(); if (reduced) draw(performance.now()); });
    if (reduced) { draw(performance.now()); return; }
    addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; lastMove = performance.now();
    }, { passive: true });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !rafId) rafId = requestAnimationFrame(loop); }).observe(c);
    rafId = requestAnimationFrame(loop);

    /* gentle tilt on the code card */
    const card = $('#codecard');
    if (card && finePointer) {
      const hero = card.closest('.hero');
      hero.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / innerWidth, ny = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        card.style.setProperty('--rx', (nx * 10).toFixed(2)); card.style.setProperty('--ry', (ny * 8).toFixed(2));
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { card.style.setProperty('--rx', 0); card.style.setProperty('--ry', 0); });
    }
  })();

  /* ---------- text effects ---------- */
  (function roleScramble() {
    const el = $('#role'); if (!el) return;
    const roles = ['Graphic Designer', 'UI/UX Designer', 'Brand Identity Specialist', 'Print Designer'];
    if (reduced) { el.textContent = roles.join(' · '); return; }
    const glyphs = '!<>-_\\/[]{}=+*^?#01';
    let i = 0, token = 0;
    function scramble(to) {
      const from = el.textContent, len = Math.max(from.length, to.length), me = ++token;
      const q = Array.from({ length: len }, (_, n) => ({ to: to[n] || '', start: Math.floor(Math.random() * 14), end: 14 + Math.floor(Math.random() * 16), ch: '' }));
      let frame = 0;
      (function step() {
        if (me !== token) return;
        let out = '', done = 0;
        q.forEach(o => {
          if (frame >= o.end) { done++; out += o.to; }
          else if (frame >= o.start) { if (!o.ch || Math.random() < .3) o.ch = glyphs[Math.floor(Math.random() * glyphs.length)]; out += o.ch; }
          else out += from[q.indexOf(o)] || '';
        });
        el.textContent = out; frame++;
        if (done < len) requestAnimationFrame(step);
      })();
    }
    setInterval(() => { i = (i + 1) % roles.length; scramble(roles[i]); }, 2800);
  })();

  (function commitHashes() {
    const hash = s => { let h = 0x811c9dc5; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0').slice(0, 7); };
    $$('.commit').forEach(c => { const el = $('.hash', c); if (el) el.textContent = 'commit ' + hash(c.dataset.seed || c.textContent); });
  })();

  /* ---------- reveal on scroll + counters ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  const watchReveal = () => $$('.reveal:not(.in)').forEach(el => reduced ? el.classList.add('in') : io.observe(el));

  const countEls = $$('[data-count]');
  const wc = $('#works-count'); if (wc) { wc.dataset.count = WORKS.length; wc.textContent = WORKS.length; }
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return; countIO.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      if (reduced) { el.textContent = end + suf; return; }
      const t0 = performance.now(), dur = 1400;
      (function step(now) {
        const p = Math.min(1, (now - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + suf; if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: .6 });
  countEls.forEach(el => countIO.observe(el));

  /* ---------- work: featured cases + archive grid ---------- */
  const src = (w, s) => `assets/img/work/${w.f}-${s}.webp`;
  const casesEl = $('#cases'), gridEl = $('#grid'), filtersEl = $('#filters');

  casesEl.innerHTML = PROJECTS.map((p, n) => {
    const items = WORKS.filter(w => w.p === p.id);
    return `<article class="case reveal">
      <div>
        <span class="case-idx">${String(n + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}</span>
        <h3>${esc(p.name)}</h3>
        <p class="case-kind">${esc(p.kind)}</p>
        <p class="blurb">${esc(p.blurb)}</p>
        <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        <button type="button" class="btn btn-ghost btn-sm case-open" data-project="${p.id}">View ${items.length} pieces
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></button>
      </div>
      <div class="strip" data-strip="${p.id}" role="group" aria-label="${esc(p.name)} work">
        ${items.map((w, i) => `<button type="button" data-cursor="View" data-i="${i}" aria-label="Open ${esc(w.t)}"><img src="${src(w, 'sm')}" width="${w.w}" height="${w.h}" alt="${esc(w.a)}" loading="lazy" decoding="async" draggable="false"></button>`).join('')}
      </div>
    </article>`;
  }).join('');

  const cats = ['all', ...['social', 'brand', 'print', 'apparel'].filter(c => WORKS.some(w => w.c === c))];
  const labels = { all: 'All', social: 'Social', brand: 'Branding', print: 'Print', apparel: 'Apparel' };
  filtersEl.innerHTML = cats.map(c => {
    const n = c === 'all' ? WORKS.length : WORKS.filter(w => w.c === c).length;
    return `<button type="button" class="chip" data-filter="${c}" aria-pressed="${c === 'all'}">${labels[c]}<sup>${n}</sup></button>`;
  }).join('');

  gridEl.innerHTML = WORKS.map((w, i) => `<button type="button" class="card" data-cat="${w.c}" data-i="${i}" data-cursor="View" aria-label="Open ${esc(w.t)}">
      <img src="${src(w, 'sm')}" width="${w.w}" height="${w.h}" alt="${esc(w.a)}" loading="lazy" decoding="async">
      <span class="cap"><b>${esc(w.t)}</b><small>${CAT[w.c]}</small></span></button>`).join('');

  let currentFilter = 'all';
  function setFilter(f) {
    currentFilter = f;
    $$('.chip', filtersEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
    $$('.card', gridEl).forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      if (show) { card.classList.remove('hide'); requestAnimationFrame(() => card.classList.remove('fade')); }
      else { card.classList.add('fade'); setTimeout(() => { if (card.classList.contains('fade')) card.classList.add('hide'); }, 320); }
    });
  }
  filtersEl.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) setFilter(b.dataset.filter); });
  const visibleWorks = () => WORKS.filter(w => currentFilter === 'all' || w.c === currentFilter);

  gridEl.addEventListener('click', e => {
    const card = e.target.closest('.card'); if (!card) return;
    const w = WORKS[+card.dataset.i]; const list = visibleWorks();
    openLightbox(list, list.indexOf(w));
  });
  casesEl.addEventListener('click', e => {
    if (strips.moved) { strips.moved = false; return; }
    const open = e.target.closest('[data-project]');
    const thumb = e.target.closest('.strip button');
    const id = open ? open.dataset.project : thumb && thumb.closest('.strip').dataset.strip;
    if (!id) return;
    openLightbox(WORKS.filter(w => w.p === id), thumb ? +thumb.dataset.i : 0);
  });

  /* drag-to-scroll for the project strips (mouse only; touch scrolls natively) */
  const strips = { moved: false };
  $$('.strip').forEach(s => {
    let down = false, sx = 0, sl = 0;
    s.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; strips.moved = false; sx = e.clientX; sl = s.scrollLeft; });
    addEventListener('pointermove', e => {
      if (!down) return; const dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { strips.moved = true; s.classList.add('dragging'); }
      if (strips.moved) s.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => { down = false; s.classList.remove('dragging'); setTimeout(() => { strips.moved = false; }, 0); });
  });

  watchReveal();

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox'), lbImg = $('#lb-img');
  let list = [], idx = 0;
  function showLb(i) {
    idx = (i + list.length) % list.length; const w = list[idx];
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
    lbImg.src = src(w, 'lg'); lbImg.alt = w.a;
    $('#lb-title').textContent = w.t;
    const proj = PROJECTS.find(p => p.id === w.p);
    $('#lb-sub').textContent = CAT[w.c] + (proj ? ' · ' + proj.name : '');
    $('#lb-count').textContent = `${idx + 1} / ${list.length}`;
    [idx - 1, idx + 1].forEach(n => { const nb = list[(n + list.length) % list.length]; if (nb) new Image().src = src(nb, 'lg'); });
  }
  function openLightbox(l, i) { list = l; lb.showModal(); document.documentElement.style.overflow = 'hidden'; showLb(Math.max(0, i)); }
  lb.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
  $('#lb-close').addEventListener('click', () => lb.close());
  $('#lb-prev').addEventListener('click', () => showLb(idx - 1));
  $('#lb-next').addEventListener('click', () => showLb(idx + 1));
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') showLb(idx - 1); else if (e.key === 'ArrowRight') showLb(idx + 1);
  });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) lb.close(); });
  let tx0 = 0;
  lb.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx0; if (Math.abs(dx) > 50) showLb(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- copy email ---------- */
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); toast('Email copied to clipboard'); }
    catch (e) { location.href = 'mailto:' + EMAIL; }
  }
  $('#copy-mail').addEventListener('click', copyEmail);

  /* ---------- order / contact form (FormSubmit, no account needed) ---------- */
  const order = $('#order');
  if (order) order.addEventListener('submit', async e => {
    e.preventDefault();
    const st = $('#order-status'), btn = $('#order-send');
    if (order.elements._honey.value) return;               // spam trap
    if (!order.checkValidity()) { order.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(order)); delete data._honey;
    const mailto = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Project request: ' + data.need) +
      '&body=' + encodeURIComponent(data.message + '\n\n' + data.name + '\n' + data.email);
    btn.disabled = true; st.textContent = 'Sending…';
    try {
      const r = await fetch('https://formsubmit.co/ajax/' + EMAIL, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: 'Portfolio request: ' + data.need, _captcha: 'false', _template: 'table' })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === 'false' || j.success === false) throw new Error('send failed');
      order.reset(); st.textContent = 'Thank you. Your request is sent and I will reply by email.'; toast('Request sent');
    } catch (err) {
      st.innerHTML = 'It could not be sent from here. <a href="' + mailto + '">Email me instead</a>.';
    } finally { btn.disabled = false; }
  });

  /* ---------- client logos (hidden until logos are added in works.js) ---------- */
  const CL = window.CLIENTS || [], clBox = $('#clients'), clRow = $('#clients-row');
  if (CL.length && clBox && clRow) {
    clRow.innerHTML = CL.map(c => '<li><img src="assets/img/clients/' + c.f + '" alt="' + c.n + '" loading="lazy" decoding="async"></li>').join('');
    clBox.hidden = false;
  }

  /* ---------- command palette ---------- */
  const pal = $('#palette'), palQ = $('#pal-q'), palList = $('#pal-list');
  const go = id => () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };
  const cmds = [
    { g: 'Navigate', t: 'Selected work', run: go('work') },
    { g: 'Navigate', t: 'About', run: go('about') },
    { g: 'Navigate', t: 'Experience', run: go('experience') },
    { g: 'Navigate', t: 'Services', run: go('services') },
    { g: 'Navigate', t: 'Contact', run: go('contact') },
    ...(WORKS.some(w => w.c === 'brand') ? [{ g: 'Archive', t: 'Show only branding & logos', run: () => { go('grid')(); setFilter('brand'); } }] : []),
    { g: 'Archive', t: 'Show only social media', run: () => { go('grid')(); setFilter('social'); } },
    { g: 'Archive', t: 'Show only print & posters', run: () => { go('grid')(); setFilter('print'); } },
    { g: 'Archive', t: 'Show everything', run: () => { go('grid')(); setFilter('all'); } },
    { g: 'Actions', t: 'Copy email address', hint: EMAIL, run: copyEmail },
    { g: 'Actions', t: 'Download CV (PDF)', run: () => { const a = document.createElement('a'); a.href = 'assets/Yeabkal_Dereje_CV.pdf'; a.download = ''; a.click(); } },
    { g: 'Actions', t: 'Toggle light / dark theme', run: toggleTheme },
    { g: 'Links', t: 'Open Telegram', run: () => open('https://t.me/qencreatives', '_blank', 'noopener') },
    { g: 'Links', t: 'Open Instagram', run: () => open('https://www.instagram.com/qen_creatives/', '_blank', 'noopener') },
    { g: 'Links', t: 'Open LinkedIn', run: () => open('https://www.linkedin.com/in/yeabkal-dereje-082b32408/', '_blank', 'noopener') },
    { g: 'Links', t: 'View source on GitHub', run: () => open('https://github.com/yeabkaldereje/portfolio', '_blank', 'noopener') }
  ];
  let shown = [], sel = 0;
  function renderPal() {
    const q = palQ.value.trim().toLowerCase();
    shown = cmds.filter(c => !q || (c.t + ' ' + c.g).toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    let last = '', html = '';
    shown.forEach((c, i) => {
      if (c.g !== last) { html += `<div class="pal-group" role="presentation">${c.g}</div>`; last = c.g; }
      html += `<button type="button" class="pal-item" role="option" id="po-${i}" data-i="${i}" aria-selected="${i === sel}">${esc(c.t)}<small>${esc(c.hint || '')}</small></button>`;
    });
    palList.innerHTML = html || '<div class="pal-empty">Nothing matches that.</div>';
    const cur = $('[aria-selected="true"]', palList); if (cur) { cur.scrollIntoView({ block: 'nearest' }); palQ.setAttribute('aria-activedescendant', cur.id); }
  }
  function openPal() { if (pal.open) return; palQ.value = ''; sel = 0; renderPal(); pal.showModal(); palQ.focus(); }
  function runSel(i) { const c = shown[i]; if (!c) return; pal.close(); setTimeout(c.run, 60); }
  palQ.addEventListener('input', () => { sel = 0; renderPal(); });
  palQ.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); renderPal(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); renderPal(); }
    else if (e.key === 'Enter') { e.preventDefault(); runSel(sel); }
  });
  palList.addEventListener('click', e => { const b = e.target.closest('.pal-item'); if (b) runSel(+b.dataset.i); });
  palList.addEventListener('pointermove', e => { const b = e.target.closest('.pal-item'); if (b && +b.dataset.i !== sel) { sel = +b.dataset.i; $$('.pal-item', palList).forEach((x, n) => x.setAttribute('aria-selected', String(n === sel))); } });
  pal.addEventListener('click', e => { if (e.target === pal) pal.close(); });
  $('#cmdk-btn').addEventListener('click', openPal);
  addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPal(); }
    else if (e.key === '/' && !typing && !lb.open) { e.preventDefault(); openPal(); }
  });

  /* ---------- cursor ring + magnetic buttons (fine pointers only) ---------- */
  if (finePointer && !reduced) {
    const cur = $('#cursor'), label = $('span', cur);
    let x = 0, y = 0, cx = 0, cy = 0, started = false;
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (!started) { started = true; cx = x; cy = y; cur.classList.add('on'); requestAnimationFrame(move); }
    }, { passive: true });
    function move() { cx += (x - cx) * .22; cy += (y - cy) * .22; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(move); }
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('a, button, input, [data-cursor]');
      const txt = t && t.closest('[data-cursor]') ? t.closest('[data-cursor]').dataset.cursor : '';
      cur.classList.toggle('hover', !!t); cur.classList.toggle('label', !!txt); label.textContent = txt;
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    document.addEventListener('pointerenter', () => started && cur.classList.add('on'));

    $$('[data-magnet]').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 14}px, ${((e.clientY - r.top) / r.height - .5) * 10}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }
})();
