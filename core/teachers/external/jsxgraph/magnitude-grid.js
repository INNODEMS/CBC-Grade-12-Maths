// Magnitude by Pythagoras (G12 Ch11, sec-magnitude-of-a-vector, lesson 11.6).
// Grid from -8 to 8. v goes from O to a draggable tip V (whole numbers, not both 0; start (3, 4)).
// Dashed lines show the across and up components with a right-angle mark; the text gives |v| = sqrt(x^2 + y^2) to 2 d.p.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-magnitude-grid', {
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
    var O = board.create('point', [0, 0], {name: 'O', fixed: true, size: 2, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, offset: [-14, -10]}});
    var V = board.create('point', [3, 4], {name: '', size: 5, snapToGrid: true, snapSizeX: 1, snapSizeY: 1, strokeColor: '#1f4e9c', fillColor: '#ffffff', strokeWidth: 2});
    V.on('drag', function () {
        var x = Math.max(-8, Math.min(8, Math.round(V.X()))), y = Math.max(-8, Math.min(8, Math.round(V.Y())));
        if (x === 0 && y === 0) { x = 1; }
        V.moveTo([x, y]);
    });
    var C = board.create('point', [function () { return V.X(); }, 0], {visible: false});
    var dsh = {strokeColor: '#000000', strokeWidth: 2, dash: 2, fixed: true, highlight: false};
    board.create('segment', [O, C], dsh);
    board.create('segment', [C, V], dsh);
    // right-angle mark at C, drawn as two short segments, when both components are non-zero
    function sx() { return V.X() > 0 ? -0.5 : 0.5; }
    function sy() { return V.Y() > 0 ? 0.5 : -0.5; }
    var rk = {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false, visible: function () { return V.X() !== 0 && V.Y() !== 0; }};
    board.create('segment', [[function () { return V.X() + sx(); }, 0], [function () { return V.X() + sx(); }, function () { return sy(); }]], rk);
    board.create('segment', [[function () { return V.X() + sx(); }, function () { return sy(); }], [function () { return V.X(); }, function () { return sy(); }]], rk);
    board.create('arrow', [O, V], {strokeColor: '#1f4e9c', strokeWidth: 3, fixed: true, highlight: false});
    function f2(v) { return (Math.floor(v * 100 + 0.5) / 100).toFixed(2); }
    board.create('text', [-8.5, 10, function () {
        var x = V.X(), y = V.Y(), s = x * x + y * y, m = Math.sqrt(s);
        function sq(n) { return n < 0 ? '(' + n + ')^2' : n + '^2'; }
        var head = '\\(\\mathbf{v} = \\begin{pmatrix} ' + x + ' \\\\ ' + y + ' \\end{pmatrix}, \\quad |\\mathbf{v}| = \\sqrt{' + sq(x) + ' + ' + sq(y) + '} = \\sqrt{' + s + '}';
        return head + (Math.round(m) * Math.round(m) === s ? ' = ' + Math.round(m) + '\\)' : ' \\approx ' + f2(m) + '\\)');
    }], {fixed: true, highlight: false, fontSize: 15});
})();
