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
})();
