// Theme toggle. The initial theme is set by an inline snippet in <head> so there is no flash;
// this file only wires up the button and follows the OS setting until the visitor picks one.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  apply(root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light'));

  media.addEventListener('change', function (e) {
    if (!stored()) apply(e.matches ? 'dark' : 'light');
  });

  var btn = document.querySelector('.theme-toggle');
  if (btn) btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();
