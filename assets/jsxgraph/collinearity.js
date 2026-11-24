// Collinearity (G12 Ch12 Vectors II, sec-collinearity).
// Three draggable points A, B, C snapping to whole numbers on a grid (x from -2 to 12, y from 0 to 8).
// The text shows AB and BC as column vectors and either "parallel and sharing B: collinear, BC = k AB"
// with the value of k, or "not collinear". Collinear points are drawn as large squares, otherwise as
// small circles, so the state is shown by shape as well as by the words (never by colour alone).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-collinearity', {
        boundingbox: [-2.8, 11.6, 13.2, -0.4],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var XMIN = -2, XMAX = 12, YMIN = 0, YMAX = 8;
    var grey = {strokeColor: '#dddddd', strokeWidth: 1, fixed: true, highlight: false};
    var x, y;
    for (x = XMIN; x <= XMAX; x++) { board.create('segment', [[x, YMIN], [x, YMAX]], grey); }
    for (y = YMIN; y <= YMAX; y++) { board.create('segment', [[XMIN, y], [XMAX, y]], grey); }
    var ax = {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false, lastArrow: {type: 2, size: 6}};
    board.create('arrow', [[XMIN, 0], [XMAX + 0.6, 0]], ax);
    board.create('arrow', [[0, YMIN], [0, YMAX + 0.6]], ax);
    var tk = {fixed: true, highlight: false, useMathJax: false, fontSize: 11, anchorX: 'middle', anchorY: 'top'};
    for (x = -2; x <= 12; x += 2) { if (x !== 0) { board.create('text', [x, -0.08, String(x)], tk); } }
    var tky = {fixed: true, highlight: false, useMathJax: false, fontSize: 11, anchorX: 'right', anchorY: 'middle'};
    for (y = 2; y <= 8; y += 2) { board.create('text', [-0.15, y, String(y)], tky); }

    function clampSnap(p) {
        var px = Math.round(p.X()), py = Math.round(p.Y());
        px = Math.max(XMIN, Math.min(XMAX, px));
        py = Math.max(YMIN, Math.min(YMAX, py));
        if (px !== p.X() || py !== p.Y()) { p.moveTo([px, py]); }
    }

    var state = {col: true};
    function pt(cx, cy, nm) {
        var p = board.create('point', [cx, cy], {
            name: nm, showInfobox: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c',
            face: '[]', size: 7,
            label: {useMathJax: false, fontSize: 15, offset: [10, 12]}
        });
        p.on('drag', function () { clampSnap(p); });
        p.on('up', function () { clampSnap(p); });
        return p;
    }
    var A = pt(1, 2, 'A'), B = pt(4, 4, 'B'), C = pt(10, 8, 'C');

    board.create('segment', [A, B], {strokeColor: '#555555', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false});
    board.create('segment', [B, C], {strokeColor: '#555555', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false});

    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
    function frac(p, q) {
        if (q < 0) { p = -p; q = -q; }
        var g = gcd(p, q) || 1; p /= g; q /= g;
        if (q === 1) { return String(p); }
        return (p < 0 ? '-' : '') + '\\dfrac{' + Math.abs(p) + '}{' + q + '}';
    }
    function col(u, v) { return '\\begin{pmatrix} ' + u + ' \\\\ ' + v + ' \\end{pmatrix}'; }

    function info() {
        var ux = B.X() - A.X(), uy = B.Y() - A.Y(), vx = C.X() - B.X(), vy = C.Y() - B.Y();
        var r = {ux: ux, uy: uy, vx: vx, vy: vy, same: false, col: false, k: ''};
        if ((ux === 0 && uy === 0) || (vx === 0 && vy === 0)) { r.same = true; return r; }
        r.col = (ux * vy - uy * vx === 0);
        if (r.col) { r.k = (ux !== 0) ? frac(vx, ux) : frac(vy, uy); }
        return r;
    }
    // shape follows the state: large squares when collinear, small circles otherwise
    board.on('update', function () {
        var c = info().col;
        if (c !== state.col) {
            state.col = c;
            [A, B, C].forEach(function (p) { p.setAttribute({face: c ? '[]' : 'o', size: c ? 7 : 4}); });
        }
    });

    board.create('text', [-2.5, 10.9, function () {
        var r = info();
        return '\\(\\overrightarrow{AB} = ' + col(r.ux, r.uy) + ', \\quad \\overrightarrow{BC} = ' + col(r.vx, r.vy) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.create('text', [-2.5, 9.5, function () {
        var r = info();
        if (r.same) { return 'Two of the points are the same point: drag them apart.'; }
        if (r.col) { return '\\(\\overrightarrow{AB}\\) and \\(\\overrightarrow{BC}\\) are parallel and share \\(B\\): collinear, \\(\\overrightarrow{BC} = k\\,\\overrightarrow{AB}\\) with \\(k = ' + r.k + '\\)'; }
        return 'Not collinear: \\(\\overrightarrow{BC}\\) is not a multiple of \\(\\overrightarrow{AB}\\)';
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.update();
})();
