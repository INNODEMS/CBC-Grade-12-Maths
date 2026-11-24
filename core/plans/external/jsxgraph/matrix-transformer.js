// Matrix transformer (G12 Ch6, sec-matrices-of-transformation, lessons 1.1 and 1.2).
// Grid from -8 to 8 both ways. Triangle ABC with draggable corners snapped to whole numbers (start A(1, 1), B(3, 1), C(1, 2)).
// Four input boxes a, b, c, d for the matrix [a b; c d] (start the identity). The image A'B'C' is drawn dashed,
// with its coordinates printed. A checkbox shows the unit square OABC (corners (1, 0), (1, 1), (0, 1)) and its image.
// The determinant is not shown (it is taught in section 6.4).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-matrix-transformer', {
        boundingbox: [-14.5, 8.75, 8.5, -8.5],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var g = {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false};
    for (var gx = -8; gx <= 8; gx++) { board.create('segment', [[gx, -8], [gx, 8]], g); }
    for (var gy = -8; gy <= 8; gy++) { board.create('segment', [[-8, gy], [8, gy]], g); }
    var ax = {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false, lastArrow: true};
    board.create('arrow', [[-8, 0], [8.2, 0]], ax);
    board.create('arrow', [[0, -8], [0, 8.2]], ax);
    var tl = {fixed: true, highlight: false, useMathJax: false, fontSize: 14};
    board.create('text', [8.0, -0.45, 'x'], tl);
    board.create('text', [0.25, 8.2, 'y'], tl);
    board.create('text', [-0.55, -0.4, 'O'], tl);

    // matrix entries: four input boxes laid out like the matrix
    board.create('text', [-14.2, 7.9, 'Matrix:'], {fixed: true, highlight: false, useMathJax: false, fontSize: 15});
    var ia = board.create('input', [-14.2, 6.9, '1', 'a = '], {cssStyle: 'width: 40px', fontSize: 15, fixed: true});
    var ib = board.create('input', [-11.3, 6.9, '0', 'b = '], {cssStyle: 'width: 40px', fontSize: 15, fixed: true});
    var ic = board.create('input', [-14.2, 5.8, '0', 'c = '], {cssStyle: 'width: 40px', fontSize: 15, fixed: true});
    var id = board.create('input', [-11.3, 5.8, '1', 'd = '], {cssStyle: 'width: 40px', fontSize: 15, fixed: true});
    [ia, ib, ic, id].forEach(function (el) {
        if (el.rendNodeInput) {
            el.rendNodeInput.addEventListener('input', function () { board.update(); });
            el.rendNodeInput.addEventListener('change', function () { board.update(); });
        }
    });
    function val(el) {
        var s = String(el.Value()).trim().replace(/−/g, '-');
        if (s === '' || !/^[-+]?(\d+\.?\d*|\.\d+)(\/\d+(\.\d*)?)?$/.test(s)) { return NaN; }
        var p = s.split('/');
        return p.length === 2 ? Number(p[0]) / Number(p[1]) : Number(s);
    }
    function M() { return [val(ia), val(ib), val(ic), val(id)]; }
    function ok() { var m = M(); return m.every(function (v) { return isFinite(v); }); }
    function f(v) { var r = Math.round(v * 100) / 100; return (r === 0 ? 0 : r).toString(); }
    board.create('text', [-14.2, 4.7, function () {
        if (ok()) { return ''; }
        return 'Type a number in each box.';
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 15, strokeColor: '#000000'});

    // the object triangle: corners snap to whole numbers and stay on the grid
    var pa = {size: 4, snapToGrid: true, snapSizeX: 1, snapSizeY: 1, strokeColor: '#000000', fillColor: '#ffffff',
        label: {useMathJax: false, fontSize: 14, offset: [-14, 10]}};
    var A = board.create('point', [1, 1], Object.assign({name: 'A'}, pa));
    var B = board.create('point', [3, 1], Object.assign({name: 'B'}, pa));
    var C = board.create('point', [1, 2], Object.assign({name: 'C'}, pa));
    [A, B, C].forEach(function (P) {
        P.on('drag', function () {
            var x = Math.max(-7, Math.min(7, Math.round(P.X()))), y = Math.max(-7, Math.min(7, Math.round(P.Y())));
            P.moveTo([x, y]);
        });
    });
    board.create('polygon', [A, B, C], {fillColor: '#000000', fillOpacity: 0.12, highlight: false,
        borders: {strokeColor: '#000000', strokeWidth: 2.5, highlight: false}, vertices: {visible: false}});

    function img(P, k) {
        return function () { var m = M(); return k === 0 ? m[0] * P.X() + m[1] * P.Y() : m[2] * P.X() + m[3] * P.Y(); };
    }
    var vis = function () { return ok(); };
    var pi = {size: 3, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000', visible: vis,
        label: {useMathJax: false, fontSize: 14, offset: [8, -10]}};
    // an image corner off the grid is not drawn (its coordinates are still printed)
    function mk(P, nm) {
        var Q = board.create('point', [img(P, 0), img(P, 1)], Object.assign({name: nm}, pi));
        Q.setAttribute({visible: function () { return ok() && Math.abs(Q.X()) <= 7.6 && Math.abs(Q.Y()) <= 7.6; }});
        return Q;
    }
    var A1 = mk(A, 'A\u2032'), B1 = mk(B, 'B\u2032'), C1 = mk(C, 'C\u2032');
    board.create('polygon', [A1, B1, C1], {fillOpacity: 0, highlight: false, visible: vis,
        borders: {strokeColor: '#000000', strokeWidth: 2, dash: 2, highlight: false, visible: vis}, vertices: {visible: false}});

    // unit square OABC and its image (shown with the checkbox)
    var cb = board.create('checkbox', [-14.2, -7.6, ' Show the unit square'], {fixed: true, useMathJax: false, fontSize: 15});
    var sq = function () { return cb.Value(); };
    var sqi = function () { return cb.Value() && ok(); };
    board.create('polygon', [[0, 0], [1, 0], [1, 1], [0, 1]], {fillColor: '#000000', fillOpacity: 0.25, highlight: false, visible: sq,
        borders: {strokeColor: '#000000', strokeWidth: 2, highlight: false, visible: sq}, vertices: {visible: false}});
    function sp(x, y) {
        return [function () { var m = M(); return m[0] * x + m[1] * y; }, function () { var m = M(); return m[2] * x + m[3] * y; }];
    }
    var s1 = sp(1, 0), s2 = sp(1, 1), s3 = sp(0, 1);
    board.create('polygon', [[0, 0], s1, s2, s3], {fillOpacity: 0, highlight: false, visible: sqi,
        borders: {strokeColor: '#000000', strokeWidth: 2, dash: 3, highlight: false, visible: sqi}, vertices: {visible: false}});

    // coordinates
    var tc = {fixed: true, highlight: false, useMathJax: false, fontSize: 15};
    function line(P, Q, name) {
        return function () {
            var s = name + '(' + f(P.X()) + ', ' + f(P.Y()) + ')';
            if (ok()) { s += '  →  ' + name + "′(" + f(Q.X()) + ', ' + f(Q.Y()) + ')'; }
            return s;
        };
    }
    board.create('text', [-14.2, 3.4, 'Object  →  image'], tc);
    board.create('text', [-14.2, 2.4, line(A, A1, 'A')], tc);
    board.create('text', [-14.2, 1.4, line(B, B1, 'B')], tc);
    board.create('text', [-14.2, 0.4, line(C, C1, 'C')], tc);
    board.create('text', [-14.2, -5.2, function () {
        if (!cb.Value() || !ok()) { return ''; }
        var m = M();
        return '(1, 0) → (' + f(m[0]) + ', ' + f(m[2]) + ')';
    }], tc);
    board.create('text', [-14.2, -6.2, function () {
        if (!cb.Value() || !ok()) { return ''; }
        var m = M();
        return '(0, 1) → (' + f(m[1]) + ', ' + f(m[3]) + ')';
    }], tc);
    board.create('text', [-14.2, -1.6, 'Solid: object'], tc);
    board.create('text', [-14.2, -2.6, 'Dashed: image'], tc);
})();
