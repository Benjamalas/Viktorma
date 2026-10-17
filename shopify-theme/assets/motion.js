// Viktorma shared motion: brand intro, scroll reveals, scroll progress.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intro: shown at least MIN ms, hidden once the page has loaded, never longer than MAX ms.
  var intro = document.querySelector('.intro');
  if (intro) {
    var MIN = reduce ? 0 : 1900, MAX = 4500, start = Date.now(), closed = false;
    var close = function () {
      if (closed) return;
      closed = true;
      intro.classList.add('done');
      document.documentElement.classList.add('ready');
    };
    var onLoad = function () { setTimeout(close, Math.max(0, MIN - (Date.now() - start))); };
    if (document.readyState === 'complete') onLoad(); else addEventListener('load', onLoad);
    setTimeout(close, MAX);
  } else {
    document.documentElement.classList.add('ready');
  }

  // Reveal elements with .reveal or .mask-line as they enter the viewport.
  var els = document.querySelectorAll('.reveal, [data-reveal]');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // Scroll progress: [data-progress] gets --p from 0 (entering) to 1 (leaving).
  var tracked = document.querySelectorAll('[data-progress]');
  if (tracked.length && !reduce) {
    var ticking = false;
    var update = function () {
      var vh = innerHeight;
      tracked.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = (vh - r.top) / (vh + r.height);
        el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
      });
      ticking = false;
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }
})();
