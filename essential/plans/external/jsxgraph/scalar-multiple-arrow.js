// Scalar multiples (G12 Ch11, sec-multiplication-of-a-vector-by-a-scalar, lesson 11.5).
// Grid from -8 to 8. a goes from O to a draggable tip A (whole-number components from -3 to 3, not both 0; start a = (1, 2)).
// Slider k from -3 to 3, step 0.5 (start 2). k a is drawn from O, thicker and dashed, along the line of a.
// Text: the column of k a and its direction (same, opposite, or the zero vector).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-scalar-multiple', {
        boundingbox: [-9, 11, 9, -9],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var g = {strokeColor: '#e0e0e0', strokeWidth: 1, fixed: true, highlight: false};
    for (var gx = -8; gx <= 8; gx++) { board.create('segment', [[gx, -8], [gx, 8]], g); }
    for (var gy = -8; gy <= 8; gy++) { board.create('segment', [[-8, gy], [8, gy]], g); }
    var ax = {strokeColor: '#888888', strokeWidth: 1.5, fixed: true, highlight: false};
    board.create('segment', [[-8, 0], [8, 0]], ax);
    board.create('segment', [[0, -8], [0, 8]], ax);
    var k = board.create('slider', [[-8, 10], [-4.5, 10], [-3, 2, 3]], {name: 'k', snapWidth: 0.5, precision: 1, withTicks: false});
    var O = board.create('point', [0, 0], {name: 'O', fixed: true, size: 2, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, offset: [-14, -10]}});
    var A = board.create('point', [1, 2], {name: '', size: 5, snapToGrid: true, snapSizeX: 1, snapSizeY: 1, strokeColor: '#1f4e9c', fillColor: '#ffffff', strokeWidth: 2});
    A.on('drag', function () {
        // keep a's components whole numbers from -3 to 3 so that 3a and -3a stay on the grid
        var x = Math.max(-3, Math.min(3, Math.round(A.X()))), y = Math.max(-3, Math.min(3, Math.round(A.Y())));
        if (x === 0 && y === 0) { x = 1; }
        A.moveTo([x, y]);
    });
    var K = board.create('point', [function () { return k.Value() * A.X(); }, function () { return k.Value() * A.Y(); }], {visible: false});
    board.create('arrow', [O, K], {strokeColor: '#000000', strokeWidth: 5, dash: 2, fixed: true, highlight: false,
        visible: function () { return k.Value() !== 0; }});
    board.create('arrow', [O, A], {strokeColor: '#1f4e9c', strokeWidth: 3, fixed: true, highlight: false});
    function nx() { return -A.Y() / Math.sqrt(A.X() * A.X() + A.Y() * A.Y()); }
    function ny() { return A.X() / Math.sqrt(A.X() * A.X() + A.Y() * A.Y()); }
    board.create('text', [function () { return A.X() / 2 + 0.7 * nx() - 0.2; }, function () { return A.Y() / 2 + 0.7 * ny(); }, '\\(\\mathbf{a}\\)'], {fixed: true, highlight: false, fontSize: 17});
    function f(v) { return (Math.round(v * 100) / 100).toString(); }
    board.create('text', [-0.5, 10, function () {
        var K_ = k.Value();
        return '\\(\\mathbf{a} = \\begin{pmatrix} ' + A.X() + ' \\\\ ' + A.Y() + ' \\end{pmatrix}, \\quad ' + f(K_) + '\\mathbf{a} = \\begin{pmatrix} ' + f(K_ * A.X()) + ' \\\\ ' + f(K_ * A.Y()) + ' \\end{pmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-8.5, -8.6, function () {
        var K_ = k.Value();
        if (K_ === 0) { return '\\(k = 0\\): \\(k\\mathbf{a}\\) is the zero vector.'; }
        return K_ < 0 ? '\\(k \\lt 0\\): \\(k\\mathbf{a}\\) points in the opposite direction to \\(\\mathbf{a}\\).' : '\\(k > 0\\): \\(k\\mathbf{a}\\) points in the same direction as \\(\\mathbf{a}\\).';
    }], {fixed: true, highlight: false, fontSize: 15});
})();
