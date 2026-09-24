// Small enhancements. The page works without this file.
(function () {
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Timeline: hovering a bar highlights its role, and the other way round.
  function link(key, on) {
    document.querySelectorAll('[data-role="' + key + '"]').forEach(function (el) { el.classList.toggle('is-hot', on); });
  }
  document.querySelectorAll('[data-role]').forEach(function (el) {
    var key = el.getAttribute('data-role');
    ['mouseenter', 'focusin'].forEach(function (ev) { el.addEventListener(ev, function () { link(key, true); }); });
    ['mouseleave', 'focusout'].forEach(function (ev) { el.addEventListener(ev, function () { link(key, false); }); });
  });
  document.querySelectorAll('.g-row[data-role]').forEach(function (row) {
    row.addEventListener('click', function () {
      var target = document.querySelector('.role[data-role="' + row.getAttribute('data-role') + '"]');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Copy email
  var copy = document.querySelector('[data-copy]');
  var status = document.querySelector('.copy-status');
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', function () {
      navigator.clipboard.writeText(copy.getAttribute('data-copy')).then(function () {
        if (status) { status.textContent = 'Copied'; setTimeout(function () { status.textContent = ''; }, 2000); }
      });
    });
  }
})();
