// Small enhancements. Everything works without this file: tiles are plain links to the case
// studies, and content is visible (the reveal only applies once <html> has the "js" class).
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Toast
  var toast = document.querySelector('.toast');
  var toastTimer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  // Copy email
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        say(ok ? 'Email copied' : text);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { say('Email copied'); }, fallback);
      } else fallback();
    });
  });

  // Chennai clock
  var clock = document.querySelector('[data-clock]');
  if (clock) {
    var t = clock.querySelector('time');
    var fmt = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
    var tick = function () { t.textContent = fmt.format(new Date()); };
    tick(); clock.hidden = false;
    setInterval(tick, 30000);
  }

  // Pill nav: the highlight follows the section in view
  var pill = document.querySelector('.pill');
  var ind = pill && pill.querySelector('.pill-ind');
  var links = pill ? Array.prototype.slice.call(pill.querySelectorAll('a[href^="#"]')) : [];
  function mark(link) {
    links.forEach(function (a) { a.classList.toggle('is-active', a === link); });
    if (!ind) return;
    if (!link) { ind.style.opacity = 0; return; }
    ind.style.width = link.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    ind.style.opacity = 1;
  }
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) mark(byId[e.target.id]); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    var top = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) mark(null);
    }, { rootMargin: '0px 0px -70% 0px' });
    var intro = document.querySelector('.intro');
    if (intro) top.observe(intro);
    window.addEventListener('resize', function () { mark(pill.querySelector('a.is-active')); });
    // The last section can't reach the trigger line, so mark it once the page bottoms out.
    window.addEventListener('scroll', function () {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) mark(links[links.length - 1]);
    }, { passive: true });
  }

  // Project peek: open a quick look in place; the case study is one click further
  document.querySelectorAll('[data-peek]').forEach(function (a) {
    var dlg = document.getElementById(a.getAttribute('data-peek'));
    if (!dlg || typeof dlg.showModal !== 'function') return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      dlg.showModal();
      root.classList.add('peek-open');
      dlg.scrollTop = 0;
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
    dlg.addEventListener('close', function () { root.classList.remove('peek-open'); });
  });

  // ---- Quick-look navigation: prev/next buttons, ←/→ keys, swipe ----
  var peeks = Array.prototype.slice.call(document.querySelectorAll('dialog.peek'));
  function openPeek(d, animate) {
    if (!animate) d.classList.add('no-anim');
    d.showModal();
    root.classList.add('peek-open');
    d.scrollTop = 0;
    if (!animate) requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.remove('no-anim'); }); });
  }
  function step(d, dir) {
    var next = peeks[(peeks.indexOf(d) + dir + peeks.length) % peeks.length];
    d.close();
    openPeek(next, false);
  }
  peeks.forEach(function (d, i) {
    var inner = d.querySelector('.peek-inner');
    if (!inner || typeof d.showModal !== 'function') return;
    var nav = document.createElement('div');
    nav.className = 'peek-nav';
    nav.innerHTML = '<button type="button" class="peek-step" data-step="-1" aria-label="Previous project">←</button>' +
      '<span class="peek-count">' + (i + 1) + ' / ' + peeks.length + '</span>' +
      '<button type="button" class="peek-step" data-step="1" aria-label="Next project">→</button>';
    inner.insertBefore(nav, inner.children[1] || null);
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]');
      if (b) step(d, +b.getAttribute('data-step'));
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(d, 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(d, -1); }
    });
    var sx = null, sy = null;
    d.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    d.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(d, dx < 0 ? 1 : -1);
    }, { passive: true });
  });

  // ---- Live demo: Mandate Retry NPCI clock ----
  document.querySelectorAll('.demo-clock').forEach(function (box) {
    var svg = box.querySelector('.clk'), read = box.querySelector('.clk-read');
    var c1 = box.querySelector('.clk-c1'), c2 = box.querySelector('.clk-c2');
    var wedges = Array.prototype.slice.call(box.querySelectorAll('.wedge'));
    wedges.sort(function (a, b) { return a.getAttribute('data-hour') - b.getAttribute('data-hour'); });
    var cur = -1;
    function show(i) {
      wedges.forEach(function (w) { w.classList.remove('on'); });
      cur = i;
      if (i < 0) {
        read.textContent = read.getAttribute('data-default');
        c1.textContent = '0 / 266'; c2.textContent = 'in blocked hours';
        return;
      }
      var w = wedges[i];
      w.classList.add('on');
      read.textContent = w.getAttribute('data-span') + ' · ' + w.getAttribute('data-state') + ' · ' + w.getAttribute('data-ran');
      c1.textContent = w.getAttribute('data-span').slice(0, 5);
      c2.textContent = w.getAttribute('data-ran');
    }
    wedges.forEach(function (w, i) {
      w.addEventListener('mouseenter', function () { show(i); });
      w.addEventListener('click', function () { show(i); });
    });
    svg.addEventListener('mouseleave', function () { show(-1); });
    svg.addEventListener('blur', function () { show(-1); });
    svg.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var d = e.key === 'ArrowDown' ? 1 : -1;
      show(((cur < 0 ? (d > 0 ? -1 : 0) : cur) + d + 24) % 24);
    });
  });

  // ---- Live demo: PAD citations (hover/focus in CSS; tap toggles; cards kept inside the dialog) ----
  function place(wrap) {
    var card = wrap.querySelector('.src-card'), box = wrap.closest('.peek-inner') || document.body;
    if (!card) return;
    card.style.setProperty('--dx', '0px');
    var r = card.getBoundingClientRect(), b = box.getBoundingClientRect(), dx = 0;
    if (r.right > b.right - 8) dx = b.right - 8 - r.right;
    if (r.left + dx < b.left + 8) dx = b.left + 8 - r.left;
    card.style.setProperty('--dx', dx + 'px');
  }
  document.querySelectorAll('.cite-wrap').forEach(function (w) {
    w.addEventListener('mouseenter', function () { place(w); });
    w.addEventListener('focusin', function () { place(w); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.cite') : null;
    document.querySelectorAll('.cite-wrap.open').forEach(function (w) { if (!b || w !== b.parentNode) w.classList.remove('open'); });
    if (b) { place(b.parentNode); b.parentNode.classList.toggle('open'); }
  });

  // ---- Skills point to work ----
  var skillRead = document.querySelector('.skill-read'), bento = document.querySelector('.bento');
  var fbar = document.querySelector('.filter-bar'), activeSkill = null;
  function sayUsed(b) {
    if (skillRead) skillRead.textContent = b ? b.getAttribute('data-label') + ' → ' + b.getAttribute('data-used') : skillRead.getAttribute('data-default');
  }
  function clearFilter() {
    if (activeSkill) activeSkill.classList.remove('on');
    activeSkill = null;
    if (!bento) return;
    bento.classList.remove('filtering');
    bento.querySelectorAll('.tile').forEach(function (t) { t.classList.remove('match'); });
    if (fbar) fbar.hidden = true;
    sayUsed(null);
  }
  function filterBy(b) {
    if (activeSkill === b) { clearFilter(); return; }
    clearFilter();
    activeSkill = b;
    b.classList.add('on');
    var keys = b.getAttribute('data-uses').split(' '), n = 0;
    bento.querySelectorAll('.tile').forEach(function (t) {
      var m = keys.indexOf(t.getAttribute('data-key')) > -1;
      t.classList.toggle('match', m);
      if (m) n++;
    });
    bento.classList.add('filtering');
    fbar.querySelector('[data-filter-text]').textContent = 'Showing work that uses ' + b.getAttribute('data-label') + ' · ' + n + ' project' + (n === 1 ? '' : 's');
    fbar.hidden = false;
    sayUsed(b);
    document.getElementById('work').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  if (bento && fbar) {
    document.querySelectorAll('.skill').forEach(function (b) {
      b.addEventListener('mouseenter', function () { sayUsed(b); });
      b.addEventListener('focus', function () { sayUsed(b); });
      b.addEventListener('mouseleave', function () { sayUsed(activeSkill); });
      b.addEventListener('blur', function () { sayUsed(activeSkill); });
      b.addEventListener('click', function () { filterBy(b); });
    });
    fbar.querySelector('[data-filter-clear]').addEventListener('click', clearFilter);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activeSkill && !document.querySelector('dialog[open]')) clearFilter();
    });
  }

  // ---- Page transitions: the screenshot you're looking at is the one that morphs ----
  document.querySelectorAll('dialog.peek .btn-case').forEach(function (a) {
    a.addEventListener('click', function () {
      if (a.origin !== location.origin) return;
      var d = a.closest('dialog'), key = d.getAttribute('data-key');
      var tf = document.querySelector('.tile[data-key="' + key + '"] .frame'), pf = d.querySelector('.peek-shot .frame');
      if (!tf || !pf) return;
      tf.style.viewTransitionName = 'none';
      pf.style.viewTransitionName = 'shot-' + key;
    });
  });
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    document.querySelectorAll('.tile .frame').forEach(function (f) {
      var t = f.closest('.tile');
      if (t && t.getAttribute('data-key') !== 'paper') f.style.viewTransitionName = 'shot-' + t.getAttribute('data-key');
    });
    document.querySelectorAll('.peek-shot .frame').forEach(function (f) { f.style.viewTransitionName = ''; });
  });

  // ---- Hello, whoever opened the console ----
  try {
    console.log("%cHi, I'm Madhav.%c\nThis site is plain HTML, CSS and JS, written by hand. Source: https://github.com/Maaadhavq/Maaadhavq.github.io\nSay hello: madhavkomanduri@gmail.com",
      'font: 700 16px system-ui, sans-serif; color: #1f6b45', 'font: 13px system-ui, sans-serif');
  } catch (e) {}

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    document.querySelectorAll('.bento .tile').forEach(function (el, i) { el.style.setProperty('--d', (i % 2) * 0.08 + 's'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // ---- v5 motion ----
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Headline: cycle the last word (things I've actually shipped)
  var swap = document.querySelector('[data-swap]');
  if (swap && !reduce) {
    // Changes every 5 seconds. No pause on hover: resting the cursor on the headline froze it.
    var words = Array.prototype.slice.call(swap.children), wi = 0;
    setInterval(function () {
      if (document.hidden) return;
      var cur = words[wi]; wi = (wi + 1) % words.length; var next = words[wi];
      cur.classList.remove('on'); cur.classList.add('out');
      next.classList.remove('out'); next.classList.add('on');
      setTimeout(function () { cur.classList.remove('out'); }, 650);
    }, 5000);
  }

  // Scroll progress fallback where scroll-driven animations aren't supported
  var bar = document.querySelector('.progress');
  if (bar && !(window.CSS && CSS.supports('animation-timeline: scroll()'))) {
    var setBar = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
    };
    setBar(); window.addEventListener('scroll', setBar, { passive: true });
  }

  // Cursor label over project tiles
  var tag = document.querySelector('.cursor-tag');
  if (tag && fine && !reduce) {
    var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    var loop = function () {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      tag.style.transform = 'translate(' + (cx + 14) + 'px,' + (cy + 14) + 'px)';
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) requestAnimationFrame(loop); else running = false;
    };
    document.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.querySelectorAll('[data-peek]').forEach(function (a) {
      a.addEventListener('mouseenter', function (e) { cx = tx = e.clientX; cy = ty = e.clientY; tag.classList.add('on'); });
      a.addEventListener('mouseleave', function () { tag.classList.remove('on'); });
      a.addEventListener('click', function () { tag.classList.remove('on'); });
    });
  }

  // Magnetic buttons: drift a few pixels toward the pointer
  if (fine && !reduce) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + dx * 8 + 'px,' + dy * 6 + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  // Beliefs: words light up when the line reaches the middle of the screen
  var beliefs = document.querySelectorAll('.beliefs li');
  if (beliefs.length) {
    if (reduce || !('IntersectionObserver' in window)) beliefs.forEach(function (li) { li.classList.add('lit'); });
    else {
      var lit = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('lit'); lit.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -35% 0px' });
      beliefs.forEach(function (li) { lit.observe(li); });
    }
  }
})();
