// Area scale factor and determinant (G12 Ch6, sec-area-scale-factor-and-determinant-of-a-matrix).
// Unit square OABC (shaded) and its image OA'B'C' (dashed) under [a b; c d], set by four sliders
// (-4 to 4, step 0.5; start 2, 1, 1, 4). The area of the image (shoelace) and det are printed side by side,
// with the direction of the lettering O, A', B', C'. When det = 0 the text says the square has collapsed onto a line.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-area-and-determinant', {
        boundingbox: [-9, 9, 16, -9.75],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var g = {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false};
    var gx, gy;
    for (gx = -8; gx <= 8; gx++) { board.create('segment', [[gx, -8], [gx, 8]], g); }
    for (gy = -8; gy <= 8; gy++) { board.create('segment', [[-8, gy], [8, gy]], g); }
    var ax = {strokeColor: '#000000', strokeWidth: 1.5, lastArrow: true, fixed: true, highlight: false};
    board.create('arrow', [[-8.4, 0], [8.6, 0]], ax);
    board.create('arrow', [[0, -8.4], [0, 8.6]], ax);
    var tx = {fixed: true, highlight: false, useMathJax: false, fontSize: 14};
    board.create('text', [8.3, -0.55, 'x'], tx);
    board.create('text', [0.25, 8.6, 'y'], tx);

    var so = {snapWidth: 0.5, precision: 1, withTicks: false};
    var a = board.create('slider', [[10, 8], [14, 8], [-4, 2, 4]], JXG.merge(so, {name: 'a'}));
    var b = board.create('slider', [[10, 7], [14, 7], [-4, 1, 4]], JXG.merge(so, {name: 'b'}));
    var c = board.create('slider', [[10, 6], [14, 6], [-4, 1, 4]], JXG.merge(so, {name: 'c'}));
    var d = board.create('slider', [[10, 5], [14, 5], [-4, 4, 4]], JXG.merge(so, {name: 'd'}));
    function A() { return a.Value(); } function B() { return b.Value(); }
    function C() { return c.Value(); } function D() { return d.Value(); }
    function det() { return A() * D() - B() * C(); }

    // unit square
    var sq = board.create('polygon', [[0, 0], [1, 0], [1, 1], [0, 1]], {fillColor: '#000000', fillOpacity: 0.2, fixed: true, highlight: false,
        borders: {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false}, vertices: {visible: false}});
    board.create('text', [-0.6, -0.5, 'O'], tx);
    // image vertices
    var po = {size: 2, fixed: true, highlight: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [6, 8]}};
    var A1 = board.create('point', [function () { return A(); }, function () { return C(); }], JXG.merge(po, {name: 'A′'}));
    var B1 = board.create('point', [function () { return A() + B(); }, function () { return C() + D(); }], JXG.merge(po, {name: 'B′'}));
    var C1 = board.create('point', [function () { return B(); }, function () { return D(); }], JXG.merge(po, {name: 'C′'}));
    var O = board.create('point', [0, 0], {visible: false, fixed: true});
    board.create('polygon', [O, A1, B1, C1], {fillColor: '#1f4e9c', fillOpacity: 0.15, fixed: true, highlight: false,
        borders: {strokeColor: '#1f4e9c', strokeWidth: 2.5, dash: 3, fixed: true, highlight: false}, vertices: {visible: false}});

    function f(v) { var r = Math.round(v * 100) / 100; return (r === 0 ? 0 : r).toString(); }
    function area() {
        // shoelace for O, A', B', C'
        var p = [[0, 0], [A(), C()], [A() + B(), C() + D()], [B(), D()]], s = 0, i, j;
        for (i = 0; i < 4; i++) { j = (i + 1) % 4; s += p[i][0] * p[j][1] - p[j][0] * p[i][1]; }
        return Math.abs(s) / 2;
    }
    board.create('text', [9.2, 3.4, function () {
        return '\\(M = \\begin{bmatrix} ' + f(A()) + ' & ' + f(B()) + ' \\\\ ' + f(C()) + ' & ' + f(D()) + ' \\end{bmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [9.2, 1.2, function () { return 'Area of image = ' + f(area()); }], tx);
    board.create('text', [9.2, 0.0, function () { return '\\(\\det M = ' + f(det()) + '\\)'; }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [9.2, -1.6, function () {
        var D0 = det();
        if (Math.abs(D0) < 1e-9) { return 'The square has collapsed onto<br>a line (or onto the point O).'; }
        return D0 > 0 ? 'Letters O, A\u2032, B\u2032, C\u2032: anticlockwise' : 'Letters O, A\u2032, B\u2032, C\u2032: clockwise';
    }], tx);
    board.create('text', [9.2, -2.6, function () {
        var D0 = det();
        if (Math.abs(D0) < 1e-9) { return 'Area 0: no inverse.'; }
        return D0 > 0 ? 'Orientation kept.' : 'Orientation reversed.';
    }], tx);
    board.create('text', [9.2, -5.0, 'Shaded: unit square, area 1'], tx);
    board.create('text', [9.2, -6.0, 'Dashed: image OA′B′C′'], tx);
})();
