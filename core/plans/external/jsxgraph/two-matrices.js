// Two successive transformations (G12 Ch6, sec-successive-transformations).
// Triangle ABC (draggable corners on the integer grid, start A(1, 1), B(4, 1), C(1, 3)).
// Matrices P and Q typed in eight boxes (start P = reflection in the y-axis, Q = rotation 90 degrees anticlockwise).
// First image dotted (A'B'C'), final image dashed (A''B''C''); the single matrix QP printed.
// Checkbox "Do Q first instead" uses Q first, then P, and prints PQ.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-two-matrices', {
        boundingbox: [-8, 8.5, 14, -8],
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
    for (gx = -7; gx <= 7; gx++) { board.create('segment', [[gx, -7], [gx, 7]], g); }
    for (gy = -7; gy <= 7; gy++) { board.create('segment', [[-7, gy], [7, gy]], g); }
    var ax = {strokeColor: '#000000', strokeWidth: 1.5, lastArrow: true, fixed: true, highlight: false};
    board.create('arrow', [[-7.4, 0], [7.6, 0]], ax);
    board.create('arrow', [[0, -7.4], [0, 7.6]], ax);
    var tx = {fixed: true, highlight: false, useMathJax: false, fontSize: 14};
    board.create('text', [7.3, -0.5, 'x'], tx);
    board.create('text', [0.25, 7.6, 'y'], tx);
    board.create('text', [-0.55, -0.45, 'O'], tx);

    // matrix boxes
    function box(x, y, v) { return board.create('input', [x, y, v, ''], {cssStyle: 'width: 38px', fixed: true}); }
    board.create('text', [8.0, 7.2, 'P ='], {fixed: true, highlight: false, useMathJax: false, fontSize: 16});
    var p11 = box(9.3, 7.7, '-1'), p12 = box(11.2, 7.7, '0'), p21 = box(9.3, 6.6, '0'), p22 = box(11.2, 6.6, '1');
    board.create('text', [8.0, 5.0, 'Q ='], {fixed: true, highlight: false, useMathJax: false, fontSize: 16});
    var q11 = box(9.3, 5.5, '0'), q12 = box(11.2, 5.5, '-1'), q21 = box(9.3, 4.4, '1'), q22 = box(11.2, 4.4, '0');
    var swap = board.create('checkbox', [8.0, 3.2, 'Do Q first instead'], {fixed: true, fontSize: 14});

    function num(inp) {
        var s = String(inp.Value()).trim(), v;
        if (s === '') { return NaN; }
        if (/^-?\d+(\.\d+)?\/\d+(\.\d+)?$/.test(s)) { v = s.split('/'); v = Number(v[0]) / Number(v[1]); return isFinite(v) ? v : NaN; }
        v = Number(s);
        return isFinite(v) ? v : NaN;
    }
    function mat(a, b, c, d) { return [[num(a), num(b)], [num(c), num(d)]]; }
    function P() { return mat(p11, p12, p21, p22); }
    function Q() { return mat(q11, q12, q21, q22); }
    function ok() {
        var m = P().concat(Q()), i;
        for (i = 0; i < 4; i++) { if (isNaN(m[i][0]) || isNaN(m[i][1])) { return false; } }
        return true;
    }
    function first() { return swap.Value() ? Q() : P(); }
    function second() { return swap.Value() ? P() : Q(); }
    function mul(M, N) {
        return [[M[0][0] * N[0][0] + M[0][1] * N[1][0], M[0][0] * N[0][1] + M[0][1] * N[1][1]],
                [M[1][0] * N[0][0] + M[1][1] * N[1][0], M[1][0] * N[0][1] + M[1][1] * N[1][1]]];
    }
    function ap(M, X, Y) { return [M[0][0] * X + M[0][1] * Y, M[1][0] * X + M[1][1] * Y]; }

    // object, draggable on the grid, kept inside the board
    var vo = {size: 4, snapToGrid: true, strokeColor: '#000000', fillColor: '#ffffff', label: {useMathJax: false, fontSize: 14, offset: [-14, 8]}};
    var A = board.create('point', [1, 1], JXG.merge(vo, {name: 'A'}));
    var B = board.create('point', [4, 1], JXG.merge(vo, {name: 'B'}));
    var C = board.create('point', [1, 3], JXG.merge(vo, {name: 'C'}));
    [A, B, C].forEach(function (pt) {
        pt.on('drag', function () {
            pt.moveTo([Math.max(-6, Math.min(6, Math.round(pt.X()))), Math.max(-6, Math.min(6, Math.round(pt.Y())))]);
        });
    });
    board.create('polygon', [A, B, C], {fillOpacity: 0.15, fillColor: '#000000', highlight: false, fixed: true,
        borders: {strokeColor: '#000000', strokeWidth: 2.5, fixed: true, highlight: false}, vertices: {visible: false}});

    function imgPt(src, which, name, off) {
        return board.create('point', [
            function () { var M = which === 1 ? first() : mul(second(), first()); return ap(M, src.X(), src.Y())[0]; },
            function () { var M = which === 1 ? first() : mul(second(), first()); return ap(M, src.X(), src.Y())[1]; }],
            {name: name, size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000',
             visible: function () { return ok(); }, label: {useMathJax: false, fontSize: 13, offset: off}});
    }
    var A1 = imgPt(A, 1, "A′", [6, 6]), B1 = imgPt(B, 1, "B′", [6, 6]), C1 = imgPt(C, 1, "C′", [6, 6]);
    var A2 = imgPt(A, 2, "A″", [6, -10]), B2 = imgPt(B, 2, "B″", [6, -10]), C2 = imgPt(C, 2, "C″", [6, -10]);
    var dot = {strokeColor: '#1f4e9c', strokeWidth: 2.5, dash: 1, fixed: true, highlight: false};
    var dsh = {strokeColor: '#9c1f1f', strokeWidth: 2.5, dash: 3, fixed: true, highlight: false};
    [[A1, B1], [B1, C1], [C1, A1]].forEach(function (s) { board.create('segment', s, JXG.merge(dot, {visible: function () { return ok(); }})); });
    [[A2, B2], [B2, C2], [C2, A2]].forEach(function (s) { board.create('segment', s, JXG.merge(dsh, {visible: function () { return ok(); }})); });

    function f(v) { return (Math.round(v * 100) / 100).toString(); }
    function tex(M) { return '\\begin{bmatrix} ' + f(M[0][0]) + ' & ' + f(M[0][1]) + ' \\\\ ' + f(M[1][0]) + ' & ' + f(M[1][1]) + ' \\end{bmatrix}'; }
    board.create('text', [8.0, 1.6, function () {
        if (!ok()) { return 'Type a number in every box.'; }
        return swap.Value() ? 'Q first, then P.' : 'P first, then Q.';
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [8.0, 0.0, function () {
        if (!ok()) { return ''; }
        return (swap.Value() ? '\\(PQ = ' : '\\(QP = ') + tex(mul(second(), first())) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [8.0, -2.4, 'Solid: object ABC'], tx);
    board.create('text', [8.0, -3.4, 'Dotted: first image A′B′C′'], tx);
    board.create('text', [8.0, -4.4, 'Dashed: final image A″B″C″'], tx);
    board.create('text', [8.0, -6.2, function () {
        if (!ok()) { return ''; }
        var M = mul(second(), first()), F = ap(M, A.X(), A.Y());
        return 'A(' + f(A.X()) + ', ' + f(A.Y()) + ') → A″(' + f(F[0]) + ', ' + f(F[1]) + ')';
    }], tx);

    // redraw when a box changes
    [p11, p12, p21, p22, q11, q12, q21, q22].forEach(function (inp) {
        inp.rendNodeInput.addEventListener('input', function () { board.update(); });
    });
    swap.rendNodeCheckbox.addEventListener('change', function () { board.update(); });
})();
