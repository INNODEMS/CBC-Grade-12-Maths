// Magnitude of a vector in 3D (G12 Ch12, sec-magnitude-of-a-vector-in-three-dimensions, lesson 12.4).
// Sliders x, y, z (-5 to 5, step 1, start 2, -1, 2) set r = xi + yj + zk, drawn from O in a view3d
// with its surrounding box (dashed line3d edges) and the base diagonal from O to (x, y, 0) (dotted).
// Text: |r| = sqrt(x^2 + y^2 + z^2) = value, exact and to 2 d.p. The view's own sliders rotate it.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-magnitude-box', {
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
    var view = board.create('view3d', [[-6, -4.6], [11, 10], [[-6, 6], [-6, 6], [-6, 6]]], {
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        az: {slider: {visible: true, withLabel: false, start: 1.1}},
        el: {slider: {visible: true, withLabel: false, start: 0.45}},
        bank: {slider: {visible: false}}
    });
    var lab = {size: 0, withLabel: true, fixed: true, highlight: false, label: {fontSize: 15, useMathJax: false}};
    view.create('point3d', [6.2, 0, 0], JXG.merge(lab, {name: 'x'}));
    view.create('point3d', [0, 6.2, 0], JXG.merge(lab, {name: 'y'}));
    view.create('point3d', [0, 0, 6.2], JXG.merge(lab, {name: 'z'}));
    var sx = board.create('slider', [[2.2, 7.2], [6.4, 7.2], [-5, 2, 5]], {name: 'x', snapWidth: 1, precision: 0, withTicks: false});
    var sy = board.create('slider', [[2.2, 6.3], [6.4, 6.3], [-5, -1, 5]], {name: 'y', snapWidth: 1, precision: 0, withTicks: false});
    var sz = board.create('slider', [[2.2, 5.4], [6.4, 5.4], [-5, 2, 5]], {name: 'z', snapWidth: 1, precision: 0, withTicks: false});
    function X() { return sx.Value(); }
    function Y() { return sy.Value(); }
    function Z() { return sz.Value(); }
    // the eight corners of the box with opposite corners O and (x, y, z)
    var c = {};
    [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].forEach(function (m) {
        c[m.join('')] = view.create('point3d', [function () { return m[0] * X(); }, function () { return m[1] * Y(); },
                                                function () { return m[2] * Z(); }], {visible: false});
    });
    var dsh = {strokeColor: '#555555', strokeWidth: 1.2, dash: 2, highlight: false};
    [['000', '100'], ['100', '110'], ['110', '010'], ['010', '000'], ['001', '101'], ['101', '111'], ['111', '011'],
     ['011', '001'], ['000', '001'], ['100', '101'], ['110', '111'], ['010', '011']].forEach(function (e) {
        view.create('line3d', [c[e[0]], c[e[1]]], dsh);
    });
    view.create('line3d', [c['000'], c['110']], {strokeColor: '#000000', strokeWidth: 2, dash: 1, highlight: false});
    view.create('line3d', [c['000'], c['111']], {strokeColor: '#1f4e9c', strokeWidth: 3, lastArrow: true, highlight: false});
    view.create('point3d', [X, Y, Z], {name: 'R', size: 3, fixed: true, highlight: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15}});
    function sq(v) { return v < 0 ? '(' + v + ')^2' : v + '^2'; }
    board.create('text', [-7.6, 6.6, function () {
        return '\\(\\mathbf{r} = \\begin{pmatrix} ' + X() + ' \\\\ ' + Y() + ' \\\\ ' + Z() + ' \\end{pmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 16});
    board.create('text', [2.2, 4.3, function () {
        var s = X() * X() + Y() * Y() + Z() * Z();
        var r = Math.sqrt(s);
        return '\\(|\\mathbf{r}| = \\sqrt{' + sq(X()) + ' + ' + sq(Y()) + ' + ' + sq(Z()) + '}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [2.2, 3.2, function () {
        var s = X() * X() + Y() * Y() + Z() * Z();
        var r = Math.sqrt(s);
        if (Math.abs(r - Math.round(r)) < 1e-9) { return '\\(= \\sqrt{' + s + '} = ' + Math.round(r) + '\\)'; }
        return '\\(= \\sqrt{' + s + '} \\approx ' + (Math.floor(100 * r + 0.5) / 100).toFixed(2) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
})();
