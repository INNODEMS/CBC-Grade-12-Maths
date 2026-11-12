// Latitude and longitude on a globe (G12 Ch13, sec-longitudes-and-latitudes, lesson 1.2).
// A wire globe of radius 1. The latitude and longitude sliders (whole degrees) place P;
// its meridian and parallel are drawn thick, with the radius OP, the latitude angle in P's
// meridian plane and the longitude angle in the equatorial plane. The Greenwich meridian is
// dashed. A fixed point marks Nairobi (taken as 1 degree S, 37 degrees E).
// Sliders, not a draggable point: in JSXGraph 1.8.0 a point3d drags only within a plane.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-globe-latitude-longitude', {
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
    var D = Math.PI / 180;
    var view = board.create('view3d', [[-6.2, -4.6], [8.2, 9.4], [[-1.2, 1.2], [-1.2, 1.2], [-1.2, 1.2]]], {
        xAxis: off, yAxis: off, zAxis: off,
        xPlaneRear: off, yPlaneRear: off, zPlaneRear: off,
        xPlaneFront: off, yPlaneFront: off, zPlaneFront: off,
        az: {slider: {visible: true, withLabel: false, start: 0.1}},
        el: {slider: {visible: true, withLabel: false, start: 0.3}},
        bank: {slider: {visible: false}}
    });
    var thin = {strokeColor: '#a0a0a0', strokeWidth: 1, highlight: false};
    function sph(la, lo) { return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)]; }
    var k;
    for (k = 1; k < 12; k++) {
        if (k === 6) { continue; }
        (function (a) {
            view.create('curve3d', [
                function (t) { return Math.cos(t) * Math.cos(a); },
                function (t) { return Math.cos(t) * Math.sin(a); },
                function (t) { return Math.sin(t); },
                [-Math.PI / 2, Math.PI / 2]], thin);
        })(k * 30 * D);
    }
    [-60, -30, 30, 60].forEach(function (d) {
        (function (c, s) {
            view.create('curve3d', [
                function (t) { return c * Math.cos(t); },
                function (t) { return c * Math.sin(t); },
                function () { return s; },
                [0, 2 * Math.PI]], thin);
        })(Math.cos(d * D), Math.sin(d * D));
    });
    // equator and Greenwich meridian
    view.create('curve3d', [function (t) { return Math.cos(t); }, function (t) { return Math.sin(t); }, function () { return 0; }, [0, 2 * Math.PI]],
        {strokeColor: '#555555', strokeWidth: 1.5, highlight: false});
    view.create('curve3d', [function (t) { return Math.cos(t); }, function () { return 0; }, function (t) { return Math.sin(t); }, [-Math.PI / 2, Math.PI / 2]],
        {strokeColor: '#000000', strokeWidth: 1.5, dash: 2, highlight: false});
    view.create('curve3d', [function (t) { return -Math.cos(t); }, function () { return 0; }, function (t) { return Math.sin(t); }, [-Math.PI / 2, Math.PI / 2]], thin);
    view.create('line3d', [[0, 0, -1.15], [0, 0, 1.15]], {strokeColor: '#555555', strokeWidth: 1, highlight: false});
    var lab = {size: 2, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000'};
    view.create('point3d', [0, 0, 1], JXG.merge(lab, {name: 'N', label: {offset: [6, 8], useMathJax: false, fontSize: 14}}));
    view.create('point3d', [0, 0, -1], JXG.merge(lab, {name: 'S', label: {offset: [6, -10], useMathJax: false, fontSize: 14}}));
    view.create('point3d', [0, 0, 0], JXG.merge(lab, {name: 'O', label: {offset: [-16, -4], useMathJax: false, fontSize: 14}}));
    view.create('point3d', [1, 0, 0], JXG.merge(lab, {size: 1, name: '0°', label: {offset: [4, -12], useMathJax: false, fontSize: 12}}));
    var nb = sph(-1 * D, 37 * D);
    view.create('point3d', nb, {name: 'Nairobi', size: 3, fixed: true, highlight: false, face: 'x', strokeColor: '#000000', fillColor: '#000000', label: {offset: [6, -12], useMathJax: false, fontSize: 12}});

    var sla = board.create('slider', [[1.6, 6.8], [4.4, 6.8], [-90, 3, 90]], {name: 'latitude', snapWidth: 1, precision: 0, withTicks: false});
    var slo = board.create('slider', [[1.6, 5.8], [4.4, 5.8], [-180, 36, 180]], {name: 'longitude', snapWidth: 1, precision: 0, withTicks: false});
    function LA() { return Math.round(sla.Value()); }
    function LO() { return Math.round(slo.Value()); }
    function la() { return LA() * D; }
    function lo() { return LO() * D; }
    var blue = {strokeColor: '#1f4e9c', strokeWidth: 3, highlight: false};
    // P's meridian and parallel
    view.create('curve3d', [
        function (t) { return Math.cos(t) * Math.cos(lo()); },
        function (t) { return Math.cos(t) * Math.sin(lo()); },
        function (t) { return Math.sin(t); },
        [-Math.PI / 2, Math.PI / 2]], blue);
    view.create('curve3d', [
        function (t) { return Math.cos(la()) * Math.cos(t); },
        function (t) { return Math.cos(la()) * Math.sin(t); },
        function () { return Math.sin(la()); },
        [0, 2 * Math.PI]], JXG.merge(blue, {strokeWidth: 2, dash: 1}));
    var P = view.create('point3d', [
        function () { return sph(la(), lo())[0]; },
        function () { return sph(la(), lo())[1]; },
        function () { return sph(la(), lo())[2]; }],
        {name: 'P', size: 4, fixed: true, highlight: false, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [8, 6]}});
    var Q = view.create('point3d', [function () { return Math.cos(lo()); }, function () { return Math.sin(lo()); }, 0], {visible: false});
    view.create('line3d', [[0, 0, 0], P], {strokeColor: '#1f4e9c', strokeWidth: 2, highlight: false});
    var dsh = {strokeColor: '#000000', strokeWidth: 1.2, dash: 2, highlight: false};
    view.create('line3d', [[0, 0, 0], Q], dsh);
    view.create('line3d', [[0, 0, 0], [1, 0, 0]], dsh);
    // latitude angle (in P's meridian plane) and longitude angle (in the equatorial plane), radius 0.35
    view.create('curve3d', [
        function (t) { return 0.35 * Math.cos(t * la()) * Math.cos(lo()); },
        function (t) { return 0.35 * Math.cos(t * la()) * Math.sin(lo()); },
        function (t) { return 0.35 * Math.sin(t * la()); },
        [0, 1]], {strokeColor: '#b03000', strokeWidth: 2.5, highlight: false});
    view.create('curve3d', [
        function (t) { return 0.25 * Math.cos(t * lo()); },
        function (t) { return 0.25 * Math.sin(t * lo()); },
        function () { return 0; },
        [0, 1]], {strokeColor: '#000000', strokeWidth: 2.5, highlight: false});

    function deg(v, pos, neg) {
        if (v === 0) { return '0^\\circ'; }
        return Math.abs(v) + '^\\circ\\,\\text{' + (v > 0 ? pos : neg) + '}';
    }
    board.create('text', [2.0, 4.5, function () {
        var lon = LO();
        var lonTxt = (Math.abs(lon) === 180) ? '180^\\circ' : deg(lon, 'E', 'W');
        return '\\(P(' + deg(LA(), 'N', 'S') + ',\\ ' + lonTxt + ')\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [2.0, 3.2, '\\(\\text{arc on OP: latitude}\\)'], {fixed: true, highlight: false, fontSize: 12});
    board.create('text', [2.0, 2.3, '\\(\\text{arc at O: longitude}\\)'], {fixed: true, highlight: false, fontSize: 12});
    board.create('text', [2.0, 1.4, '\\(\\text{dashed meridian:}\\)'], {fixed: true, highlight: false, fontSize: 12});
    board.create('text', [2.0, 0.6, '\\(\\text{Greenwich } (0^\\circ)\\)'], {fixed: true, highlight: false, fontSize: 12});
})();
