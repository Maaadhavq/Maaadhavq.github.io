// Replay of the Mandate Retry Sequencer's committed run: one dot per failed UPI Autopay debit.
// Data is the real per-record path from the project's ledger (data/ledger.jsonl, seed 42):
//   entry  R = stopped by a rule at entry, H = score >= 0.65, L = score < 0.15, A = agent band
//   outcome r = recovered, s = stopped by a rule, n = not retried (score too low), t = horizon ran out
//   v = an agent proposal for this record was vetoed by a rule; trailing hex = paise recovered.
(function () {
  var DATA = "Arbc609,Ar46b983,As,Ln,Ln,Ln,Ar3505cf,Ln,Rs,Rs,Rs,As,Ln,Ln,Ln,Rs,Ln,Ln,Ar37697a,Rs,Ln,Ard8f4c,Rs,Ln,Ln,Rs,Aree8ac,Rs,Ln,As,Rs,Ar23786a,Ar26fe6,Ln,Rs,Ar183f0b,Ar27402e,Ar204bdb,Ard0fc5,Rs,Ar428bb3,Rs,Ln,As,As,Ln,Ar278970,As,Ln,Ar271ec8,Hr1f599b,Ar25f4f8,Ln,Ar1ad3cf,Ln,Ln,Ardba1e,Rs,Ln,Ar3e70c5,Ln,Rs,Rs,As,Rs,Ar2be2e2,As,Rs,Hr182dc6,Ln,At,Rs,Ln,Ln,Ar418b0d,Ln,At,Ln,Ln,Ln,As,Rs,Ar3f454b,Ar2f26ef,Rs,Rs,Ar43a71f,Rs,Ln,Rs,Ln,Asv,As,Rs,Arde8f8,Ln,Ar240f7e,Ln,As,Ln,Ln,Ar432fec,Ar92dc9,Arf2699,Ar1db259,Ar4769cf,Ar33aa32,Ar1a2fe7,Ar38d32c,Ar2a827,As,Rs,Ar43bce6,Rs,Ar297c09,Ar3ecc09,Ln,Ar4a002e,Ar2153ec,Ar2ef5dc,Ar235543,Ar442141,Ln,Ar26bb4b,Ar633b8,Ar1971b9,Ar6a892,Ln,Ar284873,Ar956c7,Ln,Rs,Ln,At,Ar3a5df0,Ar3af632,Ln,Ln,At,Ar31ff3d,Ar4094c0,Ln,Hr11cca2,Rs,Rs,Ar10007,Ln,Ar1477d,Ln,As,Ln,Rs,Rs,Ar38fd29,Ln,Ar493684,Ar2afc9e,Ar290783,Asv,Ln,Ln,As,Ln,Ar44dc46,Rs,Ar1650e7,Ar1e2311,Rs,Ar2a8d8,Ar1b85f7,Ln,Ln,Rs,Ln,Ln,Arf27e3,Ln,Rs,Ar32c609,As,Ar31cfda,Rs,Ar4664fa,Ln,As,Rs,Rs,As,Rs,As,Ar98e9a,Rs,Rs,Ln,Ar1e7036,Hr266d05,Rs,Rs,Rs,As,Asv,Ln,As,As,Rs,As,Ar45bafe,Rs,Rs,Ln,At,Ar12d2a7,Arcb9f2,At,Rs,Ln,Ln,Rs,Ar464947,Ln,As,Rs,Ar12fc9e,As,Rs,Ar45b1ce,Ar1078b8,As,Ln,Rs,Rs,Ar3e8c15,Rs,As,Hrb0fe5,As,Ln,Rs,Rs,Ar82642,Ar3dfc74,As,Ar3ae10b,Ar3e1c09,As,Ln,Arcdfe6,Rs,As,Ln,As,Ar86352,Rs,Rs,Ln,As,As,Ln,Ar38e804,Rs,Asv,Ln,As,Ln,Rs,Rs,Rs,Ln,Ln,Rs,Rs,Ln,Ar1f41ab,Ar1a1805,Ln,Rs,Rs,Ln,Ln,As,As,Rs,Ln,Ln,Ln,As,Ar3f5d4c,Ln,Ar3123a0,Ar3e419d,Ln,Ar3d9dd4,Ar4bae25,Rs,Ln,Rs,Rs,As,Ar3c0705,Rs,Ar3fced6,As,Rs,Ar14e316,Ar2b2c5a,Ar3f4411,Ln,Ln,Ln,Asv,Hr29e38b,Rs,At,Ar3bd3f1,As,Rs,Ln,Ln,Rs,Rs,Are0992,As,Ar398074,Ln,At,Ar42f43a,Rs,Ar222a42,Ar232343,Ln,At,Ar72f4f,As,Ln,Hr1bb69,Ln,Ln,Ar3680df,Asv,Ln,Ln,Ar3bbc29,Ln,Ar2db884,Ln,As,Rs,Ar3421f0,Ar3d2240,Ar2c7c47,Rs,At,Ar1d231b,Rs,At,As,Ar33636c,Ar1ad3c3,Ar4b8869,Ln,Ar123ce3,Ar13a79a,Hr15cfd3,Asv,At,Rs,Ar46aa8c,Ln,Ar772f4,Ln,Ln,Rs,Ar3d7e04,Ln,Ar17a5f5,Asv,Ar2aa2f5,As,Rs,Ar56b31,As,Arf5495,Rs,Ln,Rs,Ln,Ln,Ar2a29f9,Ar3f20d6,As,Ar41b083,Rs,Ln,Hrd0603,Ln,As,Ar4660a9,Rs,Ar283624,Rs,As,Ar49730e,Asv,Ln,Asv,Rs,Rs,Rs,Ar3b923a,Rs,Rs,Rs,Ln,Rs,At,Rs,Rs,As,Rs,As,Ar3b8a7b,Ar1ad81a,As,Ar2b4957,Rs,As,Asv,Rs,Ar2f0f05,Ar30cb47,Ar1315da,Ln,At,Ln,Rs,As,Ln,Ar2b2cee,As,Ln,Ln,Ar35dabc,Ar1c2146,Rs,As,Ar10508,Hr11577b,As,Ar32ba3c,Ln,Ln,As,Ar3d225e,Ln,Ln,Ar8def5,Arab500,Ara9797,As,Ln,Arc8395,As,Ar25bf00,As,Ln,Ar2cf322,Rs,Ar40522d,Hr3afba7,Rs,Ln,Ln,Ar245393,Rs,Ar2a9ae0,Hr3d954d,Ln,Ar131aa3,Ln,Ln,Rs,Ln,Ar171429,As,Ln,Ar4494d0,At,Rs,Ar138a15,Rs,Rs,Rs,Ln,Ln,Arfab57,Ar41b0af,Ar402692,As,Rs,As";

  var canvas = document.querySelector('[data-replay-canvas]');
  if (!canvas) return;
  var fig = canvas.closest('.replay');
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var ORDER = ['r', 's', 'n', 't'];
  var recs = DATA.split(',').map(function (s, i) {
    var m = /^([RHLA])([rsnt])(v?)([0-9a-f]*)$/.exec(s);
    // deterministic jitter so a replay looks the same each time
    var h = Math.sin(i * 12.9898) * 43758.5453;
    return { entry: m[1], out: m[2], veto: !!m[3], paise: m[4] ? parseInt(m[4], 16) : 0, j: (h - Math.floor(h)) * 2 - 1 };
  });
  var totals = { r: 0, s: 0, n: 0, t: 0 };
  recs.forEach(function (r) { r.slot = totals[r.out]++; });

  var SPAWN = 11, TRAVEL = 2600;
  var END = (recs.length - 1) * SPAWN + TRAVEL;
  var W = 0, H = 0, L = null, C = {}, font = 'monospace';
  var elapsed = 0, running = false, visible = false, last = 0, raf = 0;

  var countEls = {};
  fig.querySelectorAll('[data-count]').forEach(function (el) { countEls[el.getAttribute('data-count')] = el; });
  var rupeeEl = fig.querySelector('[data-rupees]');

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    ['brass-fill', 'rose-fill', 'blue-fill', 'slate-fill', 'line', 'graphite', 'ink', 'surface'].forEach(function (k) {
      C[k] = cs.getPropertyValue('--' + k).trim();
    });
    font = cs.getPropertyValue('--f-mono').trim() || 'monospace';
  }

  function layout() {
    var pad = 6, top = 26, gap = 8;
    var narrow = W < 460;
    var trayX = W * (narrow ? 0.74 : 0.79);
    var avail = H - top - pad - gap * 3;
    var tH = 20, rest = avail - tH;
    var big = totals.r + totals.s + totals.n;
    var trays = {}, y = top;
    ORDER.forEach(function (k) {
      var h = k === 't' ? tH : rest * totals[k] / big;
      trays[k] = { x: trayX, y: y, w: W - trayX - pad, h: h, cy: y + h / 2 };
      y += h + gap;
    });
    var cy = top + (H - top - pad) / 2;
    return {
      narrow: narrow, top: top, cy: cy, trays: trays, spread: Math.min(H * 0.28, 70),
      xSrc: pad + 2, xGate: W * 0.2, xScore: W * 0.4, xAgent: W * 0.6
    };
  }

  function slotPos(k, idx) {
    var t = L.trays[k], n = totals[k];
    var pitch = Math.min(6, Math.sqrt((t.w - 4) * (t.h - 4) / n));
    var cols = Math.max(1, Math.floor((t.w - 4) / pitch));
    var col = idx % cols, row = Math.floor(idx / cols);
    return { x: t.x + 2 + pitch * (col + 0.5), y: t.y + t.h - 2 - pitch * (row + 0.5), r: Math.max(1.1, Math.min(2.3, pitch * 0.4)) };
  }

  function waypoints(d, guide) {
    var j = d.j, sp = L.spread, T = L.trays;
    var pts = [[L.xSrc, L.cy + j * sp], [L.xGate, L.cy + j * sp * 0.7]];
    var end = guide ? { x: T[d.out].x - 4, y: T[d.out].cy } : slotPos(d.out, d.slot);
    if (d.entry === 'R') {
      pts.push([L.xGate + (T.s.x - L.xGate) * 0.55, T.s.cy + j * T.s.h * 0.25]);
    } else {
      pts.push([L.xScore, L.cy + j * sp * 0.45]);
      var laneY = d.entry === 'H' ? T.r.cy : d.entry === 'L' ? T.n.cy : L.cy;
      pts.push([L.xAgent, laneY + j * (d.entry === 'A' ? 7 : 5)]);
    }
    pts.push([end.x, end.y]);
    return pts;
  }

  // Catmull-Rom through the waypoints, walked by chord length so speed stays even.
  function along(pts, s) {
    var lens = [], total = 0;
    for (var i = 0; i < pts.length - 1; i++) {
      var l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      lens.push(l); total += l;
    }
    var dist = s * total, seg = 0;
    while (seg < lens.length - 1 && dist > lens[seg]) { dist -= lens[seg]; seg++; }
    var t = lens[seg] ? Math.min(1, dist / lens[seg]) : 1;
    var p0 = pts[Math.max(0, seg - 1)], p1 = pts[seg], p2 = pts[seg + 1], p3 = pts[Math.min(pts.length - 1, seg + 2)];
    var t2 = t * t, t3 = t2 * t;
    function cr(a, b, c, d) { return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); }
    return { x: cr(p0[0], p1[0], p2[0], p3[0]), y: cr(p0[1], p1[1], p2[1], p3[1]), seg: seg, last: lens.length - 1 };
  }

  function outColor(k) { return k === 'r' ? C['brass-fill'] : k === 's' ? C['rose-fill'] : C['slate-fill']; }

  function colorFor(d, seg, lastSeg) {
    if (seg >= lastSeg) return outColor(d.out);
    if (seg === 0) return C['slate-fill'];
    if (d.entry === 'R') return C['rose-fill'];
    if (seg === 1) return C['slate-fill'];
    return d.entry === 'A' ? C['blue-fill'] : d.entry === 'H' ? C['brass-fill'] : C['slate-fill'];
  }

  function dot(x, y, r, color, hollow) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (hollow) { ctx.lineWidth = 1; ctx.strokeStyle = color; ctx.stroke(); }
    else { ctx.fillStyle = color; ctx.fill(); }
  }

  function drawStatic() {
    var T = L.trays;
    ctx.font = '500 10px ' + font;
    ctx.fillStyle = C.graphite; ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left'; ctx.fillText(L.narrow ? 'in' : '500 in', L.xSrc, 12);
    ctx.textAlign = 'center';
    ctx.fillText(L.narrow ? 'rules' : '5 rules', L.xGate, 12);
    ctx.fillText('score', L.xScore, 12);
    ctx.fillText('agent', L.xAgent, 12);
    ctx.textAlign = 'left'; ctx.fillText('outcome', T.r.x, 12);

    // lane guides
    ctx.lineWidth = 1; ctx.strokeStyle = C.line;
    [{ entry: 'R', out: 's' }, { entry: 'H', out: 'r' }, { entry: 'L', out: 'n' }, { entry: 'A', out: 'r' }, { entry: 'A', out: 's' }, { entry: 'A', out: 't' }].forEach(function (g) {
      var pts = waypoints({ entry: g.entry, out: g.out, j: 0 }, true);
      ctx.beginPath();
      for (var s = 0; s <= 1.0001; s += 0.02) { var p = along(pts, s); if (s === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
      ctx.stroke();
    });

    // rule gate
    ctx.fillStyle = C['rose-fill'];
    ctx.fillRect(L.xGate - 1.5, L.cy - L.spread - 8, 3, (L.spread + 8) * 2);
    // score scale
    ctx.fillStyle = C['slate-fill'];
    ctx.fillRect(L.xScore - 1, L.cy - L.spread * 0.6, 2, L.spread * 1.2);
    // agent node
    ctx.beginPath(); ctx.arc(L.xAgent, L.cy, 9, 0, Math.PI * 2);
    ctx.fillStyle = C.surface; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C['blue-fill']; ctx.stroke();

    // trays
    ORDER.forEach(function (k) {
      var t = T[k];
      ctx.globalAlpha = 0.12; ctx.fillStyle = outColor(k);
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = outColor(k); ctx.fillRect(t.x - 3, t.y, 2, t.h);
    });
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawStatic();
    var counts = { r: 0, s: 0, n: 0, t: 0, v: 0 }, paise = 0;
    for (var i = 0; i < recs.length; i++) {
      var d = recs[i];
      var p = (elapsed - i * SPAWN) / TRAVEL;
      if (p <= 0) continue;
      if (p >= 1) {
        var sp = slotPos(d.out, d.slot);
        dot(sp.x, sp.y, sp.r, outColor(d.out), d.out === 't');
        counts[d.out]++; paise += d.paise;
        if (d.veto) counts.v++;
        continue;
      }
      var e = 1 - Math.pow(1 - p, 1.35);
      var pos = along(waypoints(d), e);
      dot(pos.x, pos.y, 2.3, colorFor(d, pos.seg, pos.last), false);
      if (d.veto && pos.seg >= pos.last) {
        counts.v++;
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.lineWidth = 1.5; ctx.strokeStyle = C['rose-fill']; ctx.stroke();
      }
    }
    Object.keys(countEls).forEach(function (k) { countEls[k].textContent = counts[k]; });
    if (rupeeEl) rupeeEl.textContent = '₹' + Math.round(paise / 100).toLocaleString('en-IN');
  }

  function tick(now) {
    raf = 0;
    if (!running) return;
    var dt = Math.min(50, now - (last || now));
    last = now; elapsed += dt;
    if (elapsed >= END) { elapsed = END; running = false; fig.classList.add('done'); }
    frame();
    if (running) raf = requestAnimationFrame(tick);
  }

  function play() {
    if (reduce.matches) { elapsed = END; frame(); return; }
    if (elapsed >= END) return;
    running = true; last = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function pause() { running = false; }

  function resize() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    L = layout();
    frame();
  }

  readColors();
  resize();
  if (reduce.matches) { elapsed = END; frame(); }

  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(function () { readColors(); frame(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (document.fonts) document.fonts.ready.then(function () { readColors(); frame(); });

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) play(); else pause();
  }, { threshold: 0.3 }).observe(canvas);

  var btn = fig.querySelector('[data-replay]');
  if (btn) btn.addEventListener('click', function () {
    elapsed = reduce.matches ? END : 0;
    fig.classList.remove('done');
    frame();
    play();
  });
})();
