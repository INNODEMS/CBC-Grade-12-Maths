// Skew lines and the projection of a line onto a plane (G12 Ch9, sec-skew-lines-and-projection-of-a-line, lesson 9.1).
// A cuboid ABCDEFGH (AB = 6, AD = 4, AE = 3 units; E, F, G, H above A, B, C, D) in a view3d.
// Sliders p (0 to 6, along AB) and q (0 to 4, along AD) place P on the base; GP is drawn thick,
// the plumb line GC dotted and the projection CP dashed. Slider pair (0 to 3) highlights two lines:
// 1 AB and CG (skew), 2 AF and DG (parallel), 3 AG and CE (intersecting). The view's own sliders rotate it.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-skew-lines-and-projection', {
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
    var view = board.create('view3d', [[-4.4, -4.8], [10.4, 9.6], [[-2, 8], [-2, 8], [-2, 8]]], {
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        xAxis: off, yAxis: off, zAxis: off,
        az: {slider: {visible: true, withLabel: false, start: 2.6}},
        el: {slider: {visible: true, withLabel: false, start: 0.35}},
        bank: {slider: {visible: false}}
    });
    var sp = board.create('slider', [[3.4, 7.3], [6.0, 7.3], [0, 1.5, 6]], {name: 'p', snapWidth: 0.5, precision: 1, withTicks: false});
    var sq = board.create('slider', [[3.4, 6.6], [6.0, 6.6], [0, 2.5, 4]], {name: 'q', snapWidth: 0.5, precision: 1, withTicks: false});
    var spair = board.create('slider', [[3.4, 5.9], [6.0, 5.9], [0, 0, 3]], {name: 'pair', snapWidth: 1, precision: 0, withTicks: false});
    var L = 6, W = 4, H = 3;
    var xyz = {A: [0, 0, 0], B: [L, 0, 0], C: [L, W, 0], D: [0, W, 0], E: [0, 0, H], F: [L, 0, H], G: [L, W, H], H: [0, W, H]};
    var lab = {size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000', label: {fontSize: 15, useMathJax: false}};
    var pt = {};
    Object.keys(xyz).forEach(function (k) {
        pt[k] = view.create('point3d', xyz[k], JXG.merge(lab, {name: k}));
    });
    var edge = {strokeColor: '#555555', strokeWidth: 1.5, highlight: false};
    [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'],
     ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H']].forEach(function (e) {
        view.create('line3d', [pt[e[0]], pt[e[1]]], edge);
    });
    // P on the base, the line GP, the plumb line GC and the projection CP
    var P = view.create('point3d', [function () { return sp.Value(); }, function () { return sq.Value(); }, 0],
                        {name: 'P', size: 3, fixed: true, highlight: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {fontSize: 15, useMathJax: false, offset: [8, -16]}});
    view.create('line3d', [pt.G, P], {strokeColor: '#1f4e9c', strokeWidth: 3, highlight: false});
    view.create('line3d', [pt.G, pt.C], {strokeColor: '#000000', strokeWidth: 2, dash: 1, highlight: false});
    view.create('line3d', [pt.C, P], {strokeColor: '#1f4e9c', strokeWidth: 3, dash: 2, highlight: false});
    // the highlighted pair: two lines whose ends depend on the pair slider
    var pairs = [null, [['A', 'B'], ['C', 'G']], [['A', 'F'], ['D', 'G']], [['A', 'G'], ['C', 'E']]];
    function end(n, m) {
        return [0, 1, 2].map(function (c) {
            return function () {
                var k = Math.round(spair.Value());
                if (k === 0) { return 0; }
                return xyz[pairs[k][n][m]][c];
            };
        });
    }
    var hl = {strokeColor: '#b03a00', strokeWidth: 4, highlight: false};
    var h1 = view.create('line3d', [view.create('point3d', end(0, 0), off), view.create('point3d', end(0, 1), off)], hl);
    var h2 = view.create('line3d', [view.create('point3d', end(1, 0), off), view.create('point3d', end(1, 1), off)],
                         JXG.merge(hl, {dash: 3}));
    board.on('update', function () {
        var on = Math.round(spair.Value()) > 0;
        h1.setAttribute({visible: on});
        h2.setAttribute({visible: on});
    });
    board.create('text', [-7.6, 7.3, function () {
        if (sp.Value() === L && sq.Value() === W) { return 'P is at C, so the projection of GP is the point C.'; }
        return 'The projection of GP on the base is CP.';
    }], {fixed: true, highlight: false, fontSize: 14, useMathJax: false});
    var said = ['No pair of lines is highlighted.',
                'AB and CG are skew: they never meet and are not parallel.',
                'AF and DG are parallel: they point the same way.',
                'AG and CE intersect at the centre of the cuboid.'];
    board.create('text', [-7.6, 6.6, function () { return said[Math.round(spair.Value())]; }],
                 {fixed: true, highlight: false, fontSize: 14, useMathJax: false});
    board.update();
})();
