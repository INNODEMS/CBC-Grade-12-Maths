// Velocity, area and position (G12 Ch18, sec-kinematics, lesson 6.2).
// v = 3t^2 - 12t + 9 on [0, 4] (rest at t = 1 and 3). Slider t shades the area from 0 to t, marked
// + above the axis and - below it (lighter, dashed edge). A dot on a number line above the graph
// shows the position s(t) = t^3 - 6t^2 + 9t. Text gives the displacement and the distance travelled
// (the total area): t = 3 gives displacement 0 and distance 8; t = 4 gives 4 and 12.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-velocity-time-area', {
        boundingbox: [-0.8, 16, 4.8, -6.4],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    function v(t) { return 3 * t * t - 12 * t + 9; }
    function s(t) { return t * t * t - 6 * t * t + 9 * t; }
    function dist(t) {
        if (t <= 1) { return s(t); }
        if (t <= 3) { return 8 - s(t); }
        return 8 + s(t);
    }
    var ts = {fixed: true, useMathJax: false, highlight: false};

    // v-t axes
    board.create('axis', [[0, 0], [1, 0]], {ticks: {insertTicks: false, ticksDistance: 1, minorTicks: 0, label: {useMathJax: false}}});
    board.create('axis', [[0, 0], [0, 1]], {ticks: {insertTicks: false, ticksDistance: 3, minorTicks: 0, label: {useMathJax: false}}});
    board.create('text', [4.4, -0.8, 't (s)'], ts);
    board.create('text', [0.1, 10.2, 'v (m/s)'], ts);

    var T = board.create('slider', [[0.6, -5.2], [3.6, -5.2], [0, 0.5, 4]], {
        name: 't', snapWidth: 0.05, precision: 2, withTicks: false, label: {useMathJax: false}
    });

    function region(sign) {
        var c = board.create('curve', [[], []], sign > 0
            ? {strokeWidth: 0, fillColor: '#1f4e9c', fillOpacity: 0.35, highlight: false}
            : {strokeColor: '#7a4a00', strokeWidth: 1, dash: 2, fillColor: '#7a4a00', fillOpacity: 0.15, highlight: false});
        c.updateDataArray = function () {
            var k, x, y, tt = T.Value(), m = 120;
            this.dataX = [0]; this.dataY = [0];
            for (k = 0; k <= m; k++) {
                x = tt * k / m; y = v(x);
                this.dataX.push(x); this.dataY.push(sign > 0 ? Math.max(y, 0) : Math.min(y, 0));
            }
            this.dataX.push(tt, 0); this.dataY.push(0, 0);
        };
        return c;
    }
    region(1); region(-1);
    board.create('functiongraph', [v, 0, 4], {strokeColor: '#000000', strokeWidth: 3, highlight: false});
    board.create('point', [function () { return T.Value(); }, function () { return v(T.Value()); }], {name: '', size: 3, fixed: true, strokeColor: '#000000', fillColor: '#000000', showInfobox: false});

    // + and - marks, shown once the shading reaches them
    board.create('text', [0.3, 2.2, function () { return T.Value() > 0.4 ? '+' : ''; }], {fixed: true, useMathJax: false, fontSize: 22, highlight: false});
    board.create('text', [1.9, -1.4, function () { return T.Value() > 2.1 ? '−' : ''; }], {fixed: true, useMathJax: false, fontSize: 22, highlight: false});
    board.create('text', [3.65, 1.8, function () { return T.Value() > 3.8 ? '+' : ''; }], {fixed: true, useMathJax: false, fontSize: 22, highlight: false});

    // number line for the position s, above the graph
    var yl = 13.3;
    board.create('segment', [[0, yl], [4.2, yl]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    var i;
    for (i = 0; i <= 4; i++) {
        board.create('segment', [[i, yl - 0.3], [i, yl + 0.3]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false});
        board.create('text', [i, yl - 0.9, String(i)], {anchorX: 'middle', fixed: true, useMathJax: false, highlight: false});
    }
    board.create('text', [2.3, yl + 1.2, 'position s (m)'], ts);
    board.create('point', [function () { return s(T.Value()); }, yl], {name: '', size: 6, fixed: true, strokeColor: '#000000', fillColor: '#ffffff', strokeWidth: 2, showInfobox: false});

    // live values
    board.create('text', [1.25, 10.6, function () { return 't = ' + T.Value().toFixed(2) + ' s,  v = ' + v(T.Value()).toFixed(2) + ' m/s'; }], {fixed: true, useMathJax: false, fontSize: 14, highlight: false});
    board.create('text', [1.25, 9.4, function () { return 'displacement s = ' + s(T.Value()).toFixed(2) + ' m'; }], {fixed: true, useMathJax: false, fontSize: 14, highlight: false});
    board.create('text', [1.25, 8.2, function () { return 'distance travelled = ' + dist(T.Value()).toFixed(2) + ' m'; }], {fixed: true, useMathJax: false, fontSize: 14, highlight: false});
    board.update();
})();
