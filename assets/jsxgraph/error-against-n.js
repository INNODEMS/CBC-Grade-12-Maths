// Percentage error against number of strips (G12 Ch18, sec-errors-in-area-approximation).
// y = x^3 on [0, 2], exact area 4 (Akinyi and Baraka). For n = 1 to 12 the percentage errors of the
// trapezoidal rule (crosses) and the mid-ordinate rule (circles) are plotted; the slider n rings the
// current pair and the text gives T, M, the exact value and both errors. The percentages are
// 100/n^2 and 50/n^2, so doubling n divides them by 4.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-error-against-n', {
        boundingbox: [-1.6, 118, 13.2, -14],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var A = 0, B = 2, EXACT = 4;
    function f(x) { return x * x * x; }
    function trap(n) {
        var k, h = (B - A) / n, s = (f(A) + f(B)) / 2;
        for (k = 1; k < n; k++) { s += f(A + k * h); }
        return h * s;
    }
    function mid(n) {
        var k, h = (B - A) / n, s = 0;
        for (k = 0; k < n; k++) { s += f(A + (k + 0.5) * h); }
        return h * s;
    }
    function pc(v) { return Math.abs(v - EXACT) / EXACT * 100; }

    board.create('axis', [[0, 0], [1, 0]], {ticks: {insertTicks: false, ticksDistance: 1, minorTicks: 0, label: {useMathJax: false}}});
    board.create('axis', [[0, 0], [0, 1]], {ticks: {insertTicks: false, ticksDistance: 20, minorTicks: 1, label: {useMathJax: false}}});
    board.create('text', [12.4, -8, 'n'], {fixed: true, useMathJax: false, highlight: false});
    board.create('text', [0.2, 112, 'percentage error (%)'], {fixed: true, useMathJax: false, highlight: false});

    var k;
    for (k = 1; k <= 12; k++) {
        board.create('point', [k, pc(trap(k))], {name: '', face: 'x', size: 5, fixed: true, strokeColor: '#1f4e9c', showInfobox: false});
        board.create('point', [k, pc(mid(k))], {name: '', face: 'o', size: 4, fixed: true, strokeColor: '#7a4a00', fillColor: '#ffffff', showInfobox: false});
    }

    var n = board.create('slider', [[2, -10], [8, -10], [1, 2, 12]], {
        name: 'n', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}
    });
    function N() { return Math.round(n.Value()); }

    // ring round the current pair
    board.create('point', [function () { return N(); }, function () { return pc(trap(N())); }], {name: '', face: 'o', size: 10, fixed: true, strokeColor: '#000000', strokeWidth: 2, fillOpacity: 0, showInfobox: false, highlight: false});
    board.create('point', [function () { return N(); }, function () { return pc(mid(N())); }], {name: '', face: 'o', size: 10, fixed: true, strokeColor: '#000000', strokeWidth: 2, fillOpacity: 0, showInfobox: false, highlight: false});

    var tx = 4.5, ts = {fixed: true, useMathJax: false, fontSize: 14, highlight: false};
    board.create('text', [tx, 100, 'y = x³ from x = 0 to 2, exact area 4'], ts);
    board.create('text', [tx, 92, 'crosses: trapezoidal rule; circles: mid-ordinate rule'], ts);
    board.create('text', [tx, 82, function () { return 'n = ' + N() + ':  T = ' + trap(N()).toFixed(5) + ',  M = ' + mid(N()).toFixed(5); }], ts);
    board.create('text', [tx, 74, function () { return 'error of T = ' + (trap(N()) - EXACT).toFixed(5) + '  (' + pc(trap(N())).toFixed(3) + '%)'; }], ts);
    board.create('text', [tx, 66, function () { return 'error of M = ' + (mid(N()) - EXACT).toFixed(5) + '  (' + pc(mid(N())).toFixed(3) + '%)'; }], ts);
    board.update();
})();
