// Radius of a parallel of latitude (G12 Ch13, sec-distances-on-the-earths-surface, lesson 2.2).
// Cross-section of the earth through the poles: circle of radius R (6370 km), the axis and the
// equator. The phi slider moves P round the circle; the segment from the axis to P is the
// radius of P's parallel, r = R cos phi. A flattened ellipse shows the parallel in perspective.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-parallel-radius-cross-section', {
        boundingbox: [-5, 6, 11, -6],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var R = 4, D = Math.PI / 180;
    var st = board.create('slider', [[4.7, 5.2], [7.9, 5.2], [0, 30, 90]], {name: '&phi;', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}});
    function T() { return Math.round(st.Value()); }
    function th() { return T() * D; }
    var O = board.create('point', [0, 0], {name: 'O', size: 2, fixed: true, highlight: false, color: '#000000', label: {useMathJax: false, offset: [-14, -10]}});
    board.create('circle', [O, R], {strokeColor: '#000000', strokeWidth: 2, highlight: false, fixed: true});
    board.create('segment', [[0, -R - 0.5], [0, R + 0.5]], {strokeColor: '#555555', strokeWidth: 1, dash: 2, highlight: false, fixed: true});
    board.create('segment', [[-R, 0], [R, 0]], {strokeColor: '#555555', strokeWidth: 1.5, highlight: false, fixed: true});
    board.create('text', [-R + 0.1, -0.45, 'equator'], {fixed: true, highlight: false, fontSize: 12, useMathJax: false});
    board.create('text', [-0.55, R + 0.4, 'N'], {fixed: true, highlight: false, fontSize: 14, useMathJax: false});
    board.create('text', [-0.55, -R - 0.4, 'S'], {fixed: true, highlight: false, fontSize: 14, useMathJax: false});
    var P = board.create('point', [function () { return R * Math.cos(th()); }, function () { return R * Math.sin(th()); }],
        {name: 'P', size: 4, fixed: true, highlight: false, color: '#1f4e9c', label: {useMathJax: false, offset: [8, 6]}});
    var C = board.create('point', [0, function () { return R * Math.sin(th()); }],
        {name: 'C', size: 2, visible: function () { return T() > 0; }, fixed: true, highlight: false, color: '#000000', label: {useMathJax: false, offset: [-16, -10]}});
    var E = board.create('point', [function () { return R * Math.cos(th()); }, 0], {visible: false});
    board.create('segment', [O, P], {strokeColor: '#000000', strokeWidth: 2, highlight: false});
    board.create('segment', [C, P], {strokeColor: '#1f4e9c', strokeWidth: 4, highlight: false});
    board.create('text', [function () { return R * Math.cos(th()) / 2 + 0.2; }, function () { return R * Math.sin(th()) / 2 - 0.1; }, '\\(R\\)'],
        {fixed: true, highlight: false, fontSize: 15, anchorX: 'left', anchorY: 'top'});
    board.create('text', [function () { return R * Math.cos(th()) / 2 - 0.2; }, function () { return R * Math.sin(th()) + 0.45; }, '\\(r\\)'],
        {fixed: true, highlight: false, fontSize: 15});
    board.create('angle', [E, O, P], {radius: 1.0, name: '\\(\\phi\\)', fillOpacity: 0.15, highlight: false, fixed: true,
        visible: function () { return T() > 3; }, label: {fontSize: 14}});
    // the parallel seen in perspective: a flattened ellipse through P
    board.create('curve', [function (t) { return R * Math.cos(th()) * Math.cos(t); }, function (t) { return R * Math.sin(th()) + 0.22 * R * Math.cos(th()) * Math.sin(t); }, 0, 2 * Math.PI],
        {strokeColor: '#1f4e9c', strokeWidth: 1.5, dash: 2, highlight: false});
    board.create('text', [4.7, 4.1, function () { return '\\(\\phi = ' + T() + '^\\circ\\)'; }], {fixed: true, highlight: false, fontSize: 16});
    board.create('text', [4.7, 3.1, function () {
        return '\\(r = 6370 \\cos ' + T() + '^\\circ = ' + Math.round(6370 * Math.cos(th())) + '\\,\\text{km}\\)';
    }], {fixed: true, highlight: false, fontSize: 13});
    board.create('text', [4.7, 2.0, '\\(1^\\circ \\text{ of longitude here}\\)'], {fixed: true, highlight: false, fontSize: 13});
    board.create('text', [4.7, 1.2, function () {
        var v = Math.round(40040 / 360 * Math.cos(th()) * 10) / 10;
        return '\\(= 111.2 \\cos ' + T() + '^\\circ = ' + v.toFixed(1) + '\\,\\text{km}\\)';
    }], {fixed: true, highlight: false, fontSize: 13});
    board.create('text', [4.7, -2.4, '\\(R = 6370\\,\\text{km}\\)'], {fixed: true, highlight: false, fontSize: 14});
})();
