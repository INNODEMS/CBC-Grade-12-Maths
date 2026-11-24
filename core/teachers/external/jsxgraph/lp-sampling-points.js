// Sampling points (G12 Ch5 Linear Programming, sec-optimisation-of-linear-inequalities, lesson 3.1; both editions).
// The tailor's region: 3x + 7y <= 126 (cloth), x + 6y <= 64 (machine hours), x >= 0, y >= 0; P = 300x + 800y.
// The unwanted side of each boundary is shaded (solid lines: both constraints are <=), R is left clear.
// A draggable point Q snaps to whole-number plans; the text says whether Q is in R and gives its profit.
// The best plan found so far is recorded and marked. A button shows the four vertices with their profits.
// Instruction check: (28, 6) gives 13 200, the best whole-number plan and a vertex.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-lp-sampling-points', {
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
    function inR(x, y) { return x >= 0 && y >= 0 && 3 * x + 7 * y <= 126 && x + 6 * y <= 64; }
    function P(x, y) { return 300 * x + 800 * y; }
    function money(v) {
        var s = Math.round(v).toString();
        return s.length > 4 ? s.slice(0, s.length - 3) + ' ' + s.slice(s.length - 3) : s;
    }

    // light grid: every 2 shirts and every dress
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

    // unwanted sides, shaded
    var shade = JXG.merge(fix, {fillColor: '#888888', fillOpacity: 0.3, borders: {strokeWidth: 0, highlight: false, fixed: true}, vertices: {visible: false}, hasInnerPoints: false});
    board.create('polygon', [[42, 0], [XM, 0], [XM, YM], [14, YM]], shade);
    board.create('polygon', [[0, 32 / 3], [0, YM], [XM, YM], [XM, 10 / 3]], shade);
    board.create('segment', [[14, YM], [42, 0]], JXG.merge(fix, {strokeColor: '#000000', strokeWidth: 2}));
    board.create('segment', [[0, 32 / 3], [XM, 10 / 3]], JXG.merge(fix, {strokeColor: '#000000', strokeWidth: 2}));
    board.create('text', [24, 8.6, '3x + 7y = 126'], JXG.merge(fix, {useMathJax: false, fontSize: 13}));
    board.create('text', [6, 10.9, 'x + 6y = 64'], JXG.merge(fix, {useMathJax: false, fontSize: 13}));
    board.create('text', [10, 3, 'R'], JXG.merge(fix, {useMathJax: false, fontSize: 22}));
    board.create('text', [-4.6, -3.0, 'Key: shaded, not wanted. R: required region.'], JXG.merge(fix, {useMathJax: false, fontSize: 12}));

    // the draggable plan Q, kept on whole numbers inside the board's graph area
    var Q = board.create('point', [20, 4], {name: 'Q', size: 5, face: '[]', strokeColor: '#000000', fillColor: '#ffffff',
        snapToGrid: true, snapSizeX: 1, snapSizeY: 1, showInfobox: false, label: {useMathJax: false, fontSize: 15, offset: [8, 10]}});
    var best = null;
    var B = board.create('point', [0, 0], {name: 'best', visible: false, size: 4, face: 'o', strokeColor: '#000000', fillColor: '#000000',
        fixed: true, highlight: false, showInfobox: false, label: {useMathJax: false, fontSize: 13, offset: [-30, -14]}});
    function clamp() {
        var x = Math.max(0, Math.min(XM, Math.round(Q.X()))), y = Math.max(0, Math.min(YM, Math.round(Q.Y())));
        if (x !== Q.X() || y !== Q.Y()) { Q.moveTo([x, y]); }
    }
    function record() {
        var x = Math.round(Q.X()), y = Math.round(Q.Y());
        if (inR(x, y) && (best === null || P(x, y) > best[2])) {
            best = [x, y, P(x, y)];
            B.moveTo([x, y]); B.setAttribute({visible: true});
        }
    }
    Q.on('drag', function () { clamp(); });
    Q.on('up', function () { clamp(); record(); board.update(); });

    board.create('text', [-4.6, 16.0, function () {
        var x = Math.round(Q.X()), y = Math.round(Q.Y());
        var c = 3 * x + 7 * y, m = x + 6 * y;
        if (inR(x, y)) {
            return 'Q = (' + x + ', ' + y + ') is in R.  P = 300x + 800y = Ksh ' + money(P(x, y));
        }
        return 'Q = (' + x + ', ' + y + ') is not in R: ' + (c > 126 ? 'cloth 3x + 7y = ' + c + ' > 126' : 'machine x + 6y = ' + m + ' > 64');
    }], JXG.merge(fix, {useMathJax: false, fontSize: 14}));
    board.create('text', [-4.6, 14.8, function () {
        return best === null ? 'Best so far: none yet. Drag Q into R.' : 'Best so far: (' + best[0] + ', ' + best[1] + '), Ksh ' + money(best[2]);
    }], JXG.merge(fix, {useMathJax: false, fontSize: 14}));

    // vertices, hidden until the button is pressed
    var V = [[0, 0], [42, 0], [28, 6], [0, 32 / 3]];
    var VN = ['(0, 0): P = 0', '(42, 0): P = 12 600', '(28, 6): P = 13 200', '(0, 10.67): P = 8533.33'];
    var OFF = [[6, 8], [-40, 14], [6, 10], [8, 8]];
    var vpts = [], shown = false;
    for (i = 0; i < 4; i++) {
        vpts.push(board.create('point', V[i], {name: VN[i], visible: false, fixed: true, highlight: false, size: 3, strokeColor: '#000000', fillColor: '#000000',
            showInfobox: false, label: {useMathJax: false, fontSize: 13, offset: OFF[i], cssStyle: 'background-color: #ffffff;'}}));
    }
    board.create('button', [26, 16.0, function () { return shown ? 'Hide the vertices' : 'Show the vertices'; }, function () {
        shown = !shown;
        for (i = 0; i < 4; i++) { vpts[i].setAttribute({visible: shown}); }
        board.update();
    }], {fixed: true, fontSize: 13, useMathJax: false});

    // test hook (no effect in the book)
    board.lpTest = {move: function (x, y) { Q.moveTo([x, y]); clamp(); record(); board.update(); },
        show: function (s) { shown = s; for (i = 0; i < 4; i++) { vpts[i].setAttribute({visible: s}); } board.update(); },
        best: function () { return best; }};
    board.update();
})();
