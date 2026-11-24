// Rectangles at the mid-ordinates under y = x^2 + 2x + 3 (G12 Ch7, sec-mid-ordinate-rule, lesson 3.1).
// Slider n from 1 to 12 strips on 0 <= x <= 4. Each strip is replaced by a rectangle whose height
// is the curve's height at the middle of the strip (dashed mid-ordinate). The box "show trapezia"
// draws the trapezia as well. Text gives M, T and the exact area 49.33 (148/3). Curve changed at review from y = x^2 + 1 (also an SMP C2 exercise curve).
// Instruction check: n = 1 gives M 44, T 60; n = 4 gives 49, 50; n = 12 gives 49.30, 49.41.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-mid-ordinate-rectangles', {
        boundingbox: [-0.8, 40, 4.8, -4],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var A = 0, B = 4;
    board.create('axis', [[0, 0], [1, 0]], {ticks: {insertTicks: false, ticksDistance: 1, minorTicks: 0, drawLabels: true, label: {useMathJax: false}}});
    board.create('axis', [[0, 0], [0, 1]], {ticks: {insertTicks: false, ticksDistance: 10, minorTicks: 0, drawLabels: true, label: {useMathJax: false}}});

    var n = board.create('slider', [[0.3, 37.5], [2.6, 37.5], [1, 4, 12]], {
        name: 'n', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}
    });
    var showT = board.create('checkbox', [0.5, 23.6, 'show trapezia'], {fixed: true, useMathJax: false});

    function f(x) { return x * x + 2 * x + 3; }
    function N() { return Math.round(n.Value()); }
    function trap() {
        var k, h = (B - A) / N(), s = (f(A) + f(B)) / 2;
        for (k = 1; k < N(); k++) { s += f(A + k * h); }
        return h * s;
    }
    function mid() {
        var k, h = (B - A) / N(), s = 0;
        for (k = 0; k < N(); k++) { s += f(A + (k + 0.5) * h); }
        return h * s;
    }

    // rectangles: one step polygon, plus the inner sides
    var mr = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 2, fillColor: '#888888', fillOpacity: 0.35, highlight: false});
    mr.updateDataArray = function () {
        var k, h = (B - A) / N(), m;
        this.dataX = [A]; this.dataY = [0];
        for (k = 0; k < N(); k++) {
            m = f(A + (k + 0.5) * h);
            this.dataX.push(A + k * h, A + (k + 1) * h); this.dataY.push(m, m);
        }
        this.dataX.push(B, A); this.dataY.push(0, 0);
    };
    var mrSides = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 1, highlight: false});
    mrSides.updateDataArray = function () {
        var k, h = (B - A) / N();
        this.dataX = []; this.dataY = [];
        for (k = 1; k < N(); k++) {
            this.dataX.push(A + k * h, A + k * h, NaN);
            this.dataY.push(0, Math.max(f(A + (k - 0.5) * h), f(A + (k + 0.5) * h)), NaN);
        }
    };
    // dashed mid-ordinates
    var mids = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 1, dash: 2, highlight: false});
    mids.updateDataArray = function () {
        var k, h = (B - A) / N(), x;
        this.dataX = []; this.dataY = [];
        for (k = 0; k < N(); k++) { x = A + (k + 0.5) * h; this.dataX.push(x, x, NaN); this.dataY.push(0, f(x), NaN); }
    };
    // trapezia tops, drawn only when the box is ticked (thick dashed line)
    var tz = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 3, dash: 3, highlight: false});
    tz.updateDataArray = function () {
        var k, h = (B - A) / N();
        this.dataX = []; this.dataY = [];
        if (!showT.Value()) { return; }
        for (k = 0; k <= N(); k++) { this.dataX.push(A + k * h); this.dataY.push(f(A + k * h)); }
        for (k = N() - 1; k >= 1; k--) { this.dataX.push(NaN, A + k * h, A + k * h); this.dataY.push(NaN, 0, f(A + k * h)); }
    };
    board.create('functiongraph', [f, 0, 4.2], {strokeColor: '#000000', strokeWidth: 3, fixed: true, highlight: false});
    board.create('text', [2.95, 35, 'y = x² + 2x + 3'], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});

    function fmt(v) { return (Math.round(v * 100) / 100).toString(); }
    board.create('text', [0.5, 34.2, function () { return 'strips: n = ' + N() + ',  h = ' + fmt((B - A) / N()); }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [0.5, 31.7, function () { return 'mid-ordinate estimate M = ' + fmt(mid()); }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [0.5, 29.2, 'exact area = 49.33'], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [0.5, 26.7, function () { return showT.Value() ? 'trapezoidal estimate T = ' + fmt(trap()) : ''; }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
})();
