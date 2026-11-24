// A point in space (G12 Ch12, sec-vector-coordinates-in-two-and-three-dimensions, lesson 12.1).
// 3D axes (view3d) with a point P(x, y, z) set by three sliders (-4 to 4, step 1, start 3, 4, 2).
// Dashed lines run from P down to (x, y, 0) and from there to the x- and y-axes.
// The view's own sliders (horizontal: turn; vertical: tilt) rotate the axes.
// Sliders, not a draggable point: in JSXGraph 1.8.0 a point3d drags only within a plane.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-point-in-space', {
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
    var view = board.create('view3d', [[-6, -4.6], [11, 10], [[-5, 5], [-5, 5], [-5, 5]]], {
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        az: {slider: {visible: true, withLabel: false, start: 1.1}},
        el: {slider: {visible: true, withLabel: false, start: 0.45}},
        bank: {slider: {visible: false}}
    });
    var lab = {size: 0, withLabel: true, fixed: true, highlight: false, label: {fontSize: 15, useMathJax: false}};
    view.create('point3d', [5.3, 0, 0], JXG.merge(lab, {name: 'x'}));
    view.create('point3d', [0, 5.3, 0], JXG.merge(lab, {name: 'y'}));
    view.create('point3d', [0, 0, 5.3], JXG.merge(lab, {name: 'z'}));
    view.create('point3d', [0, 0, 0], {name: 'O', size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, offset: [-14, -6]}});
    var sx = board.create('slider', [[2.2, 7.2], [6.4, 7.2], [-4, 3, 4]], {name: 'x', snapWidth: 1, precision: 0, withTicks: false});
    var sy = board.create('slider', [[2.2, 6.3], [6.4, 6.3], [-4, 4, 4]], {name: 'y', snapWidth: 1, precision: 0, withTicks: false});
    var sz = board.create('slider', [[2.2, 5.4], [6.4, 5.4], [-4, 2, 4]], {name: 'z', snapWidth: 1, precision: 0, withTicks: false});
    function X() { return sx.Value(); }
    function Y() { return sy.Value(); }
    function Z() { return sz.Value(); }
    var P = view.create('point3d', [X, Y, Z], {name: 'P', size: 4, fixed: true, highlight: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15}});
    var F = view.create('point3d', [X, Y, 0], {name: '', size: 2, fixed: true, highlight: false, strokeColor: '#555555', fillColor: '#555555'});
    var Ax = view.create('point3d', [X, 0, 0], {visible: false});
    var Ay = view.create('point3d', [0, Y, 0], {visible: false});
    var dsh = {strokeColor: '#555555', strokeWidth: 1.5, dash: 2, highlight: false};
    view.create('line3d', [P, F], dsh);
    view.create('line3d', [F, Ax], dsh);
    view.create('line3d', [F, Ay], dsh);
    view.create('line3d', [[0, 0, 0], P], {strokeColor: '#1f4e9c', strokeWidth: 2, highlight: false, lastArrow: true});
    board.create('text', [2.4, 4.4, function () {
        return '\\(P(' + X() + ', ' + Y() + ', ' + Z() + ')\\)';
    }], {fixed: true, highlight: false, fontSize: 16});
    board.create('text', [2.4, 3.0, function () {
        return '\\(\\overrightarrow{OP} = \\begin{pmatrix} ' + X() + ' \\\\ ' + Y() + ' \\\\ ' + Z() + ' \\end{pmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 16});
})();
