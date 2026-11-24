// Trapezia under y = x^2 + 2x + 3 (G12 Ch7, sec-trapezoidal-rule, lesson 2.1).
// Slider n from 1 to 12 strips on 0 <= x <= 4. The trapezia are shaded with their straight tops
// drawn; the text gives h, the trapezoidal estimate T and the exact area 49.33 (148/3). Curve changed at review from y = x^2 + 1 (also an SMP C2 exercise curve).
// Instruction check: n = 1 gives 60, 2 gives 52, 4 gives 50, 8 gives 49.5, 12 gives 49.41.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-trapezoidal-strips', {
        boundingbox: [-0.8, 40, 4.8, -4],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var A = 0, B = 4, EXACT = 148 / 3;
    board.create('axis', [[0, 0], [1, 0]], {ticks: {insertTicks: false, ticksDistance: 1, minorTicks: 0, drawLabels: true, label: {useMathJax: false}}});
    board.create('axis', [[0, 0], [0, 1]], {ticks: {insertTicks: false, ticksDistance: 10, minorTicks: 0, drawLabels: true, label: {useMathJax: false}}});

    var n = board.create('slider', [[0.3, 37.5], [2.6, 37.5], [1, 4, 12]], {
        name: 'n', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}
    });

    function f(x) { return x * x + 2 * x + 3; }
    function N() { return Math.round(n.Value()); }
    function trap() {
        var k, h = (B - A) / N(), s = (f(A) + f(B)) / 2;
        for (k = 1; k < N(); k++) { s += f(A + k * h); }
        return h * s;
    }

    // trapezia: one polygon along the chords
    var tz = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 2, fillColor: '#888888', fillOpacity: 0.35, highlight: false});
    tz.updateDataArray = function () {
        var k, h = (B - A) / N();
        this.dataX = [A]; this.dataY = [0];
        for (k = 0; k <= N(); k++) { this.dataX.push(A + k * h); this.dataY.push(f(A + k * h)); }
        this.dataX.push(B, A); this.dataY.push(0, 0);
    };
    // the vertical sides (the ordinates)
    var sides = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 1, highlight: false});
    sides.updateDataArray = function () {
        var k, h = (B - A) / N();
        this.dataX = []; this.dataY = [];
        for (k = 1; k < N(); k++) { this.dataX.push(A + k * h, A + k * h, NaN); this.dataY.push(0, f(A + k * h), NaN); }
    };
    board.create('functiongraph', [f, 0, 4.2], {strokeColor: '#000000', strokeWidth: 3, dash: 2, fixed: true, highlight: false});
    board.create('text', [2.95, 35, 'y = x² + 2x + 3'], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});

    function fmt(v) { return (Math.round(v * 100) / 100).toString(); }
    board.create('text', [0.5, 34.2, function () { return 'strips: n = ' + N() + ',  h = ' + fmt((B - A) / N()); }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [0.5, 31.7, function () { return 'trapezoidal estimate T = ' + fmt(trap()); }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [0.5, 29.2, 'exact area = 49.33'], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [0.5, 26.7, function () { return 'T − exact = ' + fmt(trap() - EXACT); }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
})();
