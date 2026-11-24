// Trapezia, mid-ordinate rectangles and the exact area (G12 Ch18, sec-integration-trapezoidal-and-mid-ordinate-rules).
// Curve y = x^2 + 3 on [0, 4] (the Machakos plot, bends upwards); the box "bends downwards"
// switches to y = 19 - x^2 (same end heights 19 and 3). Slider n from 1 to 10 strips; boxes show
// the trapezia, the mid-ordinate rectangles and the exact region. Text gives T, M and the exact area.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-trapezoidal-mid-ordinate-exact', {
        boundingbox: [-0.9, 26, 6.6, -2.6],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var A = 0, B = 4;
    var xax = board.create('axis', [[0, 0], [1, 0]], {ticks: {insertTicks: false, ticksDistance: 1, minorTicks: 0, drawLabels: true, label: {useMathJax: false}}});
    var yax = board.create('axis', [[0, 0], [0, 1]], {ticks: {insertTicks: false, ticksDistance: 5, minorTicks: 0, drawLabels: true, label: {useMathJax: false}}});

    var n = board.create('slider', [[0.3, 24.5], [3.3, 24.5], [1, 4, 10]], {
        name: 'n', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}
    });
    var down = board.create('checkbox', [4.3, 24.5, 'bends downwards'], {fixed: true, useMathJax: false});
    var showT = board.create('checkbox', [4.3, 22.8, 'trapezia'], {fixed: true, useMathJax: false, checked: true});
    var showM = board.create('checkbox', [4.3, 21.1, 'mid-ordinate rectangles'], {fixed: true, useMathJax: false});
    var showE = board.create('checkbox', [4.3, 19.4, 'exact region'], {fixed: true, useMathJax: false});

    function f(x) { return down.Value() ? 19 - x * x : x * x + 3; }
    function F(x) { return down.Value() ? 19 * x - x * x * x / 3 : x * x * x / 3 + 3 * x; }
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

    // exact region under the curve
    var exact = board.create('curve', [[], []], {fillColor: '#888888', fillOpacity: 0.35, strokeWidth: 0, highlight: false});
    exact.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        if (!showE.Value()) { return; }
        var k, x;
        this.dataX.push(A); this.dataY.push(0);
        for (k = 0; k <= 80; k++) { x = A + (B - A) * k / 80; this.dataX.push(x); this.dataY.push(f(x)); }
        this.dataX.push(B); this.dataY.push(0); this.dataX.push(A); this.dataY.push(0);
    };

    // trapezia: one polygon along the chords, plus the vertical sides
    var tz = board.create('curve', [[], []], {strokeColor: '#1f4e9c', strokeWidth: 2, fillColor: '#1f4e9c', fillOpacity: 0.15, highlight: false});
    tz.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        if (!showT.Value()) { return; }
        var k, h = (B - A) / N();
        this.dataX.push(A); this.dataY.push(0);
        for (k = 0; k <= N(); k++) { this.dataX.push(A + k * h); this.dataY.push(f(A + k * h)); }
        this.dataX.push(B); this.dataY.push(0); this.dataX.push(A); this.dataY.push(0);
    };
    var tzSides = board.create('curve', [[], []], {strokeColor: '#1f4e9c', strokeWidth: 1, highlight: false});
    tzSides.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        if (!showT.Value()) { return; }
        var k, h = (B - A) / N();
        for (k = 1; k < N(); k++) { this.dataX.push(A + k * h, A + k * h, NaN); this.dataY.push(0, f(A + k * h), NaN); }
    };

    // mid-ordinate rectangles: one step polygon, plus the inner sides (dashed)
    var mr = board.create('curve', [[], []], {strokeColor: '#7a4a00', strokeWidth: 2, dash: 2, fillColor: '#7a4a00', fillOpacity: 0.12, highlight: false});
    mr.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        if (!showM.Value()) { return; }
        var k, h = (B - A) / N(), m;
        this.dataX.push(A); this.dataY.push(0);
        for (k = 0; k < N(); k++) {
            m = f(A + (k + 0.5) * h);
            this.dataX.push(A + k * h, A + (k + 1) * h); this.dataY.push(m, m);
        }
        this.dataX.push(B, A); this.dataY.push(0, 0);
    };
    var mrSides = board.create('curve', [[], []], {strokeColor: '#7a4a00', strokeWidth: 1, dash: 2, highlight: false});
    mrSides.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        if (!showM.Value()) { return; }
        var k, h = (B - A) / N();
        for (k = 1; k < N(); k++) { this.dataX.push(A + k * h, A + k * h, NaN); this.dataY.push(0, Math.max(f(A + (k - 0.5) * h), f(A + (k + 0.5) * h)), NaN); }
    };

    board.create('functiongraph', [function (x) { return f(x); }, A, B], {strokeColor: '#000000', strokeWidth: 3, highlight: false});

    var tx = 4.3;
    board.create('text', [tx, 15.5, function () { return 'curve: y = ' + (down.Value() ? '19 - x²' : 'x² + 3'); }], {fixed: true, useMathJax: false, fontSize: 14, highlight: false});
    board.create('text', [tx, 13.8, function () { return 'trapezoidal T = ' + trap().toFixed(4); }], {fixed: true, useMathJax: false, fontSize: 14, highlight: false});
    board.create('text', [tx, 12.1, function () { return 'mid-ordinate M = ' + mid().toFixed(4); }], {fixed: true, useMathJax: false, fontSize: 14, highlight: false});
    board.create('text', [tx, 10.4, function () { return 'exact = ' + (F(B) - F(A)).toFixed(4); }], {fixed: true, useMathJax: false, fontSize: 14, highlight: false});
    board.create('text', [6.3, -1.3, 'x'], {fixed: true, useMathJax: false, highlight: false});
    board.update();
})();
