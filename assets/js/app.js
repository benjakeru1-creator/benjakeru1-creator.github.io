/* ══════════════════════════════════════════════════════════════════
   王成 — portfolio  ·  vanilla JS, no dependencies
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const D = window.PORTFOLIO;
  const META = D.meta;
  const PROJECTS = D.projects;
  const CATS = D.cats;
  const CATMAP = Object.fromEntries(CATS.map(c => [c.id, c]));

  // cover media index per project (hand-picked strongest frame)
  const COVERS = { tea: 1, mushroom: 0, bayou: 0, dragon: 0, jiang: 0, guhuo: 0, memory: 0,
    baiyao: 0, chiwei: 0, esports: 0, jiangnan: 0, adaslab: 0, 'logo-motion': 0, wansu: 0,
    'tea-film': 0, short40: 0, skyforge: 0, mapping: 0, xiaoyexing: 0 };

  const HERO = ['tea', 'guhuo', 'xiaoyexing', 'skyforge', 'mapping', 'bayou'];
  const SUB = {
    xiaoyexing: 'AI 情绪陪伴 · 11 屏界面',
    tea: '非遗桂花乌龙 · 包装系统',
    mushroom: '川味零食 · 货架包装',
    bayou: '冻粑风味 · 四位角色',
    dragon: '自贡灯会 · 龙年 IP',
    jiang: '广元三国 · 五位潮玩',
    guhuo: '傩戏 · 英歌舞 · 醒狮',
    memory: '复古报纸 · 童年记忆',
    baiyao: '口腔健康 · 谐音创意',
    chiwei: '情绪海报 · 品牌语气',
    esports: '文旅电竞 · 整套物料',
    jiangnan: '水墨江南 · 数字绘画',
    adaslab: '智能装备 · 标志系统',
    'logo-motion': '镀铬标志 · 三维演绎',
    wansu: '茶山叙事 · 品牌短片',
    'tea-film': 'AI 影像 · 食欲表达',
    short40: '城市独处 · 40 秒',
    skyforge: '三维展厅 · 交互叙事',
    mapping: '投影柱 · 沉浸现场'
  };
  const REEL_A = ['tea-film', 'guhuo', 'memory', 'skyforge', 'jiang', 'esports', 'logo-motion', 'bayou', 'baiyao', 'mapping'];
  const REEL_B = ['chiwei', 'mushroom', 'xiaoyexing', 'dragon', 'jiangnan', 'wansu', 'adaslab', 'tea', 'short40', 'tea'];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad2 = n => String(n).padStart(2, '0');
  const byId = id => PROJECTS.find(p => p.id === id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const cover = p => p.media[COVERS[p.id] ?? 0] || p.media[0];
  const thumbOf = m => m.type === 'video' ? m.poster : m.src;
  const catZh = p => (CATMAP[p.cat] || {}).zh || '作品';

  /* ── loader ───────────────────────────────────────────────────── */
  function initLoader() {
    const loader = $('#loader');
    const count = $('[data-loader-count]');
    const bar = $('[data-loader-bar]');
    const word = $('[data-loader-word]');
    if (word) {
      const txt = word.textContent.trim() || '视觉传达';
      word.innerHTML = '';
      [...txt].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.animationDelay = (i * 0.07) + 's';
        word.appendChild(s);
      });
    }
    let v = 0, raf;
    const t0 = performance.now();
    const dur = reduced ? 200 : 1150;
    function step(t) {
      const k = clamp((t - t0) / dur, 0, 1);
      v = Math.round(k * 100);
      if (count) count.textContent = pad2(v);
      if (bar) bar.style.transform = `scaleX(${k})`;
      if (k < 1) raf = requestAnimationFrame(step);
      else finish();
    }
    function finish() {
      loader.classList.add('is-done');
      document.body.classList.add('is-ready');
      setTimeout(() => { loader.style.display = 'none'; }, 1200);
      document.dispatchEvent(new CustomEvent('reveal'));
    }
    raf = requestAnimationFrame(step);
  }

  /* ── reveal on scroll ─────────────────────────────────────────── */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    $$('[data-anim]').forEach(el => io.observe(el));
    $$('.display').forEach(el => io.observe(el));
    $$('.reveal').forEach(el => io.observe(el));
    $$('.wrow').forEach(el => io.observe(el));
    $$('.secthead').forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }

  /* ── counters ─────────────────────────────────────────────────── */
  function initCounters() {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        const target = +el.dataset.count;
        const t0 = performance.now();
        (function tick(t) {
          const k = clamp((t - t0) / 1400, 0, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.4 });
    $$('[data-count]').forEach(el => io.observe(el));
  }

  /* ── scrub paragraph ──────────────────────────────────────────── */
  const scrubEls = [];
  function initScrub() {
    $$('[data-scrub]').forEach(el => scrubEls.push(el));
  }
  function updateScrub() {
    const vh = window.innerHeight;
    scrubEls.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = clamp((vh * 0.86 - r.top) / (r.height + vh * 0.28), 0, 1);
      el.style.setProperty('--p', (p * 100).toFixed(2) + '%');
    });
  }

  /* ── clock / nav / scroll ui ──────────────────────────────────── */
  function initChrome() {
    const clock = $('#clock');
    const tick = () => {
      const d = new Date();
      if (clock) clock.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    };
    tick(); setInterval(tick, 15000);

    const nav = $('#nav');
    const bands = $$('.band, footer.band');
    const line = $('.scrollline');
    const heroCycler = $('#cycler');

    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (line) line.style.setProperty('--sp', (h > 0 ? y / h : 0).toFixed(4));
      nav.classList.toggle('is-scrolled', y > 30);

      // which band is under the nav bar?
      let scheme = 's1';
      for (const b of bands) {
        const r = b.getBoundingClientRect();
        if (r.top <= 40 && r.bottom > 40) {
          scheme = b.classList.contains('band--ink') ? 's2' : 's1';
        }
      }
      nav.classList.toggle('scheme-s2', scheme === 's2');
      nav.classList.toggle('scheme-s1', scheme === 's1');

      if (heroCycler && y < window.innerHeight) {
        heroCycler.style.transform = `translateY(${(y * 0.045).toFixed(2)}px)`;
      }
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // mobile menu
    const btn = $('#menuBtn');
    let mmenu = null;
    function buildMenu() {
      mmenu = document.createElement('div');
      mmenu.className = 'mmenu';
      mmenu.innerHTML = $$('.nav__links a').map((a, i) =>
        `<a href="${a.getAttribute('href')}"><i>0${i + 1}</i>${a.childNodes[0].textContent.trim()}</a>`
      ).join('') + `<div class="mmenu__foot">${META.email} · 成都</div>`;
      document.body.appendChild(mmenu);
      mmenu.addEventListener('click', e => {
        if (e.target.closest('a')) closeMenu();
      });
    }
    function openMenu() {
      if (!mmenu) buildMenu();
      mmenu.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
    }
    function closeMenu() {
      if (!mmenu) return;
      mmenu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
    }
    btn.addEventListener('click', () => {
      btn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    // theme
    const themeBtn = $('#themeBtn');
    const label = $('[data-theme-label]');
    const stored = localStorage.getItem('wc-theme');
    if (stored) document.documentElement.dataset.theme = stored;
    label.textContent = document.documentElement.dataset.theme === 'night' ? '日光' : '夜航';
    themeBtn.addEventListener('click', (e) => {
      const next = document.documentElement.dataset.theme === 'night' ? 'paper' : 'night';
      const apply = () => {
        document.documentElement.dataset.theme = next;
        localStorage.setItem('wc-theme', next);
        label.textContent = next === 'night' ? '日光' : '夜航';
        const meta = document.querySelector('meta[name=theme-color]');
        if (meta) meta.content = next === 'night' ? '#0B0B0C' : '#EDE8DF';
      };
      const r = themeBtn.getBoundingClientRect();
      document.documentElement.style.setProperty('--tx', (r.left + r.width / 2) + 'px');
      document.documentElement.style.setProperty('--ty', (r.top + r.height / 2) + 'px');
      if (document.startViewTransition && !reduced) {
        document.startViewTransition(apply);
      } else apply();
    });

    // copy rows
    $$('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const txt = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(txt);
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = txt; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (__) {}
          ta.remove();
        }
        toast('已复制 · ' + txt);
      });
    });
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2000);
  }

  /* ── cursor ───────────────────────────────────────────────────── */
  const cursorState = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2, mode: '' };
  function initCursor() {
    const c = $('.cursor');
    const label = $('.cursor__label');
    if (!fine) { if (c) c.remove(); return; }
    const modeLabel = { view: '查看案例', copy: '点击复制', link: '', zoom: '放大' };
    window.addEventListener('mousemove', e => {
      cursorState.x = e.clientX; cursorState.y = e.clientY;
      if (!c.classList.contains('is-on')) c.classList.add('is-on');
    }, { passive: true });
    window.addEventListener('mousedown', () => c.classList.add('is-down'));
    window.addEventListener('mouseup', () => c.classList.remove('is-down'));
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor], .wrow, .mitem, .rcard');
      let mode = '';
      if (t) {
        mode = t.dataset.cursor || '';
        if (!mode && t.classList.contains('wrow')) mode = 'view';
        if (!mode && t.classList.contains('mitem')) mode = 'zoom';
        if (!mode && t.classList.contains('rcard')) mode = 'view';
      } else if (e.target.closest('a, button')) mode = 'link';
      if (mode !== cursorState.mode) {
        cursorState.mode = mode;
        c.dataset.mode = mode;
        if (label) label.textContent = modeLabel[mode] || '';
      }
    });
    document.addEventListener('mouseleave', () => c.classList.remove('is-on'));
  }
  function tickCursor() {
    if (!fine) return;
    const c = $('.cursor');
    if (!c) return;
    cursorState.rx = lerp(cursorState.rx, cursorState.x, 0.18);
    cursorState.ry = lerp(cursorState.ry, cursorState.y, 0.18);
    c.style.transform = `translate3d(${cursorState.x}px,${cursorState.y}px,0)`;
    const ring = c.querySelector('.cursor__ring');
    if (ring) ring.style.translate = `${cursorState.rx - cursorState.x}px ${cursorState.ry - cursorState.y}px`;
  }

  /* ── hero cycler ──────────────────────────────────────────────── */
  let cyclerIdx = 0, cyclerFrames = [], cyclerTimer = 0, cyclerStart = 0;
  const CYCLE_MS = 5200;
  function initCycler() {
    const box = $('#cycler');
    if (!box) return;
    const frames = $('[data-cycler-frames]');
    const titleEl = $('[data-cycler-title]');
    const noEl = $('[data-cycler-no]');
    const capEl = $('[data-cycler-cap]');
    const bar = $('[data-cycler-bar]');
    const barWrap = $('.cycler__bar');
    const items = HERO.map(id => byId(id)).filter(Boolean);

    items.forEach((p, i) => {
      const m = cover(p);
      const fig = document.createElement('figure');
      if (m.type === 'video') {
        fig.innerHTML = `<video src="${m.src}" poster="${m.poster}" muted loop playsinline preload="none"></video>`;
      } else {
        fig.innerHTML = `<img src="${m.src}" alt="${p.title}">`;
      }
      frames.appendChild(fig);
      cyclerFrames.push({ el: fig, m, p });
    });

    function show(i, play) {
      cyclerIdx = (i + items.length) % items.length;
      cyclerFrames.forEach((f, k) => {
        f.el.classList.toggle('is-on', k === cyclerIdx);
        const v = f.el.querySelector('video');
        if (v) { k === cyclerIdx ? v.play().catch(() => {}) : v.pause(); }
      });
      const p = items[cyclerIdx];
      titleEl.textContent = p.title;
      noEl.textContent = `${pad2(cyclerIdx + 1)} / ${pad2(items.length)}`;
      capEl.textContent = p.en + ' · 点击查看案例';
      cyclerStart = performance.now();
    }
    show(0);
    setTimeout(() => { const v = cyclerFrames[0].el.querySelector('video'); if (v) v.play().catch(() => {}); }, 400);

    function next() { show(cyclerIdx + 1); }
    if (!reduced) {
      cyclerTimer = setInterval(() => {
        if (document.hidden) return;
        if (window.scrollY > window.innerHeight * 1.2) return;
        next();
      }, CYCLE_MS);
    }
    box.addEventListener('click', () => openCase(items[cyclerIdx].id));
    box.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(items[cyclerIdx].id); }
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') show(cyclerIdx - 1);
    });

    // progress bar driven in tick
    cyclerFrames.bar = bar;
    cyclerFrames.barWrap = barWrap;
    cyclerFrames.CYCLE_MS = CYCLE_MS;
  }
  function tickCycler() {
    const bar = $('[data-cycler-bar]');
    if (!bar || reduced) return;
    const k = clamp((performance.now() - cyclerStart) / CYCLE_MS, 0, 1);
    bar.style.transform = `scaleX(${k})`;
  }

  /* ── works list ───────────────────────────────────────────────── */
  let worksFilter = 'all';
  function initWorks() {
    const host = $('[data-works]');
    if (!host) return;
    host.innerHTML = PROJECTS.map((p, i) => {
      const m = cover(p);
      return `<button class="wrow reveal" data-id="${p.id}" data-cat="${p.cat}" data-cover="${thumbOf(m)}">
        <span class="wrow__no">${pad2(i + 1)}</span>
        <span class="wrow__t">${p.title}<em>${p.en}</em></span>
        <span class="wrow__sub">${SUB[p.id] || ''}</span>
        <span class="wrow__c">${catZh(p)}</span>
        <span class="wrow__y">${p.year}</span>
        <span class="wrow__a">↗</span>
      </button>`;
    }).join('');

    $$('.wrow', host).forEach(row => {
      row.addEventListener('click', () => openCase(row.dataset.id));
      row.addEventListener('mouseenter', () => peekShow(row));
      row.addEventListener('mouseleave', () => peekHide());
    });

    // filters
    const fhost = $('[data-filters="works"]');
    fhost.innerHTML = ['all', ...CATS.map(c => c.id)].map(id => {
      const n = id === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.cat === id).length;
      const label = id === 'all' ? '全部' : CATMAP[id].zh;
      return `<button type="button" data-f="${id}" class="${id === 'all' ? 'is-active' : ''}">${label} <span style="opacity:.45">${pad2(n)}</span></button>`;
    }).join('');
    fhost.addEventListener('click', e => {
      const b = e.target.closest('button[data-f]');
      if (!b) return;
      worksFilter = b.dataset.f;
      $$('button', fhost).forEach(x => x.classList.toggle('is-active', x === b));
      applyWorksFilter();
    });
    applyWorksFilter();
  }
  function applyWorksFilter() {
    let n = 0;
    $$('.wrow').forEach(r => {
      const on = worksFilter === 'all' || r.dataset.cat === worksFilter;
      r.style.display = on ? '' : 'none';
      if (on) n++;
    });
    const c = $('[data-works-count]');
    if (c) c.textContent = n + ' 个项目';
  }

  /* ── hover peek ───────────────────────────────────────────────── */
  const peekState = { x: 0, y: 0, tx: 0, ty: 0, on: false, last: 0 };
  function peekShow(row) {
    const el = $('#peek');
    if (!el || !fine) return;
    const img = $('[data-peek-img]', el);
    img.src = row.dataset.cover;
    $('[data-peek-tag]', el).textContent = (row.querySelector('.wrow__c') || {}).textContent || '';
    peekState.tx = cursorState.x; peekState.ty = cursorState.y;
    peekState.x = cursorState.x; peekState.y = cursorState.y;
    el.classList.add('is-on');
    peekState.on = true;
  }
  function peekHide() {
    const el = $('#peek');
    if (!el) return;
    el.classList.remove('is-on');
    peekState.on = false;
  }
  function tickPeek() {
    if (!peekState.on) return;
    const el = $('#peek');
    if (!el) return;
    peekState.x = lerp(peekState.x, cursorState.x, 0.14);
    peekState.y = lerp(peekState.y, cursorState.y, 0.14);
    const w = el.offsetWidth || 260;
    const h = el.offsetHeight || 320;
    el.style.transform = `translate3d(${peekState.x + 46}px, ${peekState.y - h * 0.58}px, 0)`;
  }

  /* ── reel (auto looping + drag) ───────────────────────────────── */
  const reels = [];
  function reelCards(ids, host) {
    host.innerHTML = ids.map(id => {
      const p = byId(id);
      if (!p) return '';
      const m = cover(p);
      const inner = m.type === 'video'
        ? `<video src="${m.src}" poster="${m.poster}" muted loop playsinline preload="none"></video>`
        : `<img src="${thumbOf(m)}" alt="${p.title}" loading="lazy">`;
      return `<button class="rcard" data-id="${p.id}">
        <span class="rcard__media">${inner}
          <span class="rcard__kind">${m.type === 'video' ? 'LOOP' : 'IMAGE'}</span>
          <span class="rcard__cap"><b>${p.title}</b><span>${catZh(p)} · ${p.year}</span></span>
        </span>
      </button>`;
    }).join('');
  }
  function initReel() {
    $$('[data-reel]').forEach(host => {
      const ids = host.dataset.reel === 'b' ? REEL_B : REEL_A;
      reelCards(ids, host);
      host.innerHTML += host.innerHTML; // duplicate for seamless wrap
      const state = {
        el: host,
        x: 0,
        half: 0,
        speed: host.dataset.reel === 'b' ? 38 : 52,   // px per second
        cur: 0,
        dir: host.dataset.reel === 'b' ? 1 : -1,
        drag: false, startX: 0, baseX: 0, moved: 0, vel: 0, hover: false
      };
      state.cur = state.speed;
      reels.push(state);

      host.addEventListener('pointerenter', () => { state.hover = true; });
      host.addEventListener('pointerleave', () => { state.hover = false; });
      host.addEventListener('pointerdown', e => {
        state.drag = true; state.moved = 0; state.startX = e.clientX; state.baseX = state.x;
        state.vel = 0; host.setPointerCapture(e.pointerId);
      });
      host.addEventListener('pointermove', e => {
        if (!state.drag) return;
        const dx = e.clientX - state.startX;
        state.moved = Math.max(state.moved, Math.abs(dx));
        state.x = state.baseX + dx;
      });
      const end = e => {
        if (!state.drag) return;
        state.drag = false;
        state.vel = state.dir * 0;
        try { host.releasePointerCapture(e.pointerId); } catch (_) {}
      };
      host.addEventListener('pointerup', end);
      host.addEventListener('pointercancel', end);
      host.addEventListener('click', e => {
        if (state.moved > 8) { e.preventDefault(); e.stopPropagation(); return; }
        const card = e.target.closest('.rcard');
        if (card) openCase(card.dataset.id);
      });
      // pause videos that are far offscreen is handled by IO on section
      measure(state);
    });
    window.addEventListener('resize', () => reels.forEach(measure));

    // autoplay control for reel videos when section visible
    const section = $('#reel');
    if (section) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          $$('video', section).forEach(v => {
            if (e.isIntersecting) v.play().catch(() => {});
            else v.pause();
          });
        });
      }, { threshold: 0.05 });
      io.observe(section);
    }
  }
  function measure(s) { s.half = s.el.scrollWidth / 2; s.x = s.dir === 1 ? -s.half : 0; }
  function tickReels(dt) {
    reels.forEach(s => {
      if (!s.half) return;
      if (s.drag) {
        // wrap while dragging
        if (s.x > 0) s.x -= s.half;
        if (s.x < -s.half) s.x += s.half;
        s.el.style.transform = `translate3d(${s.x}px,0,0)`;
        return;
      }
      const target = (s.hover || reduced) ? 0 : s.speed;
      s.cur = lerp(s.cur, target, 0.08);
      s.x += s.dir * s.cur * dt;
      if (s.x <= -s.half) s.x += s.half;
      if (s.x > 0) s.x -= s.half;
      s.el.style.transform = `translate3d(${s.x}px,0,0)`;
    });
  }

  /* ── archive ──────────────────────────────────────────────────── */
  let archiveFilter = 'all';
  let archiveItems = [];
  function buildArchiveItems() {
    const out = [];
    // interleave: take media round-robin per project for a varied grid
    const queues = PROJECTS.map(p => p.media.map(m => ({ p, m })));
    let added = true;
    while (added) {
      added = false;
      queues.forEach(q => {
        if (q.length) { out.push(q.shift()); added = true; }
      });
    }
    return out;
  }
  function initArchive() {
    archiveItems = buildArchiveItems();
    const fhost = $('[data-filters="archive"]');
    fhost.innerHTML = ['all', ...CATS.map(c => c.id)].map(id => {
      const n = id === 'all' ? archiveItems.length : archiveItems.filter(x => x.p.cat === id).length;
      const label = id === 'all' ? '全部' : CATMAP[id].zh;
      return `<button type="button" data-f="${id}" class="${id === 'all' ? 'is-active' : ''}">${label} <span style="opacity:.45">${pad2(n)}</span></button>`;
    }).join('');
    fhost.addEventListener('click', e => {
      const b = e.target.closest('button[data-f]');
      if (!b) return;
      archiveFilter = b.dataset.f;
      $$('button', fhost).forEach(x => x.classList.toggle('is-active', x === b));
      renderArchive();
    });
    renderArchive();
  }
  let archiveVisible = [];
  function renderArchive() {
    const host = $('[data-archive]');
    archiveVisible = archiveItems.filter(x => archiveFilter === 'all' || x.p.cat === archiveFilter);
    host.innerHTML = archiveVisible.map((x, i) => {
      const m = x.m;
      return `<button class="mitem" data-i="${i}" style="background-image:url('${m.lqip}')">
        <img src="${thumbOf(m)}" width="${m.w}" height="${m.h}" alt="${x.p.title} · ${m.cap}" loading="lazy" decoding="async">
        ${m.type === 'video' ? '<span class="mitem__vid">▶ LOOP</span>' : ''}
        <span class="mitem__cap"><b>${x.p.title}</b><span>${pad2(i + 1)}</span></span>
      </button>`;
    }).join('');
    const c = $('[data-archive-count]');
    if (c) c.textContent = archiveVisible.length + ' 件图版';
    // re-bind every render
    host.onclick = e => {
      const b = e.target.closest('.mitem');
      if (!b) return;
      openLb(+b.dataset.i, archiveVisible.map(x => x.m), index => archiveVisible[index].p.title);
    };
  }

  /* ── lightbox ─────────────────────────────────────────────────── */
  const lbState = { items: [], i: 0, label: () => '' };
  function openLb(i, items, label) {
    lbState.items = items; lbState.i = i; lbState.label = label || (() => '');
    const lb = $('#lb');
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.classList.add('is-locked');
    renderLb();
  }
  function renderLb() {
    const m = lbState.items[lbState.i];
    if (!m) return;
    const host = $('[data-lb-media]');
    host.innerHTML = m.type === 'video'
      ? `<video src="${m.src}" poster="${m.poster || ''}" controls autoplay loop muted playsinline></video>`
      : `<img src="${m.src}" alt="${m.cap || ''}" width="${m.w}" height="${m.h}">`;
    $('[data-lb-cap]').textContent = `${lbState.label(lbState.i)} — ${m.cap || ''}`;
    $('[data-lb-no]').textContent = `${pad2(lbState.i + 1)} / ${pad2(lbState.items.length)}`;
  }
  function closeLb() {
    const lb = $('#lb');
    lb.classList.remove('is-open');
    setTimeout(() => { lb.hidden = true; $('[data-lb-media]').innerHTML = ''; }, 400);
    if ($('#case').hidden) document.body.classList.remove('is-locked');
  }
  function navLb(d) {
    const n = lbState.items.length;
    lbState.i = (lbState.i + d + n) % n;
    renderLb();
  }
  function initLb() {
    $('[data-lb-close]').addEventListener('click', closeLb);
    $('[data-lb-prev]').addEventListener('click', () => navLb(-1));
    $('[data-lb-next]').addEventListener('click', () => navLb(1));
    $('#lb').addEventListener('click', e => {
      if (e.target.id === 'lb' || e.target.closest('.lb__fig') === null) closeLb();
    });
  }

  /* ── case study ───────────────────────────────────────────────── */
  let caseOpen = false, caseId = null, returnY = 0;

  function caseHTML(p, index) {
    const acc = p.accent || '#C4462C';
    const media = p.media;

    // layout engine: pair consecutive portrait plates, give landscape / video a full row
    const isPort = m => m.type === 'image' && (m.w / m.h) <= 1.12;
    const rows = [];
    for (let i = 0; i < media.length; i++) {
      const m = media[i];
      if (isPort(m) && media[i + 1] && isPort(media[i + 1])) { rows.push([m, media[i + 1], i, i + 1]); i++; }
      else rows.push([m, null, i, null]);
    }
    const frame = (m, i) => {
      const inner = m.type === 'video'
        ? `<video src="${m.src}" poster="${m.poster || ''}" muted loop playsinline preload="metadata" data-case-video></video>
           <span class="mf__loop"><i></i>LOOP ${m.dur ? m.dur + 's' : ''}</span>`
        : `<img src="${m.src}" alt="${p.title} · ${m.cap}" loading="lazy" width="${m.w}" height="${m.h}" data-case-img="${i}">`;
      return `<figure class="mf ${isPort(m) ? 'mf--port' : (m.type === 'video' ? 'mf--video' : 'mf--land')}">${inner}
        <figcaption class="mf__cap"><span>FIG.${pad2(i + 1)} · ${m.cap}</span><span>${m.w}×${m.h}</span></figcaption>
      </figure>`;
    };
    const frames = rows.map(r => r[1]
      ? `<div class="ci__row is-pair">${frame(r[0], r[2])}${frame(r[1], r[3])}</div>`
      : `<div class="ci__row is-single">${frame(r[0], r[2])}</div>`
    ).join('');

    const pal = (media[0].pal || []).filter((c, i, a) => a.indexOf(c) === i).slice(0, 5);
    const nextP = PROJECTS[(index + 1) % PROJECTS.length];

    return `
    <section class="ci" style="--ci-accent:${acc}">
      <div class="ci__wrap">
        <p class="ci__kicker">
          <span>CASE ${pad2(index + 1)}</span>
          <span>${p.year}</span>
          <span>${catZh(p)}</span>
          <span>${p.media.length} 件作品</span>
        </p>
        <h1 class="ci__title">${p.title}</h1>
        <p class="ci__en">${p.en}</p>
        <div class="ci__main">
          <p class="ci__desc">${p.desc}</p>
          <div>
            <dl class="ci__specs">
              <div><dt>Year</dt><dd>${p.year}</dd></div>
              <div><dt>Role</dt><dd>${p.role}</dd></div>
              <div><dt>Tools</dt><dd>${(p.tools || []).join(' · ')}</dd></div>
              <div><dt>Field</dt><dd>${catZh(p)}</dd></div>
            </dl>
            <div class="ci__pal">${pal.map(c => `<span style="background:${c}"></span>`).join('')}<i>PALETTE / 取自作品</i></div>
          </div>
        </div>
      </div>
    </section>
    <div class="ci__media">${frames}</div>
    <div class="ci__next">
      <p class="ci__next-lbl">NEXT PROJECT</p>
      <button type="button" data-next="${nextP.id}">
        <img src="${thumbOf(cover(nextP))}" alt="">
        <h3>${nextP.title}</h3>
        <span style="margin-left:auto;font-family:var(--mono);font-size:11px;letter-spacing:.14em">${catZh(nextP)} ↗</span>
      </button>
    </div>`;
  }

  function openCase(id) {
    const p = byId(id);
    if (!p) return;
    const idx = PROJECTS.indexOf(p);
    const caseEl = $('#case');
    const content = $('[data-case-content]');
    returnY = window.scrollY;
    content.innerHTML = caseHTML(p, idx);
    $('[data-case-no]').textContent = `${pad2(idx + 1)} / ${pad2(PROJECTS.length)}`;
    $('[data-case-cat]').textContent = `${catZh(p)} · ${p.year}`;
    caseEl.hidden = false;
    requestAnimationFrame(() => caseEl.classList.add('is-open'));
    $('[data-case-scroll]').scrollTop = 0;
    document.body.classList.add('is-locked');
    caseOpen = true; caseId = id;
    try { history.pushState({ case: id }, '', '#/work/' + id); } catch (_) {}
    bindCase();
    // play videos
    setTimeout(() => {
      $$('[data-case-video]', content).forEach(v => { v.muted = true; v.play().catch(() => {}); });
    }, 240);
  }
  function bindCase() {
    const content = $('[data-case-content]');
    $$('[data-case-close]').forEach(b => { b.onclick = closeCase; });
    $$('[data-case-img]', content).forEach(img => {
      img.onclick = () => {
        const p = byId(caseId);
        openLb(+img.dataset.caseImg, p.media, i => p.title);
      };
    });
    const next = $('[data-next]', content);
    if (next) next.onclick = () => {
      const id = next.dataset.next;
      $('[data-case-scroll]').scrollTop = 0;
      openCase(id);
    };
  }
  function closeCase(push) {
    const caseEl = $('#case');
    if (!caseOpen) return;
    caseOpen = false;
    caseEl.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    $$('[data-case-video]').forEach(v => v.pause());
    setTimeout(() => { if (!caseOpen) { caseEl.hidden = true; $('[data-case-content]').innerHTML = ''; } }, 950);
    if (push !== false) { try { history.pushState({}, '', location.pathname + location.search); } catch (_) {} }
    window.scrollTo(0, returnY);
    caseId = null;
  }
  function initCaseClose() {
    $$('[data-case-close]').forEach(b => b.addEventListener('click', () => closeCase()));
  }

  /* ── about ────────────────────────────────────────────────────── */
  function initAbout() {
    const skills = $('[data-skills]');
    if (skills) {
      skills.innerHTML = META.skills.map((s, i) => `
        <div class="skill">
          <div class="skill__row"><span class="skill__no">${pad2(i + 1)}</span><span class="skill__zh">${s.zh}</span><span class="skill__en">${s.en}</span></div>
          <p class="skill__d">${s.d}</p>
        </div>`).join('');
    }
    const tools = $('[data-tools]');
    if (tools) tools.innerHTML = META.tools.map(t => `<span>${t}</span>`).join('<i>·</i>');
  }

  /* ── keyboard ─────────────────────────────────────────────────── */
  function initKeys() {
    document.addEventListener('keydown', e => {
      if (!$('#lb').hidden) {
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowRight') navLb(1);
        if (e.key === 'ArrowLeft') navLb(-1);
        return;
      }
      if (caseOpen) {
        if (e.key === 'Escape') closeCase();
        return;
      }
    });
  }

  /* ── main loop ────────────────────────────────────────────────── */
  let last = performance.now();
  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    tickCursor();
    tickPeek();
    tickReels(dt);
    tickCycler();
    updateScrub();
    requestAnimationFrame(loop);
  }

  /* ── boot ─────────────────────────────────────────────────────── */
  function boot() {
    initLoader();
    initChrome();
    initCursor();
    initCycler();
    initWorks();
    initReel();
    initArchive();
    initAbout();
    initLb();
    initCaseClose();
    initKeys();
    initReveal();
    initCounters();
    initScrub();
    document.addEventListener('reveal', () => {
      // hero staggered entrance
      const hero = $('#hero');
      if (hero) hero.classList.add('is-in');
    });

    // deep link
    const m = /#\/work\/([\w-]+)/.exec(location.hash);
    if (m && byId(m[1])) {
      setTimeout(() => openCase(m[1]), 700);
    }
    window.addEventListener('popstate', () => {
      const mm = /#\/work\/([\w-]+)/.exec(location.hash);
      if (mm && byId(mm[1])) openCase(mm[1]);
      else if (caseOpen) closeCase(false);
    });

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
