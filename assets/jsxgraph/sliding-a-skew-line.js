// Sliding a skew line (G12 Ch9, sec-angle-between-skew-lines, lesson 9.2).
// Cuboid ABCDEFGH (AB = 6, AD = 4, AE = 3 units) in a view3d. Slider pair (1 to 3) chooses two skew lines:
// 1 AB and CH (AB slides to DC; angle DCH = 26.6 degrees), 2 AD and BG (AD slides to BC; angle CBG = 36.9),
// 3 AE and BD (AE slides to BF; angle FBD = 90). Slider slide (0 to 1) moves a copy of the first line
// parallel to itself; at slide = 1 it meets the second line, the angle is marked (2D curve over
// view.project3DTo2D points) and its value shown to 1 d.p. The view's own sliders rotate it.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-sliding-a-skew-line', {
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
    var spair = board.create('slider', [[3.4, 7.3], [6.0, 7.3], [1, 1, 3]], {name: 'pair', snapWidth: 1, precision: 0, withTicks: false});
    var sslide = board.create('slider', [[3.4, 6.6], [6.0, 6.6], [0, 0, 1]], {name: 'slide', snapWidth: 0.05, precision: 2, withTicks: false});
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
    // each case: first line [P, Q], second line [R, S], shift vector, meeting point X, angle name and value
    var cases = [null,
        {a: ['A', 'B'], b: ['C', 'H'], shift: [0, W, 0], X: 'C', other: 'D', name: 'DCH', copy: 'DC'},
        {a: ['A', 'D'], b: ['B', 'G'], shift: [L, 0, 0], X: 'B', other: 'C', name: 'CBG', copy: 'BC'},
        {a: ['A', 'E'], b: ['B', 'D'], shift: [L, 0, 0], X: 'B', other: 'F', name: 'FBD', copy: 'BF'}];
    function cs() { return cases[Math.round(spair.Value())]; }
    function sub(p, q) { return [p[0] - q[0], p[1] - q[1], p[2] - q[2]]; }
    function nrm(p) { return Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]); }
    function angle() {
        var c = cs(), X = xyz[c.X], u = sub(xyz[c.other], X), far = (c.b[0] === c.X) ? c.b[1] : c.b[0], v = sub(xyz[far], X);
        return Math.acos((u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (nrm(u) * nrm(v))) * 180 / Math.PI;
    }
    function coord(which, m, c3) {
        return function () { return xyz[cs()[which][m]][c3]; };
    }
    var thick = {strokeColor: '#b03a00', strokeWidth: 4, highlight: false};
    view.create('line3d', [view.create('point3d', [coord('a', 0, 0), coord('a', 0, 1), coord('a', 0, 2)], off),
                           view.create('point3d', [coord('a', 1, 0), coord('a', 1, 1), coord('a', 1, 2)], off)], thick);
    view.create('line3d', [view.create('point3d', [coord('b', 0, 0), coord('b', 0, 1), coord('b', 0, 2)], off),
                           view.create('point3d', [coord('b', 1, 0), coord('b', 1, 1), coord('b', 1, 2)], off)],
                {strokeColor: '#1f4e9c', strokeWidth: 4, highlight: false});
    // the sliding copy of the first line
    function moved(m, c3) {
        return function () { var c = cs(); return xyz[c.a[m]][c3] + sslide.Value() * c.shift[c3]; };
    }
    view.create('line3d', [view.create('point3d', [moved(0, 0), moved(0, 1), moved(0, 2)], off),
                           view.create('point3d', [moved(1, 0), moved(1, 1), moved(1, 2)], off)],
                {strokeColor: '#b03a00', strokeWidth: 3, dash: 2, highlight: false});
    // the angle mark at X, drawn when the copy meets the second line
    var arc = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 2, highlight: false});
    arc.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        if (sslide.Value() < 0.999) { return; }
        var c = cs(), X = xyz[c.X], far = (c.b[0] === c.X) ? c.b[1] : c.b[0];
        var u = sub(xyz[c.other], X), v = sub(xyz[far], X), nu = nrm(u), nv = nrm(v), k, t, r = 1.0, p, q;
        u = [u[0] / nu, u[1] / nu, u[2] / nu]; v = [v[0] / nv, v[1] / nv, v[2] / nv];
        var th = Math.acos(u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
        for (k = 0; k <= 20; k++) {
            t = th * k / 20;
            p = [0, 1, 2].map(function (j) {
                return X[j] + r * (Math.sin(th - t) * u[j] + Math.sin(t) * v[j]) / Math.sin(th);
            });
            q = view.project3DTo2D(p);
            this.dataX.push(q[1]); this.dataY.push(q[2]);
        }
    };
    board.create('text', [-7.6, 7.3, function () {
        var c = cs();
        return 'Skew lines ' + c.a.join('') + ' and ' + c.b.join('') + '.';
    }], {fixed: true, highlight: false, fontSize: 14, useMathJax: false});
    board.create('text', [-7.6, 6.6, function () {
        var c = cs();
        if (sslide.Value() < 0.999) { return 'Slide ' + c.a.join('') + ' without turning it until it meets ' + c.b.join('') + '.'; }
        var a = Math.floor(10 * angle() + 0.5) / 10;
        return c.a.join('') + ' has moved to ' + c.copy + '. Angle ' + c.name + ' = ' + a.toFixed(1) + '°';
    }], {fixed: true, highlight: false, fontSize: 14, useMathJax: false});
    board.update();
})();
