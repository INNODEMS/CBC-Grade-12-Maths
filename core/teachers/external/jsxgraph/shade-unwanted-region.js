// Shading the unwanted region (G12 Ch4 Linear Inequalities, sec-graphical-representation-of-linear-inequalities).
// Sliders a, b, c (whole numbers from -6 to 6) set the inequality a x + b y ? c; the button Sign cycles the sign
// through <, <=, >, >=. The boundary a x + b y = c is drawn solid for <= and >= (included) and dashed for < and >
// (not included). The book shades the UNWANTED side: the board rectangle is clipped to the side where the inequality
// is false (Sutherland and Hodgman) and filled grey, so the required region R stays clear. A draggable point Q
// (whole-number coordinates) reports the value of a x + b y and where it lies. If a = b = 0 nothing is drawn.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-shade-unwanted-region', {
        boundingbox: [-9.5, 10, 9.5, -9],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var XMIN = -7, XMAX = 7, YMIN = -7, YMAX = 7;
    var SG = ['<', '≤', '>', '≥'];
    var sign = 1;
    // copy-merge (JXG.merge changes its first argument)
    function mg(a, b) { var o = {}, k; for (k in a) { o[k] = a[k]; } for (k in b) { o[k] = b[k]; } return o; }
    var fix = {fixed: true, highlight: false};
    var txt = {fixed: true, highlight: false, useMathJax: false};

    // grid, frame and axes (numbers every 2)
    var k;
    for (k = XMIN; k <= XMAX; k++) {
        board.create('segment', [[k, YMIN], [k, YMAX]], mg(fix, {strokeColor: '#dddddd', strokeWidth: 1}));
        board.create('segment', [[XMIN, k], [XMAX, k]], mg(fix, {strokeColor: '#dddddd', strokeWidth: 1}));
        if (k !== 0 && k % 2 === 0) {
            board.create('text', [k, -0.35, String(k).replace('-', '−')], mg(txt, {anchorX: 'middle', anchorY: 'top', fontSize: 11}));
            board.create('text', [-0.25, k, String(k).replace('-', '−')], mg(txt, {anchorX: 'right', anchorY: 'middle', fontSize: 11}));
        }
    }
    board.create('arrow', [[XMIN, 0], [XMAX + 0.5, 0]], mg(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[0, YMIN], [0, YMAX + 0.5]], mg(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('text', [XMAX + 0.6, 0, 'x'], mg(txt, {anchorY: 'middle', fontSize: 15, cssStyle: 'font-style: italic;'}));
    board.create('text', [0.2, YMAX + 0.6, 'y'], mg(txt, {anchorY: 'middle', fontSize: 15, cssStyle: 'font-style: italic;'}));

    var sOpt = {snapWidth: 1, precision: 0, label: {useMathJax: false, fontSize: 14}};
    var aS = board.create('slider', [[-8.5, 9.2], [-4, 9.2], [-6, 1, 6]], mg(sOpt, {name: 'a'}));
    var bS = board.create('slider', [[-1.5, 9.2], [3, 9.2], [-6, -6, 6]], mg(sOpt, {name: 'b'}));
    var cS = board.create('slider', [[-8.5, 8.2], [-4, 8.2], [-6, -6, 6]], mg(sOpt, {name: 'c'}));
    function A() { return Math.round(aS.Value()); }
    function B() { return Math.round(bS.Value()); }
    function C() { return Math.round(cS.Value()); }
    function strict() { return sign === 0 || sign === 2; }
    function lessSide() { return sign === 0 || sign === 1; }
    function ok() { return A() !== 0 || B() !== 0; }

    // display string: coefficient 1 dropped, zero terms dropped, no "+ -"
    function num(v) { return v < 0 ? '−' + (-v) : String(v); }
    function term(c, v, first) {
        var m = Math.abs(c), s = (m === 1 ? '' : String(m)) + v;
        if (first) { return (c < 0 ? '−' : '') + s; }
        return (c < 0 ? ' − ' : ' + ') + s;
    }
    function lhs() {
        var s = '';
        if (A() !== 0) { s += term(A(), 'x', true); }
        if (B() !== 0) { s += term(B(), 'y', s === ''); }
        return s;
    }
    function ineq() { return lhs() + ' ' + SG[sign] + ' ' + num(C()); }

    // Sutherland and Hodgman: keep the part of polygon P where f(p) >= 0
    function clip(P, f) {
        var out = [], i, p, q, fp, fq, t;
        for (i = 0; i < P.length; i++) {
            p = P[i]; q = P[(i + 1) % P.length]; fp = f(p); fq = f(q);
            if (fp >= 0) { out.push(p); }
            if ((fp >= 0) !== (fq >= 0)) { t = fp / (fp - fq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
        }
        return out;
    }
    var FRAME = [[XMIN, YMIN], [XMAX, YMIN], [XMAX, YMAX], [XMIN, YMAX]];
    // unwanted side: a x + b y >= c when the sign is < or <=, else a x + b y <= c
    function unwanted(p) { var v = A() * p[0] + B() * p[1] - C(); return lessSide() ? v : -v; }
    function wanted(p) { return -unwanted(p); }
    var shade = board.create('curve', [[], []], mg(fix, {strokeWidth: 0, fillColor: '#808080', fillOpacity: 0.3}));
    shade.updateDataArray = function () {
        var P = ok() ? clip(FRAME, unwanted) : [], X = [], Y = [], i;
        for (i = 0; i < P.length; i++) { X.push(P[i][0]); Y.push(P[i][1]); }
        if (P.length) { X.push(P[0][0]); Y.push(P[0][1]); }
        this.dataX = X; this.dataY = Y;
    };
    // boundary a x + b y = c, drawn only inside the frame
    var bline = board.create('curve', [[], []], mg(fix, {strokeColor: '#000000', strokeWidth: 2.5}));
    bline.updateDataArray = function () {
        var X = [], Y = [], pts = [], a = A(), b = B(), c = C(), x, y;
        if (ok()) {
            if (b !== 0) {
                [XMIN, XMAX].forEach(function (xx) { y = (c - a * xx) / b; if (y >= YMIN - 1e-9 && y <= YMAX + 1e-9) { pts.push([xx, y]); } });
            }
            if (a !== 0) {
                [YMIN, YMAX].forEach(function (yy) { x = (c - b * yy) / a; if (x >= XMIN - 1e-9 && x <= XMAX + 1e-9) { pts.push([x, yy]); } });
            }
        }
        if (pts.length >= 2) {
            pts.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
            X = [pts[0][0], pts[pts.length - 1][0]]; Y = [pts[0][1], pts[pts.length - 1][1]];
        }
        this.dataX = X; this.dataY = Y;
    };
    function centroid() {
        var P = clip(FRAME, wanted), i, ar = 0, cx = 0, cy = 0, cr;
        for (i = 0; i < P.length; i++) {
            cr = P[i][0] * P[(i + 1) % P.length][1] - P[(i + 1) % P.length][0] * P[i][1];
            ar += cr; cx += (P[i][0] + P[(i + 1) % P.length][0]) * cr; cy += (P[i][1] + P[(i + 1) % P.length][1]) * cr;
        }
        if (Math.abs(ar) < 1) { return null; }
        cx = cx / (3 * ar); cy = cy / (3 * ar);
        // keep the label off the axes when the region allows it
        if (Math.abs(cx) < 0.7 && wanted([cx + 1.2, cy]) > 0) { cx += 1.2; }
        if (Math.abs(cy) < 0.7 && wanted([cx, cy + 1.2]) > 0) { cy += 1.2; }
        return [cx, cy];
    }
    board.create('text', [function () { var g = centroid(); return g ? g[0] : 0; }, function () { var g = centroid(); return g ? g[1] : 0; }, 'R'],
        mg(txt, {anchorX: 'middle', anchorY: 'middle', fontSize: 22, cssStyle: 'font-weight: bold; font-style: italic;',
            visible: function () { return ok() && centroid() !== null; }}));

    board.create('button', [-1.5, 8.2, function () { return 'Sign: ' + SG[sign]; }, function () {
        sign = (sign + 1) % 4; restyle(); board.update();
    }], {fixed: true, fontSize: 14, useMathJax: false});
    board.create('text', [3.6, 8.2, function () { return ok() ? ineq() : 'Choose a or b not zero.'; }],
        mg(txt, {anchorY: 'middle', fontSize: 16, cssStyle: 'background-color: #ffffff; padding: 2px;'}));

    var Q = board.create('point', [3, 3], {name: 'Q', showInfobox: false, size: 4, face: '[]', strokeColor: '#b00000', fillColor: '#b00000',
        snapToGrid: true, snapSizeX: 1, snapSizeY: 1, label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});
    Q.on('drag', function () {
        var x = Math.max(XMIN, Math.min(XMAX, Q.X())), y = Math.max(YMIN, Math.min(YMAX, Q.Y()));
        if (x !== Q.X() || y !== Q.Y()) { Q.moveTo([x, y]); }
    });
    function status() {
        if (!ok()) { return 'Choose a or b not zero.'; }
        var x = Math.round(Q.X()), y = Math.round(Q.Y()), v = A() * x + B() * y, where;
        if (v === C()) {
            where = strict() ? 'Q is on the boundary (not included).' : 'Q is on the boundary (included).';
        } else if (wanted([x, y]) > 0) {
            where = 'Q is in R.';
        } else {
            where = 'Q is in the shaded region.';
        }
        return 'Q(' + num(x) + ', ' + num(y) + '): ' + (lhs() || '0') + ' = ' + num(v) + '. ' + where;
    }
    board.create('text', [-8.8, -7.9, status], mg(txt, {anchorY: 'middle', fontSize: 14, cssStyle: 'background-color: #ffffff;'}));
    board.create('polygon', [[-8.8, -8.9], [-8.3, -8.9], [-8.3, -8.5], [-8.8, -8.5]],
        {fillColor: '#808080', fillOpacity: 0.3, borders: {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false},
            vertices: {visible: false}, fixed: true, highlight: false, hasInnerPoints: false});
    board.create('text', [-8.1, -8.7, 'Shaded, not wanted; unshaded (R), the required region.'], mg(txt, {anchorY: 'middle', fontSize: 13}));

    function restyle() { bline.setAttribute({dash: strict() ? 2 : 0}); }
    restyle();
    // test hook (no effect in the book)
    board.ineqTest = {set: function (a, b, c, s) { aS.setValue(a); bS.setValue(b); cS.setValue(c); sign = s; restyle(); board.update(); },
        status: status, ineq: ineq, Q: Q, shadeN: function () { return shade.dataX.length; }, lineN: function () { return bline.dataX.length; },
        dash: function () { return bline.visProp.dash; }, centroid: centroid};
    board.update();
})();
