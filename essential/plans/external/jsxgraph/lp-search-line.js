// Search line (G12 Ch5 Linear Programming, sec-optimisation-of-linear-inequalities, lesson 3.2; Core only).
// The tailor's region: 3x + 7y <= 126, x + 6y <= 64, x >= 0, y >= 0, unwanted sides shaded, R left clear.
// Slider k (0 to 22 000, snap 100) moves the dashed search line ax + by = k. While it meets R the text gives P = k;
// once k passes the largest value of P on R the line turns grey and the text names the last point touched.
// A button switches the objective between P = 300x + 800y (last point (28, 6), 13 200) and P = 500x + 300y
// (last point (42, 0), 21 000). A checkbox shows the whole-number points of R: those the line has not yet passed
// are black, the rest grey, and the text reports the last whole-number point.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-lp-search-line', {
        boundingbox: [-5, 17, 47, -3.5],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var XM = 44, YM = 12;
    var fix = {fixed: true, highlight: false};
    var OBJ = [[300, 800], [500, 300]], obj = 0;
    var V = [[0, 0], [42, 0], [28, 6], [0, 32 / 3]];
    function inR(x, y) { return x >= 0 && y >= 0 && 3 * x + 7 * y <= 126 && x + 6 * y <= 64; }
    function P(x, y) { return OBJ[obj][0] * x + OBJ[obj][1] * y; }
    function money(v) {
        var s = (Math.round(v * 100) / 100).toString(), w = s.split('.')[0], f = s.indexOf('.') >= 0 ? '.' + s.split('.')[1] : '';
        return (w.length > 4 ? w.slice(0, w.length - 3) + ' ' + w.slice(w.length - 3) : w) + f;
    }
    var lattice = [], x, y;
    for (x = 0; x <= XM; x++) { for (y = 0; y <= YM; y++) { if (inR(x, y)) { lattice.push([x, y]); } } }
    function bestOf(pts) {
        var b = pts[0], j;
        for (j = 1; j < pts.length; j++) { if (P(pts[j][0], pts[j][1]) > P(b[0], b[1])) { b = pts[j]; } }
        return b;
    }
    function fmtPt(p) { return '(' + (Math.abs(p[1] - 32 / 3) < 1e-9 ? '0, 10.67' : p[0] + ', ' + p[1]) + ')'; }

    // grid, axes, region
    var gx = [], gy = [], i;
    for (i = 0; i <= XM; i += 2) { gx.push(i, i, NaN); gy.push(0, YM, NaN); }
    for (i = 0; i <= YM; i += 1) { gx.push(0, XM, NaN); gy.push(i, i, NaN); }
    board.create('curve', [gx, gy], JXG.merge(fix, {strokeColor: '#dddddd', strokeWidth: 1}));
    // axes drawn by hand so that tick labels stop at the top of the graph area
    board.create('arrow', [[0, 0], [XM + 1.5, 0]], JXG.merge(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[0, 0], [0, YM + 0.8]], JXG.merge(fix, {strokeColor: '#000000', strokeWidth: 1.5}));
    for (i = 10; i <= 40; i += 10) { board.create('text', [i - 0.8, -0.9, String(i)], JXG.merge(fix, {useMathJax: false, fontSize: 12})); }
    for (i = 2; i <= YM; i += 2) { board.create('text', [-2.4, i, String(i)], JXG.merge(fix, {useMathJax: false, fontSize: 12})); }
    board.create('text', [-1.6, -0.9, '0'], JXG.merge(fix, {useMathJax: false, fontSize: 12}));
    board.create('text', [37.5, -2.0, 'x (shirts)'], JXG.merge(fix, {useMathJax: false, fontSize: 13}));
    board.create('text', [0.6, 12.9, 'y (dresses)'], JXG.merge(fix, {useMathJax: false, fontSize: 13}));
    var shade = JXG.merge(fix, {fillColor: '#888888', fillOpacity: 0.3, borders: {strokeWidth: 0, highlight: false, fixed: true}, vertices: {visible: false}, hasInnerPoints: false});
    board.create('polygon', [[42, 0], [XM, 0], [XM, YM], [14, YM]], shade);
    board.create('polygon', [[0, 32 / 3], [0, YM], [XM, YM], [XM, 10 / 3]], shade);
    board.create('segment', [[14, YM], [42, 0]], JXG.merge(fix, {strokeColor: '#000000', strokeWidth: 2}));
    board.create('segment', [[0, 32 / 3], [XM, 10 / 3]], JXG.merge(fix, {strokeColor: '#000000', strokeWidth: 2}));
    board.create('text', [24, 8.6, '3x + 7y = 126'], JXG.merge(fix, {useMathJax: false, fontSize: 13}));
    board.create('text', [6, 10.9, 'x + 6y = 64'], JXG.merge(fix, {useMathJax: false, fontSize: 13}));
    board.create('text', [10, 3, 'R'], JXG.merge(fix, {useMathJax: false, fontSize: 22}));
    board.create('text', [-4.6, -3.0, 'Key: shaded, not wanted. R: required region. Dashed: search line.'], JXG.merge(fix, {useMathJax: false, fontSize: 12}));

    var k = board.create('slider', [[1, 14.8], [20, 14.8], [0, 2400, 22000]], {name: 'k', snapWidth: 100, precision: 0, withTicks: false,
        label: {useMathJax: false, fontSize: 14}});
    function K() { return Math.round(k.Value() / 100) * 100; }
    function vmax() { return P(bestOf(V)[0], bestOf(V)[1]); }
    function left() { return K() > vmax() + 1e-9; }

    // whole-number points
    var whole = false, dots = [];
    for (i = 0; i < lattice.length; i++) {
        (function (p) {
            dots.push(board.create('point', p, {name: '', withLabel: false, visible: false, fixed: true, highlight: false, showInfobox: false, size: 1.5,
                strokeColor: '#000000', fillColor: '#000000'}));
        })(lattice[i]);
    }
    function recolour() {
        var j, c;
        for (j = 0; j < dots.length; j++) {
            c = P(lattice[j][0], lattice[j][1]) >= K() ? '#000000' : '#aaaaaa';
            dots[j].setAttribute({visible: whole, strokeColor: c, fillColor: c});
        }
    }
    var cb = board.create('checkbox', [26, 14.8, 'Whole numbers only'], {fixed: true, fontSize: 13, useMathJax: false});
    JXG.addEvent(cb.rendNodeCheckbox, 'change', function () {
        whole = this.checked; recolour(); board.update();
    }, cb);

    // the search line ax + by = k, drawn only inside the graph area 0 <= x <= XM, 0 <= y <= YM
    // (a segment, because an infinite line would run over the axis numbers and the key)
    var line = board.create('curve', [[], []], {fixed: true, highlight: false, dash: 2, strokeWidth: 3,
        strokeColor: function () { return left() ? '#aaaaaa' : '#000000'; }});
    line.updateDataArray = function () {
        var a = OBJ[obj][0], b = OBJ[obj][1], k = K(), pts = [], yy, xx;
        yy = k / b; if (yy >= 0 && yy <= YM) { pts.push([0, yy]); }
        yy = (k - a * XM) / b; if (yy >= 0 && yy <= YM) { pts.push([XM, yy]); }
        xx = k / a; if (xx >= 0 && xx <= XM) { pts.push([xx, 0]); }
        xx = (k - b * YM) / a; if (xx >= 0 && xx <= XM) { pts.push([xx, YM]); }
        this.dataX = pts.length >= 2 ? [pts[0][0], pts[pts.length - 1][0]] : [];
        this.dataY = pts.length >= 2 ? [pts[0][1], pts[pts.length - 1][1]] : [];
    };

    board.create('button', [26, 16.0, function () { return 'Change the profit'; }, function () {
        obj = 1 - obj; recolour(); board.update();
    }], {fixed: true, fontSize: 13, useMathJax: false});
    board.create('text', [-4.6, 16.0, function () {
        return 'P = ' + OBJ[obj][0] + 'x + ' + OBJ[obj][1] + 'y.  Line: ' + OBJ[obj][0] + 'x + ' + OBJ[obj][1] + 'y = ' + money(K());
    }], JXG.merge(fix, {useMathJax: false, fontSize: 14}));
    board.create('text', [-4.6, 13.7, function () {
        var b = bestOf(V), s, w, n, j;
        if (left()) { s = 'The line has left R; the last point was ' + fmtPt(b) + ', P = ' + money(vmax()) + '.'; }
        else if (K() === 0) { s = 'The line passes through the origin: P = 0.'; }
        else { s = 'Every point of R on the line gives P = ' + money(K()) + '.'; }
        if (whole) {
            w = bestOf(lattice); n = 0;
            for (j = 0; j < lattice.length; j++) { if (P(lattice[j][0], lattice[j][1]) >= K()) { n++; } }
            s += n > 0 ? '  Whole-number points not yet passed: ' + n + '.' : '  Last whole-number point: (' + w[0] + ', ' + w[1] + '), P = ' + money(P(w[0], w[1])) + '.';
        }
        return s;
    }], JXG.merge(fix, {useMathJax: false, fontSize: 13, cssStyle: 'background-color: #ffffff;'}));

    // test hook (no effect in the book)
    k.on('drag', function () { recolour(); });
    board.lpTest = {set: function (kv, o, w) { k.setValue(kv); obj = o; whole = w; board.update(); recolour(); board.update(); },
        lattice: lattice, line: line};
    board.update();
})();
