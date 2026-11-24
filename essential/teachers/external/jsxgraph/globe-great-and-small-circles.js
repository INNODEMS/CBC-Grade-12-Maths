// Great and small circles (G12 Ch13, sec-longitudes-and-latitudes, lesson 1.1).
// A wire globe of radius 1 (equator, six great circles through the poles at 30 degree steps,
// parallels at 30 and 60 degrees N and S). The h slider moves a horizontal cutting plane;
// the circle where it cuts the sphere is drawn thick, with radius r = sqrt(1 - h^2).
// The view's own sliders (horizontal: turn; vertical: tilt) rotate the globe.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-globe-great-and-small-circles', {
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
    var view = board.create('view3d', [[-6.2, -4.6], [8.2, 9.4], [[-1.2, 1.2], [-1.2, 1.2], [-1.2, 1.2]]], {
        xAxis: off, yAxis: off, zAxis: off,
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        az: {slider: {visible: true, withLabel: false, start: 0.6}},
        el: {slider: {visible: true, withLabel: false, start: 0.35}},
        bank: {slider: {visible: false}}
    });
    var thin = {strokeColor: '#9a9a9a', strokeWidth: 1, highlight: false};
    var k, lat;
    // meridian pairs (each a great circle through both poles)
    for (k = 0; k < 6; k++) {
        (function (a) {
            view.create('curve3d', [
                function (t) { return Math.cos(t) * Math.cos(a); },
                function (t) { return Math.cos(t) * Math.sin(a); },
                function (t) { return Math.sin(t); },
                [0, 2 * Math.PI]], thin);
        })(k * Math.PI / 6);
    }
    // parallels at 30 and 60 degrees N and S
    [-60, -30, 30, 60].forEach(function (d) {
        lat = d * Math.PI / 180;
        (function (c, s) {
            view.create('curve3d', [
                function (t) { return c * Math.cos(t); },
                function (t) { return c * Math.sin(t); },
                function () { return s; },
                [0, 2 * Math.PI]], thin);
        })(Math.cos(lat), Math.sin(lat));
    });
    // equator
    view.create('curve3d', [
        function (t) { return Math.cos(t); },
        function (t) { return Math.sin(t); },
        function () { return 0; },
        [0, 2 * Math.PI]], {strokeColor: '#555555', strokeWidth: 1.5, dash: 2, highlight: false});
    // axis through the poles and the centre
    view.create('line3d', [[0, 0, -1.15], [0, 0, 1.15]], {strokeColor: '#555555', strokeWidth: 1, highlight: false});
    var lab = {size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, fontSize: 14}};
    view.create('point3d', [0, 0, 1], JXG.merge(lab, {name: 'N', label: {offset: [6, 8], useMathJax: false, fontSize: 14}}));
    view.create('point3d', [0, 0, -1], JXG.merge(lab, {name: 'S', label: {offset: [6, -10], useMathJax: false, fontSize: 14}}));
    view.create('point3d', [0, 0, 0], JXG.merge(lab, {name: 'O', label: {offset: [-16, -4], useMathJax: false, fontSize: 14}}));

    var sh = board.create('slider', [[3.2, 6.8], [6.0, 6.8], [-0.95, 0, 0.95]], {name: 'h', snapWidth: 0.05, precision: 2, withTicks: false});
    function H() { return Math.round(sh.Value() * 100) / 100; }
    function Rr() { return Math.sqrt(1 - H() * H()); }
    // the cutting circle (thick) and the edge of the cutting plane (dashed square)
    view.create('curve3d', [
        function (t) { return Rr() * Math.cos(t); },
        function (t) { return Rr() * Math.sin(t); },
        function () { return H(); },
        [0, 2 * Math.PI]], {strokeColor: '#1f4e9c', strokeWidth: 3.5, highlight: false});
    var sq = {strokeColor: '#1f4e9c', strokeWidth: 1, dash: 3, highlight: false, straightFirst: false, straightLast: false};
    var cs = [[-1.05, -1.05], [1.05, -1.05], [1.05, 1.05], [-1.05, 1.05]];
    for (k = 0; k < 4; k++) {
        (function (a, b) {
            view.create('line3d', [[a[0], a[1], H], [b[0], b[1], H]], sq);
        })(cs[k], cs[(k + 1) % 4]);
    }
    // radius of the cut: from the centre of the cut to its edge, and O to the edge
    var C = view.create('point3d', [0, 0, H], {name: '', size: 2, fixed: true, highlight: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c'});
    var E = view.create('point3d', [function () { return Rr(); }, 0, H], {name: '', size: 2, fixed: true, highlight: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c'});
    view.create('line3d', [C, E], {strokeColor: '#1f4e9c', strokeWidth: 2, highlight: false});
    view.create('line3d', [[0, 0, 0], E], {strokeColor: '#000000', strokeWidth: 1.5, dash: 2, highlight: false});

    board.create('text', [3.2, 5.4, function () {
        return '\\(r = \\sqrt{1 - h^2} = ' + Rr().toFixed(2) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 14});
    board.create('text', [3.2, 4.2, function () {
        return '\\(\\text{Earth: } r = ' + Math.round(6370 * Rr()) + '\\,\\text{km}\\)';
    }], {fixed: true, highlight: false, fontSize: 14});
    board.create('text', [3.2, 3.0, function () {
        return H() === 0 ? '\\(\\text{a great circle}\\)' : '\\(\\text{a small circle}\\)';
    }], {fixed: true, highlight: false, fontSize: 16});
    board.create('text', [3.2, 1.8, '\\(\\text{Sphere radius } 1\\)'],
        {fixed: true, highlight: false, fontSize: 13});
})();
