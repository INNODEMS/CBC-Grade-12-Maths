// Several inequalities on one grid (G12 Ch4 Linear Inequalities,
// sec-graphical-solutions-of-simultaneous-linear-inequalities). Four preset systems, chosen with the button
// Next system. Each inequality has a checkbox that turns the shading of its UNWANTED side on or off (the board
// rectangle clipped to the side where it is false, Sutherland and Hodgman, grey at opacity 0.3, so overlaps look
// darker). Boundaries are solid for <= and >= and dashed for < and >. When every inequality is shaded the clear
// region R is labelled. The checkbox Whole-number points shows the whole-number points in R as dots and counts them
// (7, 23, 20 and 11 for the four systems). Each system has its own grid scale, drawn inside a fixed frame.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-three-inequalities', {
        boundingbox: [0, 12, 16, 0],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    // copy-merge (JXG.merge changes its first argument)
    function mg(a, b) { var o = {}, k; for (k in a) { o[k] = a[k]; } for (k in b) { o[k] = b[k]; } return o; }
    var fix = {fixed: true, highlight: false};
    var txt = {fixed: true, highlight: false, useMathJax: false};

    // each inequality is [a, b, c, rel] for a u + b v rel c, with u across and v up
    var SYS = [
        {u: 'x', v: 'y', box: [-1, 9, -1, 4], vstep: 1, L: [[1, 0, 1, 'ge'], [0, 1, 0, 'gt'], [3, 8, 24, 'le']]},
        {u: 'x', v: 'y', box: [-1, 8, -1, 6], vstep: 1, L: [[1, 0, 0, 'ge'], [0, 1, 0, 'ge'], [1, 0, 6, 'lt'], [5, 7, 35, 'le']]},
        {u: 'x', v: 'y', box: [-1, 10, -2, 5], vstep: 1, L: [[1, 0, 0, 'ge'], [0, 1, -1, 'ge'], [1, 0, 4, 'lt'], [4, 9, 36, 'le']]},
        {u: 'b', v: 'm', box: [-1, 5, -1, 14], vstep: 2, L: [[7, 2, 28, 'ge'], [1, 0, 3, 'le'], [0, 1, 10, 'le']]}
    ];
    var SG = {lt: '<', le: '≤', gt: '>', ge: '≥'};
    var cur = 0;
    var on = [true, true, true, true];
    // the frame on the board: u from F0 to F1 across, v from G0 to G1 up
    var F0 = 1.2, F1 = 10.6, G0 = 1.4, G1 = 11.4;
    function S() { return SYS[cur]; }
    function bx(u) { var b = S().box; return F0 + (u - b[0]) * (F1 - F0) / (b[1] - b[0]); }
    function by(v) { var b = S().box; return G0 + (v - b[2]) * (G1 - G0) / (b[3] - b[2]); }
    function num(v) { return v < 0 ? '−' + (-v) : String(v); }
    function term(c, w, first) {
        var m = Math.abs(c), s = (m === 1 ? '' : String(m)) + w;
        if (first) { return (c < 0 ? '−' : '') + s; }
        return (c < 0 ? ' − ' : ' + ') + s;
    }
    function show(l) {
        var s = '';
        if (l[0] !== 0) { s += term(l[0], S().u, true); }
        if (l[1] !== 0) { s += term(l[1], S().v, s === ''); }
        return s + ' ' + SG[l[3]] + ' ' + num(l[2]);
    }
    function holds(l, u, v) {
        var w = l[0] * u + l[1] * v, c = l[2];
        return l[3] === 'lt' ? w < c : l[3] === 'le' ? w <= c : l[3] === 'gt' ? w > c : w >= c;
    }
    function clip(P, f) {
        var out = [], i, p, q, fp, fq, t;
        for (i = 0; i < P.length; i++) {
            p = P[i]; q = P[(i + 1) % P.length]; fp = f(p); fq = f(q);
            if (fp >= 0) { out.push(p); }
            if ((fp >= 0) !== (fq >= 0)) { t = fp / (fp - fq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
        }
        return out;
    }
    function frame() { var b = S().box; return [[b[0], b[2]], [b[1], b[2]], [b[1], b[3]], [b[0], b[3]]]; }
    // f >= 0 on the unwanted side (closed), f <= 0 on the wanted side
    function bad(l) { var s = (l[3] === 'lt' || l[3] === 'le') ? 1 : -1; return function (p) { return s * (l[0] * p[0] + l[1] * p[1] - l[2]); }; }
    function good(l) { var f = bad(l); return function (p) { return -f(p); }; }
    function n() { return S().L.length; }

    // grid (one curve), axes and numbers, redrawn for each system
    var grid = board.create('curve', [[], []], mg(fix, {strokeColor: '#dddddd', strokeWidth: 1}));
    grid.updateDataArray = function () {
        var b = S().box, X = [], Y = [], k;
        for (k = b[0]; k <= b[1]; k++) { X.push(bx(k), bx(k), NaN); Y.push(by(b[2]), by(b[3]), NaN); }
        for (k = b[2]; k <= b[3]; k++) { X.push(bx(b[0]), bx(b[1]), NaN); Y.push(by(k), by(k), NaN); }
        this.dataX = X; this.dataY = Y;
    };
    board.create('arrow', [[function () { return bx(S().box[0]); }, function () { return by(0); }], [function () { return bx(S().box[1]) + 0.35; }, function () { return by(0); }]],
        mg(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[function () { return bx(0); }, function () { return by(S().box[2]); }], [function () { return bx(0); }, function () { return by(S().box[3]) + 0.35; }]],
        mg(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('text', [function () { return bx(S().box[1]) + 0.4; }, function () { return by(0); }, function () { return S().u; }],
        mg(txt, {anchorY: 'middle', fontSize: 15, cssStyle: 'font-style: italic;'}));
    board.create('text', [function () { return bx(0) + 0.15; }, function () { return by(S().box[3]) + 0.4; }, function () { return S().v; }],
        mg(txt, {anchorY: 'middle', fontSize: 15, cssStyle: 'font-style: italic;'}));
    var k;
    for (k = -2; k <= 14; k++) {
        (function (k) {
            board.create('text', [function () { return bx(k); }, function () { return by(0) - 0.1; }, num(k)],
                mg(txt, {anchorX: 'middle', anchorY: 'top', fontSize: 11,
                    visible: function () { return k !== 0 && k >= S().box[0] && k <= S().box[1]; }}));
            board.create('text', [function () { return bx(0) - 0.1; }, function () { return by(k); }, num(k)],
                mg(txt, {anchorX: 'right', anchorY: 'middle', fontSize: 11,
                    visible: function () { return k !== 0 && k >= S().box[2] && k <= S().box[3] && k % S().vstep === 0; }}));
        })(k);
    }

    // shading and boundaries, one per possible inequality
    var shades = [], lines = [];
    function poly(P) {
        var X = [], Y = [], i;
        for (i = 0; i < P.length; i++) { X.push(bx(P[i][0])); Y.push(by(P[i][1])); }
        if (P.length) { X.push(bx(P[0][0])); Y.push(by(P[0][1])); }
        return [X, Y];
    }
    for (k = 0; k < 4; k++) {
        (function (k) {
            shades[k] = board.create('curve', [[], []], mg(fix, {strokeWidth: 0, fillColor: '#808080', fillOpacity: 0.3}));
            shades[k].updateDataArray = function () {
                var D = (k < n() && on[k]) ? poly(clip(frame(), bad(S().L[k]))) : [[], []];
                this.dataX = D[0]; this.dataY = D[1];
            };
            lines[k] = board.create('curve', [[], []], mg(fix, {strokeColor: '#000000', strokeWidth: 2.5}));
            lines[k].updateDataArray = function () {
                var X = [], Y = [], pts = [], b = S().box, l, x, y;
                if (k < n()) {
                    l = S().L[k];
                    if (l[1] !== 0) { [b[0], b[1]].forEach(function (u) { y = (l[2] - l[0] * u) / l[1]; if (y >= b[2] - 1e-9 && y <= b[3] + 1e-9) { pts.push([u, y]); } }); }
                    if (l[0] !== 0) { [b[2], b[3]].forEach(function (v) { x = (l[2] - l[1] * v) / l[0]; if (x >= b[0] - 1e-9 && x <= b[1] + 1e-9) { pts.push([x, v]); } }); }
                    if (pts.length >= 2) {
                        pts.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
                        X = [bx(pts[0][0]), bx(pts[pts.length - 1][0])]; Y = [by(pts[0][1]), by(pts[pts.length - 1][1])];
                    }
                }
                this.dataX = X; this.dataY = Y;
            };
        })(k);
    }
    function restyle() {
        for (k = 0; k < 4; k++) {
            if (k < n()) { lines[k].setAttribute({dash: (S().L[k][3] === 'lt' || S().L[k][3] === 'gt') ? 2 : 0}); }
        }
    }

    function allOn() { var i; for (i = 0; i < n(); i++) { if (!on[i]) { return false; } } return true; }
    function clearPoly() { var P = frame(), i; for (i = 0; i < n(); i++) { P = clip(P, good(S().L[i])); } return P; }
    function centroid() {
        var P = clearPoly(), i, j, ar = 0, cx = 0, cy = 0, cr;
        for (i = 0; i < P.length; i++) {
            j = (i + 1) % P.length; cr = P[i][0] * P[j][1] - P[j][0] * P[i][1];
            ar += cr; cx += (P[i][0] + P[j][0]) * cr; cy += (P[i][1] + P[j][1]) * cr;
        }
        if (Math.abs(ar) < 1e-9) { return [0, 0]; }
        return [cx / (3 * ar), cy / (3 * ar)];
    }
    // R is drawn a little to the right of the centroid of the clear region, so it does not sit on a whole-number dot
    board.create('text', [function () { return bx(centroid()[0]) + 0.3; }, function () { return by(centroid()[1]) + 0.25; }, 'R'],
        mg(txt, {anchorX: 'middle', anchorY: 'middle', fontSize: 22, cssStyle: 'font-weight: bold; font-style: italic;',
            visible: function () { return allOn(); }}));

    function lattice() {
        var b = S().box, out = [], u, v, i, okp;
        for (u = Math.ceil(b[0]); u <= b[1]; u++) {
            for (v = Math.ceil(b[2]); v <= b[3]; v++) {
                okp = true;
                for (i = 0; i < n(); i++) { if (!holds(S().L[i], u, v)) { okp = false; } }
                if (okp) { out.push([u, v]); }
            }
        }
        return out;
    }
    var wcb = board.create('checkbox', [11.2, 6.0, 'Whole-number points'], {fixed: true, fontSize: 14, useMathJax: false});
    var dotPts = [];
    for (k = 0; k < 40; k++) {
        (function (k) {
            dotPts.push(board.create('point', [function () { var L = lattice(); return k < L.length ? bx(L[k][0]) : 0; },
                function () { var L = lattice(); return k < L.length ? by(L[k][1]) : 0; }],
                {fixed: true, highlight: false, withLabel: false, showInfobox: false, size: 3, strokeColor: '#000000', fillColor: '#000000',
                    visible: function () { return wcb.Value() && k < lattice().length; }}));
        })(k);
    }
    board.create('text', [11.2, 5.3, function () { return wcb.Value() ? 'Whole-number points in R: ' + lattice().length : ''; }],
        mg(txt, {anchorY: 'middle', fontSize: 14}));

    // one checkbox per inequality, with a separate text beside it (the text changes with the system)
    var cbs = [];
    for (k = 0; k < 4; k++) {
        (function (k) {
            cbs[k] = board.create('checkbox', [11.2, 9.6 - 0.8 * k, ''], {fixed: true, checked: true, useMathJax: false,
                visible: function () { return k < n(); }});
            cbs[k].rendNodeCheckbox.addEventListener('change', function () { on[k] = cbs[k].rendNodeCheckbox.checked; board.update(); });
            board.create('text', [11.75, 9.6 - 0.8 * k, function () { return k < n() ? show(S().L[k]) : ''; }],
                mg(txt, {anchorY: 'middle', fontSize: 15}));
        })(k);
    }
    board.create('button', [11.2, 11.5, 'Next system', function () {
        cur = (cur + 1) % SYS.length;
        for (k = 0; k < 4; k++) { on[k] = true; if (cbs[k].rendNodeCheckbox) { cbs[k].rendNodeCheckbox.checked = true; } }
        restyle(); board.update();
    }], {fixed: true, fontSize: 14, useMathJax: false});
    board.create('text', [11.2, 10.5, function () { return 'System ' + (cur + 1) + ' of 4'; }], mg(txt, {anchorY: 'middle', fontSize: 13}));
    board.create('polygon', [[1.2, 0.3], [1.6, 0.3], [1.6, 0.65], [1.2, 0.65]],
        {fillColor: '#808080', fillOpacity: 0.3, borders: {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false},
            vertices: {visible: false}, fixed: true, highlight: false, hasInnerPoints: false});
    board.create('text', [1.8, 0.48, 'Shaded, not wanted; unshaded (R), the required region.'], mg(txt, {anchorY: 'middle', fontSize: 13}));

    restyle();
    // test hook (no effect in the book)
    board.threeTest = {cur: function () { return cur; }, count: function () { return lattice().length; }, lattice: lattice, centroid: centroid,
        allOn: allOn, shadeN: function (k) { return shades[k].dataX.length; }, lineN: function (k) { return lines[k].dataX.length; },
        dash: function (k) { return lines[k].visProp.dash; }, label: function (k) { return k < n() ? show(S().L[k]) : ''; },
        tick: function (k, v) { if (cbs[k].rendNodeCheckbox.checked !== v) { cbs[k].rendNodeCheckbox.click(); } },
        whole: function (v) { if (wcb.rendNodeCheckbox.checked !== v) { wcb.rendNodeCheckbox.click(); } board.fullUpdate(); }};
    board.update();
})();
