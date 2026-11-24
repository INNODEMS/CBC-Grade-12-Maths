// Diagonals of a cuboid (G12 Ch9, sec-length-of-a-line-in-three-dimensions, lesson 9.3).
// Sliders l, w, h (1 to 8, step 0.5) set the cuboid ABCDEFGH (AB = l, BC = w, AE = h) in a view3d.
// The base diagonal AC and the space diagonal AG are drawn; the right-angled triangles ABC and ACG are
// shaded by 2D polygons whose vertices follow view.project3DTo2D (JSXGraph 1.8.0 has no fillable polygon3d).
// Texts give AC = sqrt(l^2 + w^2) and AG = sqrt(l^2 + w^2 + h^2), to 2 d.p. The view's own sliders rotate it.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-cuboid-diagonals', {
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
    var view = board.create('view3d', [[-4.4, -4.8], [10.4, 9.6], [[-1.5, 9.5], [-1.5, 9.5], [-1.5, 9.5]]], {
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        xAxis: off, yAxis: off, zAxis: off,
        az: {slider: {visible: true, withLabel: false, start: 2.6}},
        el: {slider: {visible: true, withLabel: false, start: 0.35}},
        bank: {slider: {visible: false}}
    });
    var sl = board.create('slider', [[3.4, 7.3], [6.0, 7.3], [1, 6, 8]], {name: 'l', snapWidth: 0.5, precision: 1, withTicks: false});
    var sw = board.create('slider', [[3.4, 6.6], [6.0, 6.6], [1, 4, 8]], {name: 'w', snapWidth: 0.5, precision: 1, withTicks: false});
    var sh = board.create('slider', [[3.4, 5.9], [6.0, 5.9], [1, 3, 8]], {name: 'h', snapWidth: 0.5, precision: 1, withTicks: false});
    function l() { return sl.Value(); }
    function w() { return sw.Value(); }
    function h() { return sh.Value(); }
    // corners: unit multipliers of (l, w, h)
    var m = {A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1]};
    function xyz(k) { return [m[k][0] * l(), m[k][1] * w(), m[k][2] * h()]; }
    var lab = {size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000', label: {fontSize: 15, useMathJax: false}};
    var pt = {};
    Object.keys(m).forEach(function (k) {
        pt[k] = view.create('point3d', [function () { return xyz(k)[0]; }, function () { return xyz(k)[1]; }, function () { return xyz(k)[2]; }],
                            JXG.merge(lab, {name: k}));
    });
    // shaded triangles ABC and ACG: 2D polygons over projected corners
    function p2(k) {
        return board.create('point', [function () { return view.project3DTo2D(xyz(k))[1]; },
                                      function () { return view.project3DTo2D(xyz(k))[2]; }], {visible: false});
    }
    var q = {A: p2('A'), B: p2('B'), C: p2('C'), G: p2('G')};
    var fill = {fixed: true, highlight: false, borders: {visible: false}, vertices: {visible: false}};
    board.create('polygon', [q.A, q.B, q.C], JXG.merge(fill, {fillColor: '#f4b183', fillOpacity: 0.45}));
    board.create('polygon', [q.A, q.C, q.G], JXG.merge(fill, {fillColor: '#9dc3e6', fillOpacity: 0.45}));
    var edge = {strokeColor: '#555555', strokeWidth: 1.5, highlight: false};
    [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'],
     ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H']].forEach(function (e) {
        view.create('line3d', [pt[e[0]], pt[e[1]]], edge);
    });
    view.create('line3d', [pt.A, pt.C], {strokeColor: '#000000', strokeWidth: 3, dash: 2, highlight: false});
    view.create('line3d', [pt.A, pt.G], {strokeColor: '#1f4e9c', strokeWidth: 3, highlight: false});
    function d2(v) { return (Math.floor(100 * v + 0.5) / 100).toFixed(2); }
    function num(v) { return (v === Math.floor(v)) ? String(v) : v.toFixed(1); }
    function sq(v) { return num(v) + '^2'; }
    function eqv(s) {
        var r = Math.sqrt(s);
        if (Math.abs(100 * r - Math.round(100 * r)) < 1e-9) { return '= ' + d2(r).replace(/\.?0+$/, ''); }
        return '\\approx ' + d2(r);
    }
    board.create('text', [-7.6, 7.3, function () {
        var s = l() * l() + w() * w();
        return '\\(AC = \\sqrt{' + sq(l()) + ' + ' + sq(w()) + '} ' + eqv(s) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-7.6, 6.3, function () {
        var s = l() * l() + w() * w() + h() * h();
        return '\\(AG = \\sqrt{' + sq(l()) + ' + ' + sq(w()) + ' + ' + sq(h()) + '} ' + eqv(s) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.update();
})();
