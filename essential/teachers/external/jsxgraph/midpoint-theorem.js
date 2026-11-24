// The midpoint theorem (G12 Ch12 Vectors II, sec-application-of-vectors-to-geometry).
// O, A and B are draggable. M and N are the midpoints of OA and OB; the segment MN (thick) and the side
// AB are drawn with arrows in the directions of MN and AB. The text gives the lengths MN and AB to 2 d.p.
// and their ratio, which is always 0.50, and the vector statement MN = 1/2 AB.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-midpoint-theorem', {
        boundingbox: [-6, 9.5, 10, -2.5],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var XMIN = -5.5, XMAX = 9.5, YMIN = -2, YMAX = 6.8;
    function clamp(p) {
        var px = Math.max(XMIN, Math.min(XMAX, p.X())), py = Math.max(YMIN, Math.min(YMAX, p.Y()));
        if (px !== p.X() || py !== p.Y()) { p.moveTo([px, py]); }
    }
    var ptStyle = {showInfobox: false, size: 4, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [8, 10]}};
    var O = board.create('point', [-4, -1], JXG.merge(ptStyle, {name: 'O'}));
    var A = board.create('point', [-1, 5.5], JXG.merge(ptStyle, {name: 'A'}));
    var B = board.create('point', [7, 0], JXG.merge(ptStyle, {name: 'B'}));
    [O, A, B].forEach(function (p) { p.on('drag', function () { clamp(p); }); p.on('up', function () { clamp(p); }); });

    var mid = {fixed: true, showInfobox: false, size: 3, strokeColor: '#b00000', fillColor: '#b00000', label: {useMathJax: false, fontSize: 15, offset: [-16, 6]}};
    var M = board.create('midpoint', [O, A], JXG.merge(mid, {name: 'M'}));
    var N = board.create('midpoint', [O, B], JXG.merge(mid, {name: 'N', label: {useMathJax: false, fontSize: 15, offset: [4, -14]}}));

    var side = {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false};
    board.create('arrow', [O, A], JXG.merge(side, {name: 'a', withLabel: true, label: {useMathJax: false, fontSize: 15, cssStyle: 'font-weight:bold', offset: [-14, 0]}}));
    board.create('arrow', [O, B], JXG.merge(side, {name: 'b', withLabel: true, label: {useMathJax: false, fontSize: 15, cssStyle: 'font-weight:bold', offset: [0, -14]}}));
    board.create('arrow', [A, B], {strokeColor: '#000000', strokeWidth: 2.5, fixed: true, highlight: false});
    board.create('arrow', [M, N], {strokeColor: '#b00000', strokeWidth: 2.5, dash: 2, fixed: true, highlight: false});

    function len(P, Q) { return Math.sqrt(Math.pow(Q.X() - P.X(), 2) + Math.pow(Q.Y() - P.Y(), 2)); }
    board.create('text', [-5.7, 8.7, function () {
        return '\\(\\overrightarrow{MN} = \\dfrac{1}{2}\\mathbf{b} - \\dfrac{1}{2}\\mathbf{a} = \\dfrac{1}{2}\\overrightarrow{AB}\\)';
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.create('text', [-5.7, 7.6, function () {
        var mn = len(M, N), ab = len(A, B);
        if (ab < 1e-9) { return 'A and B are the same point: drag them apart.'; }
        return 'MN = ' + mn.toFixed(2) + ',  AB = ' + ab.toFixed(2) + ',  MN ÷ AB = ' + (mn / ab).toFixed(2);
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle', useMathJax: false});
    board.update();
})();
