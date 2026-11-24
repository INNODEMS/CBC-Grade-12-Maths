// Dividing a line in a ratio (G12 Ch12 Vectors II, sec-proportional-division-of-a-line).
// A and B are draggable (whole-number coordinates); sliders m and n (1 to 5) and an "external" checkbox.
// P is found by the journey O to A, then AP = m/(m+n) AB (internal) or AP = m/(m-n) AB (external).
// The arrows OA and AP are drawn tip to tail, with OP dashed. The text gives AP as a fraction of AB and
// OP as a column of exact fractions. External with m = n: "no such point".
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-dividing-a-line', {
        boundingbox: [-5.5, 12.8, 13.5, -1.45],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var XMIN = -4, XMAX = 12, YMIN = -1, YMAX = 7;
    var grey = {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false};
    var x, y;
    for (x = XMIN; x <= XMAX; x++) { board.create('segment', [[x, YMIN], [x, YMAX]], grey); }
    for (y = YMIN; y <= YMAX; y++) { board.create('segment', [[XMIN, y], [XMAX, y]], grey); }
    var ax = {strokeColor: '#888888', strokeWidth: 1, fixed: true, highlight: false, lastArrow: {type: 2, size: 5}};
    board.create('arrow', [[XMIN, 0], [XMAX + 0.5, 0]], ax);
    board.create('arrow', [[0, YMIN], [0, YMAX + 0.5]], ax);

    var m = board.create('slider', [[-4, 8.4], [0, 8.4], [1, 2, 5]], {name: 'm', snapWidth: 1, precision: 0, label: {useMathJax: false, fontSize: 14}});
    var n = board.create('slider', [[2.5, 8.4], [6.5, 8.4], [1, 3, 5]], {name: 'n', snapWidth: 1, precision: 0, label: {useMathJax: false, fontSize: 14}});
    var ext = board.create('checkbox', [9, 8.4, 'external'], {fixed: true, fontSize: 14, useMathJax: false});

    function clampSnap(p) {
        var px = Math.max(XMIN, Math.min(XMAX, Math.round(p.X()))), py = Math.max(YMIN, Math.min(YMAX, Math.round(p.Y())));
        if (px !== p.X() || py !== p.Y()) { p.moveTo([px, py]); }
    }
    var ptStyle = {showInfobox: false, size: 4, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [8, 10]}};
    var O = board.create('point', [0, 0], {name: 'O', fixed: true, showInfobox: false, size: 3, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, fontSize: 15, offset: [-14, -12]}});
    var A = board.create('point', [1, 2], JXG.merge(ptStyle, {name: 'A'}));
    var B = board.create('point', [6, 5], JXG.merge(ptStyle, {name: 'B'}));
    [A, B].forEach(function (p) { p.on('drag', function () { clampSnap(p); }); p.on('up', function () { clampSnap(p); }); });

    function M() { return Math.round(m.Value()); }
    function N() { return Math.round(n.Value()); }
    function isExt() { return ext.Value(); }
    function none() { return isExt() && M() === N(); }
    // fraction t = num/den with AP = t AB
    function num() { return M(); }
    function den() { return isExt() ? M() - N() : M() + N(); }
    function t() { return none() ? 0 : num() / den(); }
    function PX() { return A.X() + t() * (B.X() - A.X()); }
    function PY() { return A.Y() + t() * (B.Y() - A.Y()); }

    board.create('line', [A, B], {strokeColor: '#999999', strokeWidth: 1, dash: 2, fixed: true, highlight: false});
    board.create('segment', [A, B], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    var P = board.create('point', [PX, PY], {name: 'P', fixed: true, showInfobox: false, face: '[]', size: 5,
        strokeColor: '#b00000', fillColor: '#b00000', visible: function () { return !none(); },
        label: {useMathJax: false, fontSize: 15, offset: [8, -14]}});
    board.create('arrow', [O, A], {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false});
    board.create('arrow', [A, P], {strokeColor: '#b00000', strokeWidth: 3, fixed: true, highlight: false, visible: function () { return !none(); }});
    board.create('arrow', [O, P], {strokeColor: '#b00000', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false, visible: function () { return !none(); }});

    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = b; b = a % b; a = r; } return a; }
    function frac(p, q) {
        if (q < 0) { p = -p; q = -q; }
        var g = gcd(p, q) || 1; p /= g; q /= g;
        if (q === 1) { return String(p); }
        return (p < 0 ? '-' : '') + '\\dfrac{' + Math.abs(p) + '}{' + q + '}';
    }
    board.create('text', [-5.2, 12.1, function () {
        if (none()) { return 'External division in the ratio ' + M() + ' : ' + N() + ' is impossible: no such point, since \\(m - n = 0\\).'; }
        var form = isExt() ? '\\dfrac{m}{m-n}' : '\\dfrac{m}{m+n}';
        return (isExt() ? 'External' : 'Internal') + ', \\(AP : PB = ' + M() + ' : ' + N() + '\\): \\(\\overrightarrow{AP} = ' + form + '\\overrightarrow{AB} = ' + frac(num(), den()) + '\\,\\overrightarrow{AB}\\)';
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.create('text', [-5.2, 10.3, function () {
        if (none()) { return ''; }
        var d = den(), cx = frac(A.X() * d + num() * (B.X() - A.X()), d), cy = frac(A.Y() * d + num() * (B.Y() - A.Y()), d);
        var off = (PX() < -5.5 || PX() > 13.5 || PY() < -1.45 || PY() > 7.8) ? ' (P is outside this view)' : '';
        return '\\(\\overrightarrow{OP} = \\overrightarrow{OA} + \\overrightarrow{AP} = \\begin{pmatrix} ' + cx + ' \\\\ ' + cy + ' \\end{pmatrix}\\)' + off;
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.update();
})();
