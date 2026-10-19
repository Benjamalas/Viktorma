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

  // Housing ---------------------------------------------------------------
  P.case = P.gearbox;
  P.bellhousing = function () {
    var ears = '';
    for (var i = 0; i < 8; i++) { var a = i * TAU / 8 + .2; ears += '<circle cx="' + f(Math.cos(a) * 44) + '" cy="' + f(Math.sin(a) * 44) + '" r="5.5" fill="var(--pf)"' + S + '/><circle cx="' + f(Math.cos(a) * 44) + '" cy="' + f(Math.sin(a) * 44) + '" r="2" fill="var(--ph)"/>'; }
    return svg('-50 -50 100 100', ears +
      '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + ring(42) + ring(20) + '"/>' +
      '<circle r="31" fill="none" stroke="var(--ps)" stroke-width=".8" stroke-dasharray="3 3" opacity=".6"/>' +
      '<path d="M20,-36 q14,6 18,22" fill="none" stroke="var(--pa, var(--ps))" stroke-width="3" stroke-linecap="round"/>' +
      '<circle r="9" fill="var(--pa, var(--pf))"' + S + '/>');
  };
  P.gasket = function () {
    var o = 'M-44,-30Q-46,-44 -30,-44H30Q46,-44 44,-30V30Q46,44 30,44H-30Q-46,44 -44,30Z';
    var inn = 'M-32,-20Q-32,-32 -20,-32H20Q32,-32 32,-20V20Q32,32 20,32H-20Q-32,32 -32,20Z';
    var h = ''; [[-38, -38], [0, -38], [38, -38], [38, 0], [38, 38], [0, 38], [-38, 38], [-38, 0]].forEach(function (p) { h += ring(2.6, p[0], p[1]); });
    return svg('-50 -50 100 100', '<path fill="var(--pa, var(--pf))" fill-rule="evenodd"' + S + ' d="' + o + inn + h + '"/>');
  };
  P.seal = function () {
    return svg('-50 -50 100 100',
      '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + ring(48) + ring(28) + '"/>' +
      '<circle r="38" fill="none" stroke="var(--pa, var(--ps))" stroke-width="4" stroke-dasharray="1.6 1.6"/>' +
      '<circle r="32" fill="none"' + S + '/><circle r="44" fill="none" stroke="var(--ps)" stroke-width=".8" opacity=".6"/>');
  };
  P.plug = function () {
    var th = ''; for (var y = 46; y < 90; y += 6) th += 'M18,' + y + 'L42,' + (y + 4);
    return svg('0 0 60 100',
      '<rect x="8" y="6" width="44" height="28" rx="2" fill="var(--pf)"' + S + '/><path d="M23,6V34M37,6V34" stroke="var(--ps)" stroke-width=".9"/>' +
      '<rect x="4" y="34" width="52" height="7" rx="2" fill="var(--pa, var(--pf))"' + S + '/>' +
      '<rect x="16" y="41" width="28" height="51" rx="2" fill="var(--pf)"' + S + '/><path d="' + th + '" stroke="var(--ps)" stroke-width=".9"/>');
  };

  // Clutch ----------------------------------------------------------------
  P.pressure = function () {
    var fing = '';
    for (var i = 0; i < 12; i++) { var a = i * 30; fing += '<path transform="rotate(' + a + ')" d="M17,-2.4L33,-4.2L33,4.2L17,2.4Z" fill="var(--ph)"' + S + '/>'; }
    var straps = '';
    for (var j = 0; j < 3; j++) straps += '<rect transform="rotate(' + (j * 120 + 15) + ') translate(40 -4)" width="9" height="8" rx="1.5" fill="var(--pa, var(--pf))"' + S + '/>';
    return svg('-50 -50 100 100', '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + ring(48) + ring(14) + '"/>' +
      '<circle r="36" fill="none"' + S + '/>' + fing + straps);
  };
  P.flywheel = function () {
    return svg('-50 -50 100 100',
      '<path fill="var(--pf)" fill-rule="evenodd"' + S + ' d="' + teeth(72, 48, 2.6) + ring(6) + holes(6, 11, 2.2) + holes(4, 30, 3.5) + '"/>' +
      '<circle r="43" fill="none" stroke="var(--pa, var(--ps))" stroke-width="1.6"/><circle r="22" fill="none" stroke="var(--ps)" stroke-width=".8" stroke-dasharray="2 2"/>');
  };
  P.pedal = function () {
    return svg('0 0 90 130',
      '<path fill="var(--pf)"' + S + ' d="M58,8 Q70,8 70,18 L62,64 Q56,96 34,104 L28,96 Q46,88 50,62 L52,18 Q50,8 58,8Z"/>' +
      '<circle cx="60" cy="16" r="5" fill="var(--ph)"' + S + '/>' +
      '<g transform="rotate(-22 26 108)"><rect x="6" y="98" width="40" height="22" rx="5" fill="var(--pa, var(--pf))"' + S + '/>' +
      '<path d="M12,104H40M12,109H40M12,114H40" stroke="var(--ps)" stroke-width=".9"/></g>');
  };
  P.cable = function () {
    return svg('0 0 170 70',
      '<path d="M22,50 C60,52 60,14 100,16 S140,40 150,22" fill="none" stroke="var(--ps)" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M22,50 C60,52 60,14 100,16 S140,40 150,22" fill="none" stroke="var(--pf)" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="4" y="43" width="20" height="14" rx="3" fill="var(--pa, var(--pf))"' + S + '/>' +
      '<rect x="146" y="12" width="18" height="12" rx="3" fill="var(--pa, var(--pf))"' + S + ' transform="rotate(-30 155 18)"/>' +
      '<path d="M88,10V22M94,9V22M100,9V22" stroke="var(--ps)" stroke-width="1"/>');
  };
  P.master = function () {
    return svg('0 0 150 90',
      '<rect x="56" y="8" width="40" height="30" rx="4" fill="var(--pa, var(--pf))"' + S + '/><rect x="62" y="2" width="28" height="8" rx="2" fill="var(--pf)"' + S + '/>' +
      '<path d="M60,22H92" stroke="var(--ps)" stroke-width=".9" stroke-dasharray="3 2"/>' +
      '<rect x="24" y="38" width="104" height="26" rx="7" fill="var(--pf)"' + S + '/><rect x="12" y="30" width="12" height="42" rx="3" fill="var(--pf)"' + S + '/>' +
      '<circle cx="18" cy="38" r="2.2" fill="var(--ph)"/><circle cx="18" cy="64" r="2.2" fill="var(--ph)"/>' +
      '<rect x="0" y="48" width="12" height="6" fill="var(--ph)"' + S + '/><rect x="128" y="45" width="14" height="12" rx="2" fill="var(--pf)"' + S + '/>' +
      '<path d="M50,38V64M100,38V64" stroke="var(--ps)" stroke-width=".8" opacity=".6"/>');
  };
  P.slave = function () {
    return svg('0 0 150 70',
      '<rect x="12" y="28" width="20" height="14" rx="3" fill="var(--pf)"' + S + '/>' +
      '<rect x="32" y="18" width="70" height="34" rx="9" fill="var(--pf)"' + S + '/><rect x="58" y="6" width="8" height="12" rx="2" fill="var(--pa, var(--pf))"' + S + '/>' +
      '<rect x="102" y="31" width="32" height="8" fill="var(--ph)"' + S + '/><circle cx="138" cy="35" r="7" fill="var(--pf)"' + S + '/><circle cx="138" cy="35" r="2.5" fill="var(--ph)"/>' +
      '<path d="M48,18V52M86,18V52" stroke="var(--ps)" stroke-width=".8" opacity=".6"/>');
  };

  // Gearbox internals -----------------------------------------------------
  P.inputshaft = function () {
    var id = 'is' + (++uid), sp = '';
    for (var x = 8; x < 50; x += 4) sp += 'M' + x + ',24V36';
    return svg('0 0 180 60',
      '<defs><pattern id="' + id + '" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><rect width="5" height="5" fill="var(--pa, var(--pf))"/><line x1="2.5" x2="2.5" y2="5" stroke="var(--ps)" stroke-width=".7"/></pattern></defs>' +
      '<rect x="4" y="24" width="172" height="12" rx="4" fill="var(--pf)"' + S + '/><path d="' + sp + '" stroke="var(--ps)" stroke-width=".9"/>' +
      '<rect x="110" y="8" width="30" height="44" rx="3" fill="url(#' + id + ')"' + S + '/>' +
      '<rect x="150" y="18" width="14" height="24" rx="3" fill="var(--ph)"' + S + '/>');
  };
  P.outputshaft = P.shaft;
  P.fork = function () {
    return svg('0 0 120 110',
      '<rect x="48" y="4" width="24" height="30" rx="4" fill="var(--pf)"' + S + '/><circle cx="60" cy="14" r="5" fill="var(--ph)"' + S + '/>' +
      '<path fill="var(--pf)"' + S + ' d="M14,84 A46,46 0 0,1 106,84 L94,84 A34,34 0 0,0 26,84 Z"/>' +
      '<path fill="var(--pf)"' + S + ' d="M52,32 L68,32 L66,40 L54,40Z"/>' +
      '<rect x="8" y="84" width="22" height="10" rx="2" fill="var(--pa, var(--pf))"' + S + '/><rect x="90" y="84" width="22" height="10" rx="2" fill="var(--pa, var(--pf))"' + S + '/>');
  };
  P.lever = function () {
    return svg('0 0 70 150',
      '<path fill="var(--pf)"' + S + ' d="M12,146 L22,108 H48 L58,146Z"/><path d="M18,130H52M15,140H55M20,120H50" stroke="var(--ps)" stroke-width=".8" opacity=".7"/>' +
      '<rect x="31" y="30" width="8" height="80" rx="3" fill="var(--ph)"' + S + '/>' +
      '<circle cx="35" cy="22" r="18" fill="var(--pa, var(--pf))"' + S + '/>' +
      '<path d="M27,15V29M35,15V29M43,15V29M27,22H43" stroke="var(--pf)" stroke-width="1.6" stroke-linecap="round"/>');
  };
  var ROUND = { gear: 1, cutaway: 1, sprocket: 1, clutch: 1, bearing: 1, bellhousing: 1, seal: 1, pressure: 1, flywheel: 1 };

  // Floating field: <div class="field" data-field="gear:18,8,12,90,1,steel;..."> type:n?,x%,y%,size,depth,tone[,spin s]
  // Round parts spin; the rest rock gently.
  function build(field) {
    field.innerHTML = '';
    field.getAttribute('data-field').split(';').forEach(function (spec, i) {
      var parts = spec.trim().split(',');
      if (parts.length < 6) return;
      var head = parts[0].split(':'), type = head[0], n = +head[1] || undefined;
      var el = document.createElement('div');
      el.className = 'pt tone-' + parts[5];
      el.style.cssText = 'left:' + parts[1] + '%;top:' + parts[2] + '%;width:' + parts[3] + 'px;--d:' + parts[4] + ';--spin:' + (parts[6] || (24 + (i * 7) % 30)) + 's;--bob:' + (6 + (i % 4) * 1.7) + 's;--dir:' + (i % 2 ? 'reverse' : 'normal');
      el.innerHTML = '<div class="bob"><div class="' + (ROUND[type] ? 'spin' : 'rock') + '">' + P[type]({ n: n }) + '</div></div>';
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
