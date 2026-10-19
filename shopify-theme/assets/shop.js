// Viktorma shop: header toggles, filter sheet, auto-applying filters.
(function () {
  var root = document.documentElement;
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-toggle]');
    if (!t) return;
    var key = t.getAttribute('data-toggle');
    var on = root.classList.toggle('open-' + key);
    t.setAttribute('aria-expanded', on);
    if (key === 'search' && on) { var i = document.querySelector('.head-search input'); if (i) i.focus(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') root.className = root.className.replace(/\bopen-\w+/g, '').trim();
  });

  // Submit the filter form as soon as a filter changes (price waits for blur).
  var form = document.getElementById('filter-form');
  if (form) {
    form.addEventListener('change', function () { form.submit(); });
    var sort = document.getElementById('sort-select');
    if (sort) sort.addEventListener('change', function () {
      var u = new URL(location.href); u.searchParams.set('sort_by', sort.value); u.searchParams.delete('page'); location.href = u;
    });
  }

  // Keep the header solid after the first scroll.
  var head = document.querySelector('.shop-head');
  if (head) {
    var set = function () { head.classList.toggle('solid', scrollY > 8); };
    addEventListener('scroll', set, { passive: true }); set();
  }
})();
