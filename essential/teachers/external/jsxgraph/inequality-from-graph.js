// Writing an inequality from a graph (G12 Ch4 Linear Inequalities, sec-linear-inequalities-from-graphs).
// The button New graph picks one of 12 preset single-boundary graphs. The boundary is drawn solid (<=, >=) or dashed
// (<, >) and its UNWANTED side is shaded (the board rectangle clipped to that side, Sutherland and Hodgman), so the
// required region R stays clear. The learner types an inequality in the box and presses Check. The parser accepts
// digits, x, y, +, -, an optional *, fractions such as 3x/7, and one of <, <=, >, >=, ≤, ≥, with x and y on either
// side; it compares half-planes: the same line (coefficients in proportion), the same side and the same strictness.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-inequality-from-graph', {
        boundingbox: [-11, 14.6, 11, -11.8],
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
    var XMIN = -10, XMAX = 10, YMIN = -10, YMAX = 10;
    // presets [a, b, c, rel] for a x + b y rel c
    // Presets avoid the values used in the STACK questions and the worked examples.
    // The board opens on preset 1, since preset 0 is the instructions' example.
    var P = [[3, 7, 21, 'le'], [2, 9, 18, 'gt'], [1, -6, 6, 'ge'], [10, -3, -30, 'gt'], [6, -5, 30, 'ge'], [3, -10, -30, 'lt'],
        [1, 0, 3, 'le'], [0, 1, -2, 'gt'], [1, 0, -1, 'gt'], [-7, 2, 0, 'ge'], [9, -2, 18, 'le'], [5, -9, 45, 'gt']];
    var cur = 1, msg = '';
    function T() { return P[cur]; }
    function strictR(r) { return r === 'lt' || r === 'gt'; }

    var k;
    for (k = XMIN; k <= XMAX; k++) {
        board.create('segment', [[k, YMIN], [k, YMAX]], mg(fix, {strokeColor: '#dddddd', strokeWidth: 1}));
        board.create('segment', [[XMIN, k], [XMAX, k]], mg(fix, {strokeColor: '#dddddd', strokeWidth: 1}));
        if (k !== 0 && k % 2 === 0) {
            board.create('text', [k, -0.3, String(k).replace('-', '−')], mg(txt, {anchorX: 'middle', anchorY: 'top', fontSize: 11}));
            board.create('text', [-0.25, k, String(k).replace('-', '−')], mg(txt, {anchorX: 'right', anchorY: 'middle', fontSize: 11}));
        }
    }
    board.create('arrow', [[XMIN, 0], [XMAX + 0.6, 0]], mg(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[0, YMIN], [0, YMAX + 0.6]], mg(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('text', [XMAX + 0.6, 0.5, 'x'], mg(txt, {anchorY: 'middle', fontSize: 15, cssStyle: 'font-style: italic;'}));
    board.create('text', [0.3, YMAX + 0.6, 'y'], mg(txt, {anchorY: 'middle', fontSize: 15, cssStyle: 'font-style: italic;'}));

    function clip(Q, f) {
        var out = [], i, p, q, fp, fq, t;
        for (i = 0; i < Q.length; i++) {
            p = Q[i]; q = Q[(i + 1) % Q.length]; fp = f(p); fq = f(q);
            if (fp >= 0) { out.push(p); }
            if ((fp >= 0) !== (fq >= 0)) { t = fp / (fp - fq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
        }
        return out;
    }
    var FRAME = [[XMIN, YMIN], [XMAX, YMIN], [XMAX, YMAX], [XMIN, YMAX]];
    function unwanted(p) { var l = T(), v = l[0] * p[0] + l[1] * p[1] - l[2]; return (l[3] === 'lt' || l[3] === 'le') ? v : -v; }
    function wanted(p) { return -unwanted(p); }
    var shade = board.create('curve', [[], []], mg(fix, {strokeWidth: 0, fillColor: '#808080', fillOpacity: 0.3}));
    shade.updateDataArray = function () {
        var Q = clip(FRAME, unwanted), X = [], Y = [], i;
        for (i = 0; i < Q.length; i++) { X.push(Q[i][0]); Y.push(Q[i][1]); }
        if (Q.length) { X.push(Q[0][0]); Y.push(Q[0][1]); }
        this.dataX = X; this.dataY = Y;
    };
    var bline = board.create('curve', [[], []], mg(fix, {strokeColor: '#000000', strokeWidth: 2.5}));
    bline.updateDataArray = function () {
        var l = T(), pts = [], x, y;
        if (l[1] !== 0) { [XMIN, XMAX].forEach(function (u) { y = (l[2] - l[0] * u) / l[1]; if (y >= YMIN - 1e-9 && y <= YMAX + 1e-9) { pts.push([u, y]); } }); }
        if (l[0] !== 0) { [YMIN, YMAX].forEach(function (v) { x = (l[2] - l[1] * v) / l[0]; if (x >= XMIN - 1e-9 && x <= XMAX + 1e-9) { pts.push([x, v]); } }); }
        pts.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
        this.dataX = [pts[0][0], pts[pts.length - 1][0]]; this.dataY = [pts[0][1], pts[pts.length - 1][1]];
    };
    function centroid() {
        var Q = clip(FRAME, wanted), i, j, ar = 0, cx = 0, cy = 0, cr;
        for (i = 0; i < Q.length; i++) {
            j = (i + 1) % Q.length; cr = Q[i][0] * Q[j][1] - Q[j][0] * Q[i][1];
            ar += cr; cx += (Q[i][0] + Q[j][0]) * cr; cy += (Q[i][1] + Q[j][1]) * cr;
        }
        cx = cx / (3 * ar); cy = cy / (3 * ar);
        // keep the label off the axes when the region allows it
        if (Math.abs(cx) < 0.8 && wanted([cx + 1.5, cy]) > 0) { cx += 1.5; }
        if (Math.abs(cy) < 0.8 && wanted([cx, cy + 1.5]) > 0) { cy += 1.5; }
        return [cx, cy];
    }
    board.create('text', [function () { return centroid()[0]; }, function () { return centroid()[1]; }, 'R'],
        mg(txt, {anchorX: 'middle', anchorY: 'middle', fontSize: 22, cssStyle: 'font-weight: bold; font-style: italic;'}));
    function restyle() { bline.setAttribute({dash: strictR(T()[3]) ? 2 : 0}); }

    // parser: returns [a, b, c, rel] for a x + b y rel c, or null
    function side(t) {
        var A = 0, B = 0, C = 0, terms, i, m, v, s;
        if (t.charAt(0) !== '+' && t.charAt(0) !== '-') { t = '+' + t; }
        terms = t.match(/[+-][^+-]*/g);
        if (!terms || terms.join('') !== t) { return null; }
        for (i = 0; i < terms.length; i++) {
            s = terms[i].charAt(0) === '-' ? -1 : 1;
            m = terms[i].slice(1).match(/^(\d+(?:\.\d+)?)?(?:\/(\d+(?:\.\d+)?))?([xy])?(?:\/(\d+(?:\.\d+)?))?$/);
            if (!m || terms[i].length === 1) { return null; }
            if ((m[2] && !m[1]) || (m[4] && !m[3]) || (!m[1] && !m[3])) { return null; }
            v = s * (m[1] ? parseFloat(m[1]) : 1) / (m[2] ? parseFloat(m[2]) : 1) / (m[4] ? parseFloat(m[4]) : 1);
            if (!isFinite(v)) { return null; }
            if (m[3] === 'x') { A += v; } else if (m[3] === 'y') { B += v; } else { C += v; }
        }
        return [A, B, C];
    }
    function parse(str) {
        var s = String(str).replace(/\s+/g, '').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/[−–]/g, '-').replace(/\*/g, '');
        var m = s.match(/^([^<>=]+)(<=|>=|<|>)([^<>=]+)$/), L, R, rel, a, b, c;
        if (!m) { return null; }
        L = side(m[1]); R = side(m[3]);
        if (!L || !R) { return null; }
        a = L[0] - R[0]; b = L[1] - R[1]; c = R[2] - L[2];
        if (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) { return null; }
        rel = {'<': 'lt', '<=': 'le', '>': 'gt', '>=': 'ge'}[m[2]];
        return [a, b, c, rel];
    }
    // write as a x + b y (< or <=) c
    function lower(l) { return (l[3] === 'lt' || l[3] === 'le') ? l.slice() : [-l[0], -l[1], -l[2], l[3] === 'gt' ? 'lt' : 'le']; }
    var MSG = {ok: 'Correct.', side: 'That describes the shaded side; we want the clear side.', style: 'Right side, but check solid or dashed.',
        line: 'Check the equation of the line.', read: 'I could not read that: type it like 3x+7y<=21'};
    function classify(str) {
        var u = parse(str), p, q, e = 1e-9, sc;
        if (!u) { return 'read'; }
        p = lower(u); q = lower(T());
        sc = Math.max(Math.abs(p[0]), Math.abs(p[1]), Math.abs(p[2]), 1) * Math.max(Math.abs(q[0]), Math.abs(q[1]), Math.abs(q[2]), 1);
        if (Math.abs(p[0] * q[1] - p[1] * q[0]) > e * sc || Math.abs(p[0] * q[2] - p[2] * q[0]) > e * sc || Math.abs(p[1] * q[2] - p[2] * q[1]) > e * sc) { return 'line'; }
        if (p[0] * q[0] + p[1] * q[1] < 0) { return 'side'; }
        if (p[3] !== q[3]) { return 'style'; }
        return 'ok';
    }

    var inp = board.create('input', [-1.2, 13.6, '', 'Inequality: '], {fixed: true, fontSize: 14, useMathJax: false, cssStyle: 'width: 9em;'});
    board.create('button', [-10.6, 13.6, 'New graph', function () {
        var j = cur;
        while (j === cur) { j = Math.floor(Math.random() * P.length); }
        cur = j; msg = ''; inp.set(''); restyle(); board.update();
    }], {fixed: true, fontSize: 14, useMathJax: false});
    board.create('button', [7.6, 13.6, 'Check', function () { msg = MSG[classify(inp.Value())]; board.update(); }],
        {fixed: true, fontSize: 14, useMathJax: false});
    board.create('text', [-10.6, 12.2, function () { return msg; }], mg(txt, {anchorY: 'middle', fontSize: 15, cssStyle: 'font-weight: bold;'}));
    board.create('polygon', [[-10.6, -11.4], [-10, -11.4], [-10, -10.8], [-10.6, -10.8]],
        {fillColor: '#808080', fillOpacity: 0.3, borders: {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false},
            vertices: {visible: false}, fixed: true, highlight: false, hasInnerPoints: false});
    board.create('text', [-9.8, -11.1, 'Shaded, not wanted; unshaded (R), the required region.'], mg(txt, {anchorY: 'middle', fontSize: 13}));

    restyle();
    // test hook (no effect in the book)
    board.ifgTest = {set: function (j) { cur = j; msg = ''; restyle(); board.update(); }, classify: classify, parse: parse,
        check: function (s) { inp.set(s); board.update(); return MSG[classify(inp.Value())]; }, n: P.length, cur: function () { return cur; },
        dash: function () { return bline.visProp.dash; }, shadeN: function () { return shade.dataX.length; }, centroid: centroid, msg: function () { return msg; }};
    board.update();
})();
