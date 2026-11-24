// Translation of a triangle (G12 Ch11, sec-translation-vector, lesson 11.7).
// Grid from -8 to 8. Triangle ABC with draggable vertices (snap to whole numbers; start A(-4, -3), B(-1, -3), C(-4, -1)).
// Sliders a and b (-6 to 6, step 1; start 5 and 2) give T; both are held so the image stays on the grid. The image A'B'C' is dashed, with thin arrows AA', BB', CC'.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-translation', {
        boundingbox: [-9, 12, 9, -9],
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
    var a = board.create('slider', [[-8, 11], [-3, 11], [-6, 5, 6]], {name: 'a', snapWidth: 1, precision: 0, withTicks: false});
    var b = board.create('slider', [[-8, 9.8], [-3, 9.8], [-6, 2, 6]], {name: 'b', snapWidth: 1, precision: 0, withTicks: false});
    // The object and its image both stay on the grid from -8 to 8, so no point or label
    // leaves the board at extreme slider values. A vertex is held inside the grid and inside the range that
    // keeps its image on the grid; a slider is held to the values that keep the whole image on the grid.
    function cl(v, t) { return Math.max(Math.max(-8, -8 - t), Math.min(Math.min(8, 8 - t), Math.round(v))); }
    var vp = {size: 4, snapToGrid: true, snapSizeX: 1, snapSizeY: 1, strokeColor: '#000000', fillColor: '#ffffff', strokeWidth: 2, label: {useMathJax: false, fontSize: 15, offset: [-16, 8]}};
    var A = board.create('point', [-4, -3], Object.assign({name: 'A'}, vp));
    var B = board.create('point', [-1, -3], Object.assign({name: 'B'}, vp));
    var C = board.create('point', [-4, -1], Object.assign({name: 'C'}, vp));
    [A, B, C].forEach(function (P) { P.on('drag', function () { P.moveTo([cl(P.X(), a.Value()), cl(P.Y(), b.Value())]); }); });
    function hold(s, c) {
        var lo = -8 - Math.min(c(A), c(B), c(C)), hi = 8 - Math.max(c(A), c(B), c(C));
        var v = Math.max(lo, Math.min(hi, Math.round(s.Value())));
        if (v !== s.Value()) { s.setValue(v); board.update(); }
    }
    a.on('drag', function () { hold(a, function (P) { return P.X(); }); });
    b.on('drag', function () { hold(b, function (P) { return P.Y(); }); });
    var ln = {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false};
    board.create('segment', [A, B], ln); board.create('segment', [B, C], ln); board.create('segment', [C, A], ln);
    function img(P, name) {
        return board.create('point', [function () { return P.X() + a.Value(); }, function () { return P.Y() + b.Value(); }],
            {name: name, size: 3, fixed: true, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [6, 8], strokeColor: '#1f4e9c'}});
    }
    var A1 = img(A, 'A′'), B1 = img(B, 'B′'), C1 = img(C, 'C′');
    var dl = {strokeColor: '#1f4e9c', strokeWidth: 2, dash: 2, fixed: true, highlight: false};
    board.create('segment', [A1, B1], dl); board.create('segment', [B1, C1], dl); board.create('segment', [C1, A1], dl);
    var th = {strokeColor: '#777777', strokeWidth: 1, fixed: true, highlight: false,
        visible: function () { return a.Value() !== 0 || b.Value() !== 0; }};
    board.create('arrow', [A, A1], th); board.create('arrow', [B, B1], th); board.create('arrow', [C, C1], th);
    board.create('text', [0.5, 10.4, function () {
        return '\\(\\mathbf{T} = \\begin{pmatrix} ' + a.Value() + ' \\\\ ' + b.Value() + ' \\end{pmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 16});
})();
