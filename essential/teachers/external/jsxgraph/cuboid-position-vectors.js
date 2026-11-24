// Corners of a box (G12 Ch12, sec-column-and-position-vectors-in-three-dimensions, lesson 12.2).
// The 40 cm by 30 cm by 20 cm carton OABCDEFG of act-corners-of-a-box drawn in a view3d:
// eight labelled point3d vertices and twelve line3d edges. Clicking a vertex (a 'down' event on its
// 2D projection) shows its position vector as a column and draws the arrow from O to it.
// The view's own sliders (horizontal: turn; vertical: tilt) rotate the box.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-cuboid-position-vectors', {
        boundingbox: [-8, 8, 8, -7],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var off = {visible: false};
    var view = board.create('view3d', [[-4.5, -4.6], [10, 9.5], [[-5, 50], [-5, 50], [-5, 45]]], {
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        az: {slider: {visible: true, withLabel: false, start: 1.1}},
        el: {slider: {visible: true, withLabel: false, start: 0.45}},
        bank: {slider: {visible: false}}
    });
    var lab = {size: 0, withLabel: true, fixed: true, highlight: false, label: {fontSize: 15, useMathJax: false}};
    view.create('point3d', [45, 0, 0], JXG.merge(lab, {name: 'x'}));
    view.create('point3d', [0, 45, 0], JXG.merge(lab, {name: 'y'}));
    view.create('point3d', [0, 0, 30], JXG.merge(lab, {name: 'z'}));
    var V = {O: [0, 0, 0], A: [40, 0, 0], B: [40, 30, 0], C: [0, 30, 0],
             D: [0, 0, 20], E: [40, 0, 20], F: [40, 30, 20], G: [0, 30, 20]};
    var names = ['O', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    var P = {};
    var chosen = 'F';
    names.forEach(function (n) {
        P[n] = view.create('point3d', V[n], {
            name: n, size: 5, fixed: true, highlight: true,
            strokeColor: '#1f4e9c', fillColor: '#ffffff',
            label: {fontSize: 16, useMathJax: false, offset: [8, 8]}
        });
    });
    var edge = {strokeColor: '#000000', strokeWidth: 1.5, highlight: false};
    [['O', 'A'], ['A', 'B'], ['B', 'C'], ['C', 'O'], ['D', 'E'], ['E', 'F'], ['F', 'G'], ['G', 'D'],
     ['O', 'D'], ['A', 'E'], ['B', 'F'], ['C', 'G']].forEach(function (e) {
        view.create('line3d', [P[e[0]], P[e[1]]], edge);
    });
    // arrow from O to the chosen vertex
    var tip = view.create('point3d', [function () { return V[chosen][0]; }, function () { return V[chosen][1]; },
                                      function () { return V[chosen][2]; }], {visible: false});
    view.create('line3d', [[0, 0, 0], tip], {strokeColor: '#1f4e9c', strokeWidth: 3, lastArrow: true, highlight: false});
    function choose(n) {
        chosen = n;
        names.forEach(function (m) {
            P[m].element2D.setAttribute({fillColor: m === n ? '#1f4e9c' : '#ffffff', size: m === n ? 6 : 5});
        });
        board.update();
    }
    names.forEach(function (n) {
        P[n].element2D.on('down', function () { choose(n); });
    });
    board.create('text', [2.6, 5.9, function () {
        var v = V[chosen];
        return '\\(\\overrightarrow{O' + chosen + '} = \\begin{pmatrix} ' + v[0] + ' \\\\ ' + v[1] + ' \\\\ ' + v[2] + ' \\end{pmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 16});
    board.create('text', [2.6, 7.4, function () {
        return 'Position vector of ' + chosen + ' (cm)';
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    choose('F');
})();
