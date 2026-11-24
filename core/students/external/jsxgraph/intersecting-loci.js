// Intersecting loci (G12 Ch8 Loci, sec-intersecting-loci).
// Draggable A, B, C (whole-number coordinates). Check boxes switch on four loci: the perpendicular bisector of AB, the
// circle with centre C (radius slider r), the pair of lines at distance d from the line AB (slider d) and the circle with
// centre A (radius slider s). Every point of the grid where two of the ticked loci meet is marked and listed. When both circles are
// ticked, a text says whether they share two, one or no points, with the inequality that decides.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-intersecting-loci', {
        boundingbox: [-9, 11, 11, -4],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var XMIN = -8, XMAX = 10, YMIN = -3, YMAX = 6, k;
    var grey = {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false};
    for (k = XMIN; k <= XMAX; k++) { board.create('segment', [[k, YMIN], [k, YMAX]], grey); }
    for (k = YMIN; k <= YMAX; k++) { board.create('segment', [[XMIN, k], [XMAX, k]], grey); }

    var cbP = board.create('checkbox', [-8.8, 10.3, 'Perpendicular bisector of AB'], {fixed: true, fontSize: 13, checked: true});
    var cbC = board.create('checkbox', [2.2, 10.3, 'Circle centre C, radius r'], {fixed: true, fontSize: 13, checked: true});
    var cbL = board.create('checkbox', [-8.8, 9.4, 'Lines at distance d from AB'], {fixed: true, fontSize: 13});
    var cbA = board.create('checkbox', [2.2, 9.4, 'Circle centre A, radius s'], {fixed: true, fontSize: 13});
    var sl = {snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 13}};
    var r = board.create('slider', [[-8.5, 8.4], [-5.5, 8.4], [1, 3, 6]], JXG.merge(sl, {name: 'r'}));
    var d = board.create('slider', [[-2, 8.4], [1, 8.4], [0.5, 2, 4]], JXG.merge(sl, {name: 'd'}));
    var s = board.create('slider', [[4.5, 8.4], [7.5, 8.4], [1, 5, 6]], JXG.merge(sl, {name: 's'}));

    function snap(p) {
        var px = Math.max(XMIN, Math.min(XMAX, Math.round(p.X()))), py = Math.max(YMIN, Math.min(YMAX, Math.round(p.Y())));
        if (px !== p.X() || py !== p.Y()) { p.moveTo([px, py]); }
    }
    var ps = {showInfobox: false, size: 4, label: {useMathJax: false, fontSize: 15, offset: [8, 8]}};
    var A = board.create('point', [-3, 0], JXG.merge(ps, {name: 'A', color: '#1f4e9c'}));
    var B = board.create('point', [3, 0], JXG.merge(ps, {name: 'B', color: '#1f4e9c'}));
    var C = board.create('point', [4, 2], JXG.merge(ps, {name: 'C', color: '#2e7d32'}));
    [A, B, C].forEach(function (p) { p.on('drag', function () { snap(p); }); p.on('up', function () { snap(p); }); });
    board.create('segment', [A, B], {strokeColor: '#1f4e9c', strokeWidth: 1, fixed: true, highlight: false});

    // geometry of the loci
    function unit() { var ux = B.X() - A.X(), uy = B.Y() - A.Y(), L = Math.sqrt(ux * ux + uy * uy) || 1; return [ux / L, uy / L]; }
    function bis() { var u = unit(); return {t: 'L', p: [(A.X() + B.X()) / 2, (A.Y() + B.Y()) / 2], u: [-u[1], u[0]]}; }
    function par(sg) { var u = unit(), D = d.Value(); return {t: 'L', p: [A.X() - sg * D * u[1], A.Y() + sg * D * u[0]], u: u}; }
    function cirC() { return {t: 'C', c: [C.X(), C.Y()], r: r.Value()}; }
    function cirA() { return {t: 'C', c: [A.X(), A.Y()], r: s.Value()}; }
    // lines and circles are drawn only inside the grid, clear of the controls above it
    function clipT(o) {
        var lo = -1e9, hi = 1e9, q, a, c;
        for (q = 0; q < 2; q++) {
            a = q === 0 ? [XMIN, XMAX] : [YMIN, YMAX]; c = o.u[q];
            if (Math.abs(c) < 1e-12) { if (o.p[q] < a[0] || o.p[q] > a[1]) { return null; } } else {
                var t1 = (a[0] - o.p[q]) / c, t2 = (a[1] - o.p[q]) / c;
                lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2));
            }
        }
        return lo <= hi ? [lo, hi] : null;
    }
    function lineEl(f, st) {
        function end(k) { return function () { var o = f(), t = clipT(o); if (!t) { return [NaN, NaN]; } return [o.p[0] + t[k] * o.u[0], o.p[1] + t[k] * o.u[1]]; }; }
        return board.create('segment', [end(0), end(1)], JXG.merge({strokeWidth: 2, fixed: true, highlight: false}, st));
    }
    function inBox(x, y) { return x >= XMIN - 1e-9 && x <= XMAX + 1e-9 && y >= YMIN - 1e-9 && y <= YMAX + 1e-9; }
    function circEl(cx, cy, rad, st) {
        return board.create('curve', [function (t) { var x = cx() + rad() * Math.cos(t), y = cy() + rad() * Math.sin(t); return inBox(x, y) ? x : NaN; },
            function (t) { var x = cx() + rad() * Math.cos(t), y = cy() + rad() * Math.sin(t); return inBox(x, y) ? y : NaN; }, 0, 2 * Math.PI],
            JXG.merge({strokeWidth: 2, fixed: true, highlight: false, numberPointsHigh: 400}, st));
    }
    var eP = lineEl(bis, {strokeColor: '#b00000'});
    var eL1 = lineEl(function () { return par(1); }, {strokeColor: '#6a1b9a', dash: 2});
    var eL2 = lineEl(function () { return par(-1); }, {strokeColor: '#6a1b9a', dash: 2});
    var eC = circEl(function () { return C.X(); }, function () { return C.Y(); }, function () { return r.Value(); }, {strokeColor: '#2e7d32'});
    var eA = circEl(function () { return A.X(); }, function () { return A.Y(); }, function () { return s.Value(); }, {strokeColor: '#1f4e9c', dash: 3});

    function inter(a, b) {
        var out = [], t, D, h, dx, dy, dd, aa, px, py, q;
        if (a.t === 'L' && b.t === 'L') {
            D = a.u[0] * b.u[1] - a.u[1] * b.u[0];
            if (Math.abs(D) < 1e-9) { return out; }
            t = ((b.p[0] - a.p[0]) * b.u[1] - (b.p[1] - a.p[1]) * b.u[0]) / D;
            out.push([a.p[0] + t * a.u[0], a.p[1] + t * a.u[1]]); return out;
        }
        if (a.t === 'C' && b.t === 'L') { q = a; a = b; b = q; }
        if (a.t === 'L') {
            t = (b.c[0] - a.p[0]) * a.u[0] + (b.c[1] - a.p[1]) * a.u[1];
            px = a.p[0] + t * a.u[0]; py = a.p[1] + t * a.u[1];
            dd = Math.sqrt((b.c[0] - px) * (b.c[0] - px) + (b.c[1] - py) * (b.c[1] - py));
            if (dd > b.r + 1e-9) { return out; }
            h = Math.sqrt(Math.max(0, b.r * b.r - dd * dd));
            out.push([px + h * a.u[0], py + h * a.u[1]]);
            if (h > 1e-9) { out.push([px - h * a.u[0], py - h * a.u[1]]); }
            return out;
        }
        dx = b.c[0] - a.c[0]; dy = b.c[1] - a.c[1]; dd = Math.sqrt(dx * dx + dy * dy);
        if (dd < 1e-9 || dd > a.r + b.r + 1e-9 || dd < Math.abs(a.r - b.r) - 1e-9) { return out; }
        aa = (a.r * a.r - b.r * b.r + dd * dd) / (2 * dd); h = Math.sqrt(Math.max(0, a.r * a.r - aa * aa));
        px = a.c[0] + aa * dx / dd; py = a.c[1] + aa * dy / dd;
        out.push([px - h * dy / dd, py + h * dx / dd]);
        if (h > 1e-9) { out.push([px + h * dy / dd, py - h * dx / dd]); }
        return out;
    }
    var pool = [], NP = 16;
    for (k = 0; k < NP; k++) {
        pool.push(board.create('point', [0, 0], {name: '', fixed: true, visible: false, showInfobox: false, size: 5, face: 'x', strokeColor: '#000000', strokeWidth: 2, highlight: false}));
    }
    var found = [];
    function f1(v) { var x = Math.round(v * 10) / 10; return (Math.abs(x) < 0.05 ? 0 : x).toFixed(1); }
    function computeFound() {
        var loci = [], i, j, f = [];
        if (cbP.Value()) { loci.push(bis()); }
        if (cbL.Value()) { loci.push(par(1)); loci.push(par(-1)); }
        if (cbC.Value()) { loci.push(cirC()); }
        if (cbA.Value()) { loci.push(cirA()); }
        for (i = 0; i < loci.length; i++) {
            for (j = i + 1; j < loci.length; j++) {
                inter(loci[i], loci[j]).forEach(function (p) { if (inBox(p[0], p[1])) { f.push(p); } });
            }
        }
        return f;
    }
    function recompute() {
        var m, n = 0;
        found = computeFound();
        for (m = 0; m < NP; m++) {
            if (m < found.length) { pool[m].moveTo(found[m]); pool[m].setAttribute({visible: true}); n++; } else { pool[m].setAttribute({visible: false}); }
        }
        eP.setAttribute({visible: cbP.Value()}); eL1.setAttribute({visible: cbL.Value()}); eL2.setAttribute({visible: cbL.Value()});
        eC.setAttribute({visible: cbC.Value()}); eA.setAttribute({visible: cbA.Value()});
    }
    board.create('text', [-8.8, 7.4, function () {
        found = computeFound();
        if (found.length === 0) { return 'The ticked loci do not meet on the grid.'; }
        return 'Meeting points: ' + found.slice(0, 6).map(function (p) { return '(' + f1(p[0]) + ', ' + f1(p[1]) + ')'; }).join('  ') + (found.length > 6 ? ' ...' : '');
    }], {fixed: true, highlight: false, fontSize: 13, useMathJax: false});
    board.create('text', [-8.8, 6.6, function () {
        if (!(cbA.Value() && cbC.Value())) { return ''; }
        var dx = C.X() - A.X(), dy = C.Y() - A.Y(), D = Math.sqrt(dx * dx + dy * dy), R = r.Value(), S = s.Value();
        var sm = R + S, df = Math.abs(R - S), Ds = f1(D), e = 1e-9;
        if (D < e && df < e) { return 'Circles: AC = 0 and the radii are equal, so the circles are the same circle.'; }
        if (Math.abs(D - sm) < e) { return 'Circles: AC = ' + Ds + ' = r + s, so they touch at one point.'; }
        if (Math.abs(D - df) < e) { return 'Circles: AC = ' + Ds + ' = |r - s|, so they touch at one point.'; }
        if (D > sm) { return 'Circles: AC = ' + Ds + ' > r + s = ' + f1(sm) + ', so they share no points.'; }
        if (D < df) { return 'Circles: AC = ' + Ds + ' < |r - s| = ' + f1(df) + ', so one is inside the other: no points.'; }
        return 'Circles: |r - s| = ' + f1(df) + ' < AC = ' + Ds + ' < r + s = ' + f1(sm) + ', so they share two points.';
    }], {fixed: true, highlight: false, fontSize: 13, useMathJax: false});
    board.on('update', recompute);
    [cbP, cbC, cbL, cbA].forEach(function (cb) { JXG.addEvent(cb.rendNodeCheckbox, 'change', function () { board.update(); }, cb); });
    recompute();
    board.update();
})();
