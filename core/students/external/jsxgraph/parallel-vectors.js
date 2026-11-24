// Parallel vectors (G12 Ch12, sec-parallel-vectors, lesson 12.5).
// 2D grid. Vector a from the fixed point O(-4, 0) to a draggable tip (whole-number components from -2 to 2, not both 0; start a = (2, 1)).
// Slider k from -3 to 3, step 0.5 (start 2). b = k a is drawn from the fixed point S(3, -1).
// Text: b = k a with its components, |b| = |k| |a|, and the direction (same, opposite, or the zero vector).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-parallel-vectors', {
        boundingbox: [-9, 9, 11, -8],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var g = {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false};
    for (var gx = -8; gx <= 10; gx++) { board.create('segment', [[gx, -7], [gx, 5]], g); }
    for (var gy = -7; gy <= 5; gy++) { board.create('segment', [[-8, gy], [10, gy]], g); }
    var k = board.create('slider', [[-7.5, 7.8], [-1.5, 7.8], [-3, 2, 3]], {name: 'k', snapWidth: 0.5, precision: 1, withTicks: false});
    var O = board.create('point', [-4, 0], {name: 'O', fixed: true, size: 2, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, offset: [-14, -10]}});
    var A = board.create('point', [-2, 1], {name: '', size: 5, snapToGrid: true, strokeColor: '#1f4e9c', fillColor: '#ffffff'});
    A.on('drag', function () {
        // keep the tip on the grid and a non-zero
        var x = Math.max(-2, Math.min(2, Math.round(A.X() + 4))), y = Math.max(-2, Math.min(2, Math.round(A.Y())));
        if (x === 0 && y === 0) { x = 1; }
        A.moveTo([x - 4, y]);
    });
    function ax() { return A.X() - O.X(); }
    function ay() { return A.Y() - O.Y(); }
    board.create('arrow', [O, A], {strokeColor: '#1f4e9c', strokeWidth: 3, fixed: true, highlight: false});
    function nx() { return -ay() / Math.sqrt(ax() * ax() + ay() * ay()); }
    function ny() { return ax() / Math.sqrt(ax() * ax() + ay() * ay()); }
    board.create('text', [function () { return O.X() + ax() / 2 + 0.7 * nx() - 0.2; }, function () { return ay() / 2 + 0.7 * ny(); }, '\\(\\mathbf{a}\\)'], {fixed: true, highlight: false, fontSize: 17});
    var S = board.create('point', [3, -1], {name: 'S', fixed: true, size: 2, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, offset: [-16, 10]}});
    var B = board.create('point', [function () { return 3 + k.Value() * ax(); }, function () { return -1 + k.Value() * ay(); }], {visible: false});
    board.create('arrow', [S, B], {strokeColor: '#000000', strokeWidth: 3, dash: 2, fixed: true, highlight: false,
        visible: function () { return k.Value() !== 0; }});
    board.create('text', [function () { return 3 + k.Value() * ax() / 2 - 0.7 * nx() - 0.2; }, function () { return -1 + k.Value() * ay() / 2 - 0.7 * ny(); }, '\\(\\mathbf{b}\\)'],
        {fixed: true, highlight: false, fontSize: 17, visible: function () { return k.Value() !== 0; }});
    function f(v) { return (Math.round(v * 100) / 100).toString(); }
    board.create('text', [0.5, 7.3, function () {
        var K = k.Value();
        return '\\(\\mathbf{a} = \\begin{pmatrix} ' + f(ax()) + ' \\\\ ' + f(ay()) + ' \\end{pmatrix}, \\quad \\mathbf{b} = ' + f(K) + '\\mathbf{a} = \\begin{pmatrix} ' + f(K * ax()) + ' \\\\ ' + f(K * ay()) + ' \\end{pmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [0.5, 6.0, function () {
        var K = k.Value(), m = Math.sqrt(ax() * ax() + ay() * ay());
        if (K === 0) { return '\\(k = 0\\): \\(\\mathbf{b}\\) is the zero vector, which has no direction.'; }
        return '\\(|\\mathbf{b}| = |k|\\,|\\mathbf{a}| = ' + f(Math.abs(K)) + ' \\times ' + f(m) + ' = ' + f(Math.abs(K) * m) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-8.5, -7.5, function () {
        var K = k.Value();
        if (K === 0) { return ''; }
        return K < 0 ? '\\(k \\lt 0\\): \\(\\mathbf{b}\\) points in the opposite direction to \\(\\mathbf{a}\\)' : '\\(k > 0\\): \\(\\mathbf{b}\\) points in the same direction as \\(\\mathbf{a}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
})();
