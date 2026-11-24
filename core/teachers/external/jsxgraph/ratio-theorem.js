// The ratio theorem (G12 Ch12 Vectors II, sec-ratio-theorem).
// O is fixed at the origin; A and B are draggable (whole-number coordinates); sliders m and n (1 to 5).
// From O, the arrow (n/(m+n)) a is followed tip to tail by the arrow (m/(m+n)) b; together they end at
// the point P dividing AB internally in the ratio m : n. The text gives OP = (n a + m b)/(m + n) with the
// numbers, the two coefficients (which add to 1) and OP as a column.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-ratio-theorem', {
        boundingbox: [-5, 12, 13, -1.5],
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

    var m = board.create('slider', [[-4, 7.5], [0, 7.5], [1, 2, 5]], {name: 'm', snapWidth: 1, precision: 0, label: {useMathJax: false, fontSize: 14}});
    var n = board.create('slider', [[3, 7.5], [7, 7.5], [1, 3, 5]], {name: 'n', snapWidth: 1, precision: 0, label: {useMathJax: false, fontSize: 14}});

    function clampSnap(p) {
        var px = Math.max(XMIN, Math.min(XMAX, Math.round(p.X()))), py = Math.max(YMIN, Math.min(YMAX, Math.round(p.Y())));
        if (px !== p.X() || py !== p.Y()) { p.moveTo([px, py]); }
    }
    var ptStyle = {showInfobox: false, size: 4, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [8, 10]}};
    var O = board.create('point', [0, 0], {name: 'O', fixed: true, showInfobox: false, size: 3, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, fontSize: 15, offset: [-14, -12]}});
    var A = board.create('point', [2, 6], JXG.merge(ptStyle, {name: 'A'}));
    var B = board.create('point', [10, 1], JXG.merge(ptStyle, {name: 'B'}));
    [A, B].forEach(function (p) { p.on('drag', function () { clampSnap(p); }); p.on('up', function () { clampSnap(p); }); });

    function M() { return Math.round(m.Value()); }
    function N() { return Math.round(n.Value()); }
    function la() { return N() / (M() + N()); }
    function mu() { return M() / (M() + N()); }

    board.create('arrow', [O, A], {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false, name: 'a', withLabel: true, label: {useMathJax: false, fontSize: 15, cssStyle: 'font-weight:bold', offset: [-14, 4]}});
    board.create('arrow', [O, B], {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false, name: 'b', withLabel: true, label: {useMathJax: false, fontSize: 15, cssStyle: 'font-weight:bold', offset: [0, -14]}});
    board.create('segment', [A, B], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});

    // the weighted journey: la*a from O, then mu*b from its tip
    var T = board.create('point', [function () { return la() * A.X(); }, function () { return la() * A.Y(); }], {visible: false, fixed: true, name: ''});
    var P = board.create('point', [function () { return la() * A.X() + mu() * B.X(); }, function () { return la() * A.Y() + mu() * B.Y(); }],
        {name: 'P', fixed: true, showInfobox: false, face: '[]', size: 5, strokeColor: '#b00000', fillColor: '#b00000', label: {useMathJax: false, fontSize: 15, offset: [8, 10]}});
    board.create('arrow', [O, T], {strokeColor: '#b00000', strokeWidth: 3, dash: 2, fixed: true, highlight: false});
    board.create('arrow', [T, P], {strokeColor: '#b00000', strokeWidth: 3, dash: 2, fixed: true, highlight: false});

    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = b; b = a % b; a = r; } return a; }
    function frac(p, q) {
        if (q < 0) { p = -p; q = -q; }
        var g = gcd(p, q) || 1; p /= g; q /= g;
        if (q === 1) { return String(p); }
        return (p < 0 ? '-' : '') + '\\dfrac{' + Math.abs(p) + '}{' + q + '}';
    }
    board.create('text', [-4.7, 11.0, function () {
        var s = M() + N();
        return '\\(\\overrightarrow{OP} = \\dfrac{n\\mathbf{a} + m\\mathbf{b}}{m + n} = \\dfrac{' + N() + '\\mathbf{a} + ' + M() + '\\mathbf{b}}{' + s + '} = '
            + frac(N(), s) + '\\mathbf{a} + ' + frac(M(), s) + '\\mathbf{b}\\)';
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.create('text', [-4.7, 9.4, function () {
        var s = M() + N();
        return 'Coefficients: \\(' + frac(N(), s) + ' + ' + frac(M(), s) + ' = 1\\). \\(\\quad\\overrightarrow{OP} = \\begin{pmatrix} '
            + frac(N() * A.X() + M() * B.X(), s) + ' \\\\ ' + frac(N() * A.Y() + M() * B.Y(), s) + ' \\end{pmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.update();
})();
