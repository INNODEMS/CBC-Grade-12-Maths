// Equal vectors (G12 Ch11, sec-representation-of-vectors, lesson 11.3).
// Grid from -6 to 6. Vector a from a draggable tail P to a draggable tip Q (both snap to whole numbers; start a = (3, 1)).
// A copy of a starts at a draggable tail R; its tip is always R + a, so the copy is always equal to a.
// Text: the column vectors of a and of the copy.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-equal-vectors', {
        boundingbox: [-7, 9.6, 7, -7],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var g = {strokeColor: '#e0e0e0', strokeWidth: 1, fixed: true, highlight: false};
    for (var gx = -6; gx <= 6; gx++) { board.create('segment', [[gx, -6], [gx, 6]], g); }
    for (var gy = -6; gy <= 6; gy++) { board.create('segment', [[-6, gy], [6, gy]], g); }
    var ax = {strokeColor: '#888888', strokeWidth: 1.5, fixed: true, highlight: false};
    board.create('segment', [[-6, 0], [6, 0]], ax);
    board.create('segment', [[0, -6], [0, 6]], ax);
    function clamp(v) { return Math.max(-6, Math.min(6, Math.round(v))); }
    var pt = {size: 4, snapToGrid: true, snapSizeX: 1, snapSizeY: 1, withLabel: false, strokeColor: '#1f4e9c', fillColor: '#ffffff', strokeWidth: 2};
    var P = board.create('point', [-3, -4], pt);  // tail placed so that a = (-2, 5) fits on the grid
    var Q = board.create('point', [0, -3], pt);
    var R = board.create('point', [1, 2], Object.assign({}, pt, {strokeColor: '#000000'}));
    function vx() { return Q.X() - P.X(); }
    function vy() { return Q.Y() - P.Y(); }
    // keep the copy's tip on the grid by moving its tail if needed
    function keepCopy() {
        var x = clamp(R.X()), y = clamp(R.Y());
        x = Math.max(-6 - Math.min(0, vx()), Math.min(6 - Math.max(0, vx()), x));
        y = Math.max(-6 - Math.min(0, vy()), Math.min(6 - Math.max(0, vy()), y));
        R.moveTo([x, y]);
    }
    P.on('drag', function () { P.moveTo([clamp(P.X()), clamp(P.Y())]); keepCopy(); });
    Q.on('drag', function () { Q.moveTo([clamp(Q.X()), clamp(Q.Y())]); keepCopy(); });
    R.on('drag', keepCopy);
    var S = board.create('point', [function () { return R.X() + vx(); }, function () { return R.Y() + vy(); }], {visible: false});
    board.create('arrow', [P, Q], {strokeColor: '#1f4e9c', strokeWidth: 3, fixed: true, highlight: false});
    board.create('arrow', [R, S], {strokeColor: '#000000', strokeWidth: 3, dash: 2, fixed: true, highlight: false});
    board.create('text', [function () { return (P.X() + Q.X()) / 2 - 0.6; }, function () { return (P.Y() + Q.Y()) / 2 + 0.6; }, '\\(\\mathbf{a}\\)'],
        {fixed: true, highlight: false, fontSize: 17});
    function col(x, y) { return '\\begin{pmatrix} ' + x + ' \\\\ ' + y + ' \\end{pmatrix}'; }
    board.create('text', [-6.5, 8.7, function () {
        return '\\(\\mathbf{a} = ' + col(vx(), vy()) + '\\), starting at \\((' + P.X() + ', ' + P.Y() + ')\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-6.5, 7.2, function () {
        return 'copy \\(= ' + col(vx(), vy()) + '\\), starting at \\((' + R.X() + ', ' + R.Y() + ')\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
})();
