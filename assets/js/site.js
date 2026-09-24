// Small enhancements. The page works without this file.
(function () {
  // Copy email
  var copy = document.querySelector('[data-copy]');
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', function () {
      navigator.clipboard.writeText(copy.getAttribute('data-copy')).then(function () {
        copy.textContent = 'Copied';
        setTimeout(function () { copy.textContent = 'Copy'; }, 2000);
      });
    });
  }
})();
