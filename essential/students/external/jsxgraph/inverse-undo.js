// Inverse transformation (G12 Ch6, sec-inverse-transformations).
// Object triangle (1, 1), (2, -1), (0, 2) solid; its image under M (four boxes, start [3 1; 5 2]) dashed.
// The button "Apply the inverse" moves a copy of the image back onto the object over 1 second.
// M^(-1) is printed (2 d.p.); when det M = 0 the text says the matrix has no inverse and the button does nothing.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-inverse-undo', {
        boundingbox: [-4, 10, 15, -4.25],
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
    for (gx = -3; gx <= 9; gx++) { board.create('segment', [[gx, -3], [gx, 9]], g); }
    for (gy = -3; gy <= 9; gy++) { board.create('segment', [[-3, gy], [9, gy]], g); }
    var ax = {strokeColor: '#000000', strokeWidth: 1.5, lastArrow: true, fixed: true, highlight: false};
    board.create('arrow', [[-3.4, 0], [9.6, 0]], ax);
    board.create('arrow', [[0, -3.4], [0, 9.6]], ax);
    var tx = {fixed: true, highlight: false, useMathJax: false, fontSize: 14};
    board.create('text', [9.4, -0.45, 'x'], tx);
    board.create('text', [0.2, 9.6, 'y'], tx);
    board.create('text', [-0.45, -0.4, 'O'], tx);

    function box(x, y, v) { return board.create('input', [x, y, v, ''], {cssStyle: 'width: 38px', fixed: true}); }
    board.create('text', [10.0, 8.8, 'M ='], {fixed: true, highlight: false, useMathJax: false, fontSize: 16});
    var m11 = box(11.3, 9.3, '3'), m12 = box(13.0, 9.3, '1'), m21 = box(11.3, 8.3, '5'), m22 = box(13.0, 8.3, '2');
    function num(inp) {
        var s = String(inp.Value()).trim(), v;
        if (s === '') { return NaN; }
        if (/^-?\d+(\.\d+)?\/\d+(\.\d+)?$/.test(s)) { v = s.split('/'); v = Number(v[0]) / Number(v[1]); return isFinite(v) ? v : NaN; }
        v = Number(s);
        return isFinite(v) ? v : NaN;
    }
    function M() { return [[num(m11), num(m12)], [num(m21), num(m22)]]; }
    function ok() { var m = M(); return !(isNaN(m[0][0]) || isNaN(m[0][1]) || isNaN(m[1][0]) || isNaN(m[1][1])); }
    function det() { var m = M(); return m[0][0] * m[1][1] - m[0][1] * m[1][0]; }
    function inv() { var m = M(), d = det(); return [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]]; }

    var obj = [[1, 1], [2, -1], [0, 2]], names = ['A', 'B', 'C'], offs = [[8, 2], [8, -8], [-14, 8]];
    var t = 0;   // 0: the moving copy sits on the image; 1: it sits on the object
    var po = {size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000'};
    var O = [], I = [], W = [], k;
    for (k = 0; k < 3; k++) {
        (function (k) {
            O[k] = board.create('point', obj[k], JXG.merge(po, {name: names[k], label: {useMathJax: false, fontSize: 14, offset: offs[k]}}));
            var img = function (c) { var m = M(); return m[c][0] * obj[k][0] + m[c][1] * obj[k][1]; };
            I[k] = board.create('point', [function () { return img(0); }, function () { return img(1); }],
                JXG.merge(po, {name: names[k] + '′', visible: function () { return ok(); }, label: {useMathJax: false, fontSize: 14, offset: [8, -8]}}));
            W[k] = board.create('point', [function () { return (1 - t) * img(0) + t * obj[k][0]; }, function () { return (1 - t) * img(1) + t * obj[k][1]; }],
                {size: 3, fixed: true, highlight: false, name: '', strokeColor: '#9c1f1f', fillColor: '#9c1f1f', visible: function () { return ok() && t > 0; }});
        })(k);
    }
    board.create('polygon', O, {fillOpacity: 0.15, fillColor: '#000000', highlight: false, fixed: true,
        borders: {strokeColor: '#000000', strokeWidth: 2.5, fixed: true, highlight: false}, vertices: {visible: false}});
    var dsh = {strokeColor: '#1f4e9c', strokeWidth: 2.5, dash: 3, fixed: true, highlight: false, visible: function () { return ok(); }};
    board.create('segment', [I[0], I[1]], dsh); board.create('segment', [I[1], I[2]], dsh); board.create('segment', [I[2], I[0]], dsh);
    var mv = {strokeColor: '#9c1f1f', strokeWidth: 2, fixed: true, highlight: false, visible: function () { return ok() && t > 0; }};
    board.create('segment', [W[0], W[1]], mv); board.create('segment', [W[1], W[2]], mv); board.create('segment', [W[2], W[0]], mv);

    function f(v) { var r = Math.round(v * 100) / 100; return (r === 0 ? 0 : r).toString(); }
    board.create('text', [10.0, 6.6, function () {
        if (!ok()) { return 'Type a number in every box.'; }
        return '\\(\\det M = ' + f(det()) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [10.0, 4.9, function () {
        if (!ok()) { return ''; }
        if (Math.abs(det()) < 1e-9) { return 'This matrix has no inverse.'; }
        var m = inv();
        return '\\(M^{-1} = \\begin{bmatrix} ' + f(m[0][0]) + ' & ' + f(m[0][1]) + ' \\\\ ' + f(m[1][0]) + ' & ' + f(m[1][1]) + ' \\end{bmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});

    var timer = null;
    board.create('button', [10.0, 3.0, 'Apply the inverse', function () {
        if (!ok() || Math.abs(det()) < 1e-9) { return; }
        if (timer) { clearInterval(timer); }
        var start = Date.now();
        t = 0.001;
        timer = setInterval(function () {
            t = Math.min(1, (Date.now() - start) / 1000);
            board.update();
            if (t >= 1) { clearInterval(timer); timer = null; }
        }, 40);
    }], {fixed: true, fontSize: 14});
    board.create('text', [10.0, 1.6, function () {
        if (!ok()) { return ''; }
        if (Math.abs(det()) < 1e-9) { return 'The button cannot undo this matrix.'; }
        return t >= 1 ? 'Back on the object ABC.' : '';
    }], tx);
    board.create('text', [10.0, -1.6, 'Solid: object ABC'], tx);
    board.create('text', [10.0, -2.6, 'Dashed: image A′B′C′'], tx);

    [m11, m12, m21, m22].forEach(function (inp) {
        inp.rendNodeInput.addEventListener('input', function () {
            if (timer) { clearInterval(timer); timer = null; }
            t = 0; board.update();
        });
    });
})();
