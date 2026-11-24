// Feasible region explorer (G12 Ch5 Linear Programming, sec-graphing-linear-inequalities, lesson 2.1).
// Three constraints a x + b y (rel) c, each with sliders a, b (0 to 9) and c (0 to 48), a button that
// switches the sign between "at most" and "at least", and a button that switches the boundary between
// solid (<=, >=: points on the line allowed) and dashed (<, >: not allowed). x >= 0 and y >= 0 always hold.
// The unwanted side of each boundary is shaded grey (opacity 0.25, so overlaps darken); the region R left
// clear is outlined, and its corners are listed (computed by clipping the plotted square, 0 to 15 by 0 to 12).
// A corner on the edge of the plotted square is not a true vertex: the text then says R continues off the board.
// Default: 3x + 7y <= 42, 6x + y <= 36, y >= 1; R has corners (0, 1), (35/6, 1), (70/13, 48/13), (0, 6).
// Instruction check: c of the third constraint at 6 leaves the single point (0, 6); at 7 R is empty.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-lp-feasible-region', {
        boundingbox: [-1.6, 13.4, 30.4, -2.8],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var XM = 15, YM = 12, EPS = 1e-9;
    var plain = {useMathJax: false, fixed: true, highlight: false};

    // grid and axes of the plot
    var i;
    for (i = 1; i <= XM; i++) {
        board.create('segment', [[i, 0], [i, YM]], {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false});
    }
    for (i = 1; i <= YM; i++) {
        board.create('segment', [[0, i], [XM, i]], {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false});
    }
    board.create('arrow', [[0, 0], [XM + 0.6, 0]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    board.create('arrow', [[0, 0], [0, YM + 0.6]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    for (i = 2; i <= XM; i += 2) {
        board.create('text', [i, -0.15, String(i)], JXG.merge(plain, {anchorX: 'middle', anchorY: 'top', fontSize: 12}));
    }
    for (i = 2; i <= YM; i += 2) {
        board.create('text', [-0.2, i, String(i)], JXG.merge(plain, {anchorX: 'right', anchorY: 'middle', fontSize: 12}));
    }
    board.create('text', [XM + 0.7, 0, 'x'], JXG.merge(plain, {anchorY: 'middle', fontSize: 15}));
    board.create('text', [0, YM + 0.9, 'y'], JXG.merge(plain, {anchorX: 'middle', fontSize: 15}));

    // constraints: ge = true for "at least", strict = true for a dashed boundary
    var C = [
        {a: 3, b: 7, c: 42, ge: false, strict: false},
        {a: 6, b: 1, c: 36, ge: false, strict: false},
        {a: 0, b: 1, c: 1, ge: true, strict: false}
    ];
    var X0 = 17.2, panelTop = [12.9, 8.6, 4.3];
    var sl = [];
    function mk(k, name, row, max, val) {
        var y = panelTop[k] - 0.9 - 0.85 * row;
        return board.create('slider', [[X0 + 0.6, y], [X0 + 6.6, y], [0, val, max]], {
            name: name, snapWidth: 1, precision: 0, withTicks: false,
            label: {useMathJax: false, fontSize: 13}
        });
    }
    function relText(k) {
        var s = C[k];
        if (s.ge) { return s.strict ? '>' : '≥'; }
        return s.strict ? '<' : '≤';
    }
    function term(v, letter, first) {
        if (v === 0) { return ''; }
        var t = (v === 1 ? '' : String(v)) + letter;
        return first ? t : ' + ' + t;
    }
    function formula(k) {
        var a = sl[k].a.Value(), b = sl[k].b.Value(), c = sl[k].c.Value();
        var lhs = term(a, 'x', true) + term(b, 'y', a === 0);
        if (lhs === '') { lhs = '0'; }
        return lhs + ' ' + relText(k) + ' ' + c;
    }
    function makePanel(k) {
        sl[k] = {a: mk(k, 'a', 0, 9, C[k].a), b: mk(k, 'b', 1, 9, C[k].b), c: mk(k, 'c', 2, 48, C[k].c)};
        board.create('text', [X0, panelTop[k], function () { return 'Constraint ' + (k + 1) + ':  ' + formula(k); }],
            JXG.merge(plain, {anchorY: 'middle', fontSize: 14}));
        board.create('button', [X0 + 9.0, panelTop[k] - 1.0, function () { return C[k].ge ? 'sign: at least' : 'sign: at most'; },
            function () { C[k].ge = !C[k].ge; board.update(); }], {fixed: true, fontSize: 13, useMathJax: false});
        board.create('button', [X0 + 9.0, panelTop[k] - 2.4, function () { return C[k].strict ? 'line: dashed' : 'line: solid'; },
            function () { C[k].strict = !C[k].strict; board.update(); }], {fixed: true, fontSize: 13, useMathJax: false});
    }
    makePanel(0); makePanel(1); makePanel(2);

    function cur(k) {
        return {a: sl[k].a.Value(), b: sl[k].b.Value(), c: sl[k].c.Value(), ge: C[k].ge, strict: C[k].strict};
    }
    // keep the side where s*(a x + b y - c) >= 0 (Sutherland-Hodgman against one half-plane)
    function clip(poly, a, b, c, s) {
        var out = [], n = poly.length, j, P, Q, fp, fq, t;
        for (j = 0; j < n; j++) {
            P = poly[j]; Q = poly[(j + 1) % n];
            fp = s * (a * P[0] + b * P[1] - c); fq = s * (a * Q[0] + b * Q[1] - c);
            if (fp >= -EPS) { out.push(P); }
            if ((fp >= -EPS) !== (fq >= -EPS) && Math.abs(fp - fq) > EPS) {
                t = fp / (fp - fq);
                out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
            }
        }
        return out;
    }
    function square() { return [[0, 0], [XM, 0], [XM, YM], [0, YM]]; }
    function area(p) {
        var s = 0, j, n = p.length;
        for (j = 0; j < n; j++) { s += p[j][0] * p[(j + 1) % n][1] - p[(j + 1) % n][0] * p[j][1]; }
        return Math.abs(s) / 2;
    }
    // a constraint with a = b = 0 has no line: it holds everywhere or nowhere
    function trivial(s) {
        if (s.a !== 0 || s.b !== 0) { return null; }
        if (s.ge) { return s.strict ? (0 > s.c) : (0 >= s.c); }
        return s.strict ? (0 < s.c) : (0 <= s.c);
    }
    function unwanted(k) {
        var s = cur(k), t = trivial(s);
        if (t !== null) { return t ? [] : square(); }
        return clip(square(), s.a, s.b, s.c, s.ge ? -1 : 1);
    }
    function region() {
        var p = square(), k, s, t;
        for (k = 0; k < 3; k++) {
            s = cur(k); t = trivial(s);
            if (t === false) { return []; }
            if (t === null) { p = clip(p, s.a, s.b, s.c, s.ge ? 1 : -1); }
            if (p.length < 3) { return []; }
        }
        return area(p) < 1e-6 ? [] : p;
    }
    // When R has no area it may still be a single point or a segment (c = 6 in the
    // default leaves only (0, 6)); list what is left, without points on a dashed boundary
    function degenerate() {
        var p = square(), k, s, t, q = [], j, m, ok, v;
        for (k = 0; k < 3; k++) {
            s = cur(k); t = trivial(s);
            if (t === false) { return []; }
            if (t === null) { p = clip(p, s.a, s.b, s.c, s.ge ? 1 : -1); }
        }
        for (j = 0; j < p.length; j++) {
            ok = true;
            for (k = 0; k < 3; k++) {
                s = cur(k);
                if (s.strict && (s.a !== 0 || s.b !== 0)) {
                    v = (s.ge ? 1 : -1) * (s.a * p[j][0] + s.b * p[j][1] - s.c);
                    if (v <= 1e-7) { ok = false; }
                }
            }
            for (m = 0; m < q.length && ok; m++) {
                if (Math.abs(q[m][0] - p[j][0]) < 1e-7 && Math.abs(q[m][1] - p[j][1]) < 1e-7) { ok = false; }
            }
            if (ok) { q.push(p[j]); }
        }
        return q;
    }

    function fillCurve(k) {
        var cv = board.create('curve', [[], []], {strokeWidth: 0, fillColor: '#555555', fillOpacity: 0.25, fixed: true, highlight: false});
        cv.updateDataArray = function () {
            var p = unwanted(k), X = [], Y = [], j;
            for (j = 0; j < p.length; j++) { X.push(p[j][0]); Y.push(p[j][1]); }
            if (p.length) { X.push(p[0][0]); Y.push(p[0][1]); }
            this.dataX = X; this.dataY = Y;
        };
    }
    function lineCurve(k) {
        var cv = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 2.5, fixed: true, highlight: false});
        cv.updateDataArray = function () {
            var s = cur(k), pts = [], X = [], Y = [], x, y;
            if (s.a !== 0 || s.b !== 0) {
                if (s.b !== 0) {
                    y = s.c / s.b; if (y >= -EPS && y <= YM + EPS) { pts.push([0, y]); }
                    y = (s.c - s.a * XM) / s.b; if (y >= -EPS && y <= YM + EPS) { pts.push([XM, y]); }
                }
                if (s.a !== 0) {
                    x = s.c / s.a; if (x >= -EPS && x <= XM + EPS) { pts.push([x, 0]); }
                    x = (s.c - s.b * YM) / s.a; if (x >= -EPS && x <= XM + EPS) { pts.push([x, YM]); }
                }
            }
            if (pts.length >= 2) { X = [pts[0][0], pts[pts.length - 1][0]]; Y = [pts[0][1], pts[pts.length - 1][1]]; }
            this.dataX = X; this.dataY = Y;
            this.setAttribute({dash: s.strict ? 3 : 0});
        };
        return cv;
    }
    for (i = 0; i < 3; i++) { fillCurve(i); }
    // R's outline goes under the boundary lines, so a dashed edge still shows its dashes
    var outline = board.create('curve', [[], []], {strokeColor: '#1f5fbf', strokeWidth: 5, strokeOpacity: 0.45, fixed: true, highlight: false});
    outline.updateDataArray = function () {
        var p = region(), X = [], Y = [], j;
        for (j = 0; j < p.length; j++) { X.push(p[j][0]); Y.push(p[j][1]); }
        if (p.length) { X.push(p[0][0]); Y.push(p[0][1]); }
        this.dataX = X; this.dataY = Y;
    };
    for (i = 0; i < 3; i++) { lineCurve(i); }

    function centre() {
        var p = region(), sx = 0, sy = 0, j;
        if (!p.length) { return [-100, -100]; }
        for (j = 0; j < p.length; j++) { sx += p[j][0]; sy += p[j][1]; }
        return [sx / p.length, sy / p.length];
    }
    board.create('text', [function () { return centre()[0]; }, function () { return centre()[1]; }, 'R'],
        JXG.merge(plain, {anchorX: 'middle', anchorY: 'middle', fontSize: 20}));

    function r2(v) {
        var t = Math.round(v * 100) / 100;
        if (Math.abs(t) < 0.005) { t = 0; }
        return String(t);
    }
    function report() {
        var p = region(), out = [], off = false, j;
        if (!p.length) {
            var d = degenerate();
            if (d.length === 1) { return 'R has shrunk to the single point (' + r2(d[0][0]) + ', ' + r2(d[0][1]) + ').'; }
            if (d.length >= 2) { return 'R has shrunk to a line segment from (' + r2(d[0][0]) + ', ' + r2(d[0][1]) + ') to (' + r2(d[d.length - 1][0]) + ', ' + r2(d[d.length - 1][1]) + ').'; }
            return 'R is empty: no point satisfies every constraint.';
        }
        for (j = 0; j < p.length; j++) {
            out.push('(' + r2(p[j][0]) + ', ' + r2(p[j][1]) + ')');
            if (Math.abs(p[j][0] - XM) < 1e-7 || Math.abs(p[j][1] - YM) < 1e-7) { off = true; }
        }
        return 'Vertices: ' + out.join(', ') + (off ? '.<br>R continues off the board, so a corner on its edge is not a vertex.' : '.');
    }
    board.create('text', [0, -0.9, report], JXG.merge(plain, {anchorX: 'left', anchorY: 'top', fontSize: 13}));
    board.create('text', [X0, 0.6, 'Key: shaded, not wanted; R, required region.'], JXG.merge(plain, {anchorY: 'middle', fontSize: 13}));

    // test hook (no effect in the book)
    board.lpTest = {sliders: sl, C: C, region: region, report: report};
    board.update();
})();
