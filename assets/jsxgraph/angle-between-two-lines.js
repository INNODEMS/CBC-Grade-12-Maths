// Angle between two lines in a pyramid (G12 Ch9, sec-angle-between-two-lines, lesson 9.4).
// A right pyramid VABCD on a square base of side 6 in a view3d; slider h (2 to 8, step 0.1) sets the height VO.
// Slider pair (1 to 4) chooses two lines that meet: VA and VC (angle AVC), VA and VB (angle AVB),
// VA and AC (angle VAC), AV and AB (angle VAB). The two lines are thick, the third side of the triangle that
// contains them is dashed, and the triangle is shaded by a 2D polygon over view.project3DTo2D points.
// The angle is shown to 1 d.p. The view's own sliders turn the pyramid.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-angle-between-two-lines', {
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
    var view = board.create('view3d', [[-6, -4.3], [10, 9], [[-4, 4], [-4, 4], [0, 8]]], {
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        xAxis: off, yAxis: off, zAxis: off,
        az: {slider: {visible: true, withLabel: false, start: 2.6}},
        el: {slider: {visible: true, withLabel: false, start: 0.35}},
        bank: {slider: {visible: false}}
    });
    var sh = board.create('slider', [[2.6, 7.2], [6.6, 7.2], [2, 7.2, 8]], {name: 'h', snapWidth: 0.1, precision: 1, withTicks: false});
    var sp = board.create('slider', [[2.6, 6.3], [6.6, 6.3], [1, 1, 4]], {name: 'pair', snapWidth: 1, precision: 0, withTicks: false});
    function H() { return sh.Value(); }
    function K() { return Math.round(sp.Value()); }
    var xyz = {A: [-3, -3, 0], B: [3, -3, 0], C: [3, 3, 0], D: [-3, 3, 0], O: [0, 0, 0]};
    function co(n) { return n === 'V' ? [0, 0, H()] : xyz[n]; }
    var lab = {size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000', label: {fontSize: 15, useMathJax: false}};
    var P = {};
    ['A', 'B', 'C', 'D', 'O', 'V'].forEach(function (n) {
        P[n] = view.create('point3d', [function () { return co(n)[0]; }, function () { return co(n)[1]; }, function () { return co(n)[2]; }],
                           JXG.merge(lab, {name: n}));
    });
    var thin = {strokeColor: '#777777', strokeWidth: 1.2, highlight: false};
    [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['V', 'A'], ['V', 'B'], ['V', 'C'], ['V', 'D']].forEach(function (e) {
        view.create('line3d', [P[e[0]], P[e[1]]], thin);
    });
    view.create('line3d', [P.V, P.O], {strokeColor: '#777777', strokeWidth: 1.2, dash: 1, highlight: false});
    // the four choices: [first line, second line, third side, angle name, vertex, other two]
    var pairs = [null,
        [['V', 'A'], ['V', 'C'], ['A', 'C'], 'AVC', 'V', 'A', 'C'],
        [['V', 'A'], ['V', 'B'], ['A', 'B'], 'AVB', 'V', 'A', 'B'],
        [['V', 'A'], ['A', 'C'], ['V', 'C'], 'VAC', 'A', 'V', 'C'],
        [['A', 'V'], ['A', 'B'], ['V', 'B'], 'VAB', 'A', 'V', 'B']];
    function cur() { return pairs[K()]; }
    // shaded triangle: 2D points that follow the projection of the three vertices
    function proj(n) { var r = view.project3DTo2D(co(n)); return [r[1] / r[0], r[2] / r[0]]; }
    var tv = [4, 5, 6].map(function (m) {
        return board.create('point', [function () { return proj(cur()[m])[0]; }, function () { return proj(cur()[m])[1]; }], {visible: false});
    });
    board.create('polygon', tv, {fillColor: '#999999', fillOpacity: 0.25, highlight: false, fixed: true,
        borders: {visible: false}, vertices: {visible: false}});
    // thick lines (2D segments over the projected points, so they can switch with the pair slider)
    var thick = {strokeColor: '#000000', strokeWidth: 4, highlight: false, fixed: true};
    board.create('segment', [function () { return proj(cur()[0][0]); }, function () { return proj(cur()[0][1]); }], thick);
    board.create('segment', [function () { return proj(cur()[1][0]); }, function () { return proj(cur()[1][1]); }], thick);
    board.create('segment', [function () { return proj(cur()[2][0]); }, function () { return proj(cur()[2][1]); }],
                 {strokeColor: '#000000', strokeWidth: 2.5, dash: 2, highlight: false, fixed: true});
    function angle(q, p, r) {
        var a = co(p), b = co(q), c = co(r), u = [0, 1, 2].map(function (i) { return b[i] - a[i]; }),
            v = [0, 1, 2].map(function (i) { return c[i] - a[i]; });
        var d = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
        return Math.acos(d / Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]) / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])) * 180 / Math.PI;
    }
    function d1(x) { return (Math.floor(10 * x + 0.5) / 10).toFixed(1); }
    board.create('text', [-7.6, 7.2, function () {
        var c = cur();
        return 'Lines \\(' + c[0].join('') + '\\) and \\(' + c[1].join('') + '\\): triangle \\(' + c[3] + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-7.6, 6.2, function () {
        var c = cur();
        return '\\(\\angle ' + c[3] + ' = ' + d1(angle(c[5], c[4], c[6])) + '^{\\circ}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
})();
