// A face and the base (G12 Ch9, sec-angle-between-two-planes, lesson 9.6).
// A right pyramid VABCD on a square base of side 6 in a view3d; slider h (1 to 10, step 0.5) sets the height VO.
// M is the midpoint of BC. VM is thick, OM dashed, VO dotted; the face VBC is shaded by a 2D polygon over
// view.project3DTo2D points. VC and OC are thin dashed for comparison. Texts: angle VMO (the slope of the face,
// the angle between the face VBC and the base) and angle VCO (the angle of the edge VC with the base), to 1 d.p.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-face-and-base', {
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
    var view = board.create('view3d', [[-6, -4.3], [10, 9], [[-5, 5], [-5, 5], [0, 10]]], {
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        xAxis: off, yAxis: off, zAxis: off,
        az: {slider: {visible: true, withLabel: false, start: 2.6}},
        el: {slider: {visible: true, withLabel: false, start: 0.35}},
        bank: {slider: {visible: false}}
    });
    var sh = board.create('slider', [[2.6, 7.2], [6.6, 7.2], [1, 4, 10]], {name: 'h', snapWidth: 0.5, precision: 1, withTicks: false});
    function H() { return sh.Value(); }
    var xyz = {A: [-3, -3, 0], B: [3, -3, 0], C: [3, 3, 0], D: [-3, 3, 0], O: [0, 0, 0], M: [3, 0, 0]};
    function co(n) { return n === 'V' ? [0, 0, H()] : xyz[n]; }
    var lab = {size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000', label: {fontSize: 15, useMathJax: false}};
    var P = {};
    ['A', 'B', 'C', 'D', 'O', 'M', 'V'].forEach(function (n) {
        P[n] = view.create('point3d', [function () { return co(n)[0]; }, function () { return co(n)[1]; }, function () { return co(n)[2]; }],
                           JXG.merge(lab, {name: n}));
    });
    var thin = {strokeColor: '#777777', strokeWidth: 1.2, highlight: false};
    [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['V', 'A'], ['V', 'B'], ['V', 'D']].forEach(function (e) {
        view.create('line3d', [P[e[0]], P[e[1]]], thin);
    });
    view.create('line3d', [P.V, P.C], {strokeColor: '#555555', strokeWidth: 1.5, highlight: false});
    view.create('line3d', [P.O, P.C], {strokeColor: '#555555', strokeWidth: 1.5, dash: 3, highlight: false});
    view.create('line3d', [P.V, P.M], {strokeColor: '#000000', strokeWidth: 4, highlight: false});
    view.create('line3d', [P.O, P.M], {strokeColor: '#000000', strokeWidth: 2.5, dash: 2, highlight: false});
    view.create('line3d', [P.V, P.O], {strokeColor: '#000000', strokeWidth: 2, dash: 1, highlight: false});
    function proj(n) { var r = view.project3DTo2D(co(n)); return [r[1] / r[0], r[2] / r[0]]; }
    var tv = ['V', 'B', 'C'].map(function (n) {
        return board.create('point', [function () { return proj(n)[0]; }, function () { return proj(n)[1]; }], {visible: false});
    });
    board.create('polygon', tv, {fillColor: '#999999', fillOpacity: 0.25, highlight: false, fixed: true,
        borders: {visible: false}, vertices: {visible: false}});
    function d1(x) { return (Math.floor(10 * x + 0.5) / 10).toFixed(1); }
    // OM = 3, OC = 3 sqrt 2
    function vmo() { return Math.atan(H() / 3) * 180 / Math.PI; }
    function vco() { return Math.atan(H() / (3 * Math.SQRT2)) * 180 / Math.PI; }
    board.create('text', [-7.6, 7.2, function () { return 'slope of the face: \\(\\angle VMO = ' + d1(vmo()) + '^{\\circ}\\)'; }],
                 {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-7.6, 6.2, function () { return 'edge: \\(\\angle VCO = ' + d1(vco()) + '^{\\circ}\\)'; }],
                 {fixed: true, highlight: false, fontSize: 15});
})();
