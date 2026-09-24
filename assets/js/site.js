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
    var words = Array.prototype.slice.call(swap.children), wi = 0, paused = false;
    swap.closest('h1').addEventListener('mouseenter', function () { paused = true; });
    swap.closest('h1').addEventListener('mouseleave', function () { paused = false; });
    setTimeout(function () {
      setInterval(function () {
        if (paused || document.hidden) return;
        var cur = words[wi]; wi = (wi + 1) % words.length; var next = words[wi];
        cur.classList.remove('on'); cur.classList.add('out');
        next.classList.remove('out'); next.classList.add('on');
        setTimeout(function () { cur.classList.remove('out'); }, 650);
      }, 2400);
    }, 1600);
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
