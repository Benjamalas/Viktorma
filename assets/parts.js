// Viktorma illustrated parts: stylised SVG gearbox parts + floating, slowly spinning fields.
// Shared by the landing page and the shop. Colours come from CSS (--pf fill, --ps stroke, --ph hole).
(function () {
  var TAU = Math.PI * 2, uid = 0;
  var f = function (n) { return n.toFixed(2); };
  var pt = function (r, a) { return f(Math.cos(a) * r) + ',' + f(Math.sin(a) * r); };
  var ring = function (r, cx, cy) { cx = cx || 0; cy = cy || 0; return 'M' + f(cx - r) + ',' + f(cy) + 'a' + r + ',' + r + ' 0 1,0 ' + 2 * r + ',0a' + r + ',' + r + ' 0 1,0 ' + -2 * r + ',0Z'; };
  var svg = function (vb, body, cls) { return '<svg class="part-svg ' + (cls || '') + '" viewBox="' + vb + '" aria-hidden="true">' + body + '</svg>'; };
  var S = ' stroke="var(--ps)" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"';

  // Gear outline: n teeth, outer radius R, tooth depth d, sharp=true for sprocket-like teeth.
  function teeth(n, R, d, sharp) {
    var p = TAU / n, r = R - d, s = '';
    for (var i = 0; i < n; i++) {
      var a = i * p;
      var q = sharp ? [[r, a], [R, a + .42 * p], [R, a + .58 * p], [r, a + p]] : [[r, a], [R, a + .2 * p], [R, a + .45 * p], [r, a + .65 * p]];
      s += (i ? 'L' : 'M') + q.map(function (v) { return pt(v[0], v[1]); }).join('L');
    }
    return s + 'Z';
  }
  function holes(k, rad, size) {
    var s = '';
    for (var i = 0; i < k; i++) { var a = i * TAU / k; s += ring(size, Math.cos(a) * rad, Math.sin(a) * rad); }
    return s;
  }

  var P = {
    gear: function (o) {
      o = o || {}; var n = o.n || 18;
      var d = teeth(n, 48, Math.max(4, 70 / n)) + ring(10) + (o.holes === 0 ? '' : holes(o.holes || 5, 27, n > 20 ? 8 : 6));
      return svg('-50 -50 100 100', '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + d + '"/><circle r="4" fill="var(--ph)"/><circle r="19" fill="none" stroke="var(--ps)" stroke-width=".8" stroke-dasharray="2 3" opacity=".5"/>');
    },
    // Cutaway gear: a quarter cut out shows a hatched section.
    cutaway: function (o) {
      o = o || {}; var n = o.n || 24, id = 'h' + (++uid);
      var gear = teeth(n, 48, 5) + ring(12);
      var wedge = 'M0,0L' + pt(43, -TAU / 4) + 'A43,43 0 0,1 ' + pt(43, 0) + 'Z';
      return svg('-50 -50 100 100',
        '<defs><pattern id="' + id + '" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line y2="5" stroke="var(--ps)" stroke-width="1.2"/></pattern></defs>' +
        '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + gear + '"/>' +
        '<path fill="url(#' + id + ')"' + S + ' d="' + wedge + '"/><path fill="var(--pf)"' + S + ' d="' + ring(12) + '"/>' +
        '<circle r="5" fill="var(--ph)"/><circle r="30" fill="none" stroke="var(--ps)" stroke-width=".8" opacity=".6"/>');
    },
    sprocket: function (o) {
      o = o || {}; var n = o.n || 16;
      return svg('-50 -50 100 100', '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + teeth(n, 48, 9, true) + holes(5, 22, 7) + ring(6) + '"/>');
    },
    clutch: function () {
      var springs = '';
      for (var i = 0; i < 6; i++) {
        var a = i * 60;
        springs += '<g transform="rotate(' + a + ') translate(24 0)"><rect x="-3.5" y="-7" width="7" height="14" rx="3" fill="var(--ph)"' + S + '/>' +
          '<path d="M-3.5,-4H3.5M-3.5,0H3.5M-3.5,4H3.5" stroke="var(--ps)" stroke-width=".8"/></g>';
      }
      return svg('-50 -50 100 100',
        '<circle r="48" fill="var(--pf)"' + S + '/>' +
        '<circle r="41" fill="none" stroke="var(--pa, var(--ps))" stroke-width="9" stroke-dasharray="11 3" opacity=".9"/>' +
        '<circle r="35" fill="none"' + S + '/>' + springs +
        '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + teeth(14, 11, 2.5) + ring(5) + '"/>');
    },
    bearing: function () {
      var balls = '';
      for (var i = 0; i < 9; i++) { var a = i * TAU / 9; balls += '<circle cx="' + f(Math.cos(a) * 32) + '" cy="' + f(Math.sin(a) * 32) + '" r="6.2" fill="var(--pf)"' + S + '/>'; }
      return svg('-50 -50 100 100',
        '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + ring(48) + ring(40) + '"/>' +
        '<circle r="32" fill="none" stroke="var(--ps)" stroke-width=".8" stroke-dasharray="3 2" opacity=".6"/>' + balls +
        '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + ring(24) + ring(16) + '"/>');
    },
    // Side view of a gearbox housing with a spinning gear behind an inspection window.
    gearbox: function () {
      var bolts = '';
      for (var i = 0; i < 6; i++) bolts += '<circle cx="' + (18 + (i % 2) * 34) + '" cy="' + (20 + Math.floor(i / 2) * 30) + '" r="2.2" fill="var(--ph)"' + S + '/>';
      return svg('0 0 170 100',
        '<path fill="var(--pf)"' + S + ' d="M8,16L62,6V94L8,84Z"/>' +
        '<rect x="62" y="18" width="74" height="64" rx="8" fill="var(--pf)"' + S + '/>' +
        '<path fill="var(--pf)"' + S + ' d="M136,36H156V64H136Z"/><rect x="156" y="45" width="10" height="10" fill="var(--ph)"' + S + '/>' +
        '<path d="M80,18V82M120,18V82" stroke="var(--ps)" stroke-width=".8" opacity=".6"/>' + bolts +
        '<circle cx="100" cy="50" r="17" fill="var(--ph)"' + S + '/>' +
        '<g class="spin" style="--spin:9s;transform-origin:100px 50px"><path transform="translate(100 50) scale(.3)" fill="var(--pa, var(--pf))" fill-rule="evenodd"' + S + ' d="' + teeth(14, 48, 7) + ring(12) + '"/></g>');
    },
    // Side cut of a shaft with straight and helical gears; .g1–.g3 can be pushed apart for an exploded view.
    shaft: function () {
      var id = 'sh' + (++uid), id2 = 'hx' + uid;
      var g = function (c, x, w, h, fill) { return '<g class="' + c + '"><rect x="' + x + '" y="' + (40 - h / 2) + '" width="' + w + '" height="' + h + '" rx="2" fill="' + fill + '"' + S + '/></g>'; };
      return svg('0 0 180 80',
        '<defs><pattern id="' + id + '" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="var(--pf)"/><line x1="2" x2="2" y2="4" stroke="var(--ps)" stroke-width=".7"/></pattern>' +
        '<pattern id="' + id2 + '" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="5" height="5" fill="var(--pa, var(--pf))"/><line x1="2.5" x2="2.5" y2="5" stroke="var(--ps)" stroke-width=".7"/></pattern></defs>' +
        '<rect x="4" y="36" width="172" height="8" rx="3" fill="var(--ph)"' + S + '/>' +
        g('g1', 28, 18, 62, 'url(#' + id + ')') + g('g2', 74, 26, 44, 'url(#' + id2 + ')') + g('g3', 128, 14, 72, 'url(#' + id + ')'));
    }
  };

  // Floating field: <div class="field" data-field="gear:18,8,12,90,1,steel;..."> type:n?,x%,y%,size,depth,tone[,spin s]
  function build(field) {
    field.innerHTML = '';
    field.getAttribute('data-field').split(';').forEach(function (spec, i) {
      var parts = spec.trim().split(',');
      if (parts.length < 6) return;
      var head = parts[0].split(':'), type = head[0], n = +head[1] || undefined;
      var el = document.createElement('div');
      el.className = 'pt tone-' + parts[5];
      el.style.cssText = 'left:' + parts[1] + '%;top:' + parts[2] + '%;width:' + parts[3] + 'px;--d:' + parts[4] + ';--spin:' + (parts[6] || (24 + (i * 7) % 30)) + 's;--bob:' + (6 + (i % 4) * 1.7) + 's;--dir:' + (i % 2 ? 'reverse' : 'normal');
      el.innerHTML = '<div class="bob"><div class="spin">' + P[type]({ n: n }) + '</div></div>';
      field.appendChild(el);
    });
  }

  function init() {
    document.querySelectorAll('[data-part]').forEach(function (el) {
      var a = el.getAttribute('data-part').split(':');
      el.innerHTML = P[a[0]]({ n: +a[1] || undefined });
    });
    var fields = document.querySelectorAll('[data-field]');
    fields.forEach(build);

    // Pause spinning off-screen; parallax visible fields by depth.
    var vis = [];
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          e.target.classList.toggle('vis', e.isIntersecting);
          var i = vis.indexOf(e.target);
          if (e.isIntersecting && i < 0) vis.push(e.target); else if (!e.isIntersecting && i > -1) vis.splice(i, 1);
        });
      }, { rootMargin: '10% 0px' });
      fields.forEach(function (fl) { io.observe(fl); });
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ticking = false;
    var move = function () {
      var vh = innerHeight;
      vis.forEach(function (fl) {
        var r = fl.getBoundingClientRect(), off = (r.top + r.height / 2 - vh / 2);
        fl.querySelectorAll('.pt').forEach(function (p) {
          p.style.transform = 'translate3d(0,' + (off * -0.12 * (+p.style.getPropertyValue('--d') || 1)).toFixed(1) + 'px,0)';
        });
      });
      ticking = false;
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
    move();
  }

  window.VParts = P;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
