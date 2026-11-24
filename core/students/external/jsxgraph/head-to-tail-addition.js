// Head-to-tail addition (G12 Ch11, sec-addition-of-vectors, lesson 11.4).
// Grid from -6 to 8. a is drawn from O to a draggable tip A (start (3, 1)); b starts at A and ends at a draggable tip B
// (start b = (2, 3)). Dragging A carries B with it, so b keeps its column. The dashed resultant a + b goes from O to B.
// Text: the columns of a, b and a + b.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-head-to-tail', {
        boundingbox: [-7, 11, 9, -7],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var g = {strokeColor: '#e0e0e0', strokeWidth: 1, fixed: true, highlight: false};
    for (var gx = -6; gx <= 8; gx++) { board.create('segment', [[gx, -6], [gx, 8]], g); }
    for (var gy = -6; gy <= 8; gy++) { board.create('segment', [[-6, gy], [8, gy]], g); }
    var ax = {strokeColor: '#888888', strokeWidth: 1.5, fixed: true, highlight: false};
    board.create('segment', [[-6, 0], [8, 0]], ax);
    board.create('segment', [[0, -6], [0, 8]], ax);
    function cl(v) { return Math.max(-6, Math.min(8, Math.round(v))); }
    var O = board.create('point', [0, 0], {name: 'O', fixed: true, size: 2, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, offset: [-14, -10]}});
    var pt = {size: 4, snapToGrid: true, snapSizeX: 1, snapSizeY: 1, withLabel: false, strokeWidth: 2, fillColor: '#ffffff'};
    var A = board.create('point', [3, 1], Object.assign({}, pt, {strokeColor: '#1f4e9c'}));
    var B = board.create('point', [5, 4], Object.assign({}, pt, {strokeColor: '#000000'}));
    var bx = 2, by = 3;
    A.on('drag', function () {
        A.moveTo([cl(A.X()), cl(A.Y())]);
        B.moveTo([cl(A.X() + bx), cl(A.Y() + by)]);
        bx = B.X() - A.X(); by = B.Y() - A.Y();
    });
    B.on('drag', function () {
        B.moveTo([cl(B.X()), cl(B.Y())]);
        bx = B.X() - A.X(); by = B.Y() - A.Y();
    });
    board.create('arrow', [O, A], {strokeColor: '#1f4e9c', strokeWidth: 3, fixed: true, highlight: false});
    board.create('arrow', [A, B], {strokeColor: '#000000', strokeWidth: 3, fixed: true, highlight: false});
    board.create('arrow', [O, B], {strokeColor: '#555555', strokeWidth: 2, dash: 2, fixed: true, highlight: false,
        visible: function () { return B.X() !== 0 || B.Y() !== 0; }});
    board.create('text', [function () { return A.X() / 2 - 0.7; }, function () { return A.Y() / 2 + 0.5; }, '\\(\\mathbf{a}\\)'], {fixed: true, highlight: false, fontSize: 17});
    board.create('text', [function () { return (A.X() + B.X()) / 2 + 0.3; }, function () { return (A.Y() + B.Y()) / 2 + 0.3; }, '\\(\\mathbf{b}\\)'], {fixed: true, highlight: false, fontSize: 17});
    function col(x, y) { return '\\begin{pmatrix} ' + x + ' \\\\ ' + y + ' \\end{pmatrix}'; }
    board.create('text', [-6.5, 9.6, function () {
        var ax_ = A.X(), ay_ = A.Y(), bx_ = B.X() - A.X(), by_ = B.Y() - A.Y();
        return '\\(\\mathbf{a} = ' + col(ax_, ay_) + ', \\quad \\mathbf{b} = ' + col(bx_, by_) + ', \\quad \\mathbf{a} + \\mathbf{b} = ' + col(B.X(), B.Y()) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-6.5, -6.6, function () {
        return (B.X() === 0 && B.Y() === 0) ? '\\(\\mathbf{a} + \\mathbf{b}\\) is the zero vector: the route ends where it began.' : 'The dashed arrow is the resultant \\(\\mathbf{a} + \\mathbf{b}\\).';
    }], {fixed: true, highlight: false, fontSize: 14});
})();
