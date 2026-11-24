// Area under a curve (G12 Ch18, sec-area-under-a-curve-by-integration).
// y = 6 + x - x^2, zero at x = -2 and x = 3. Points a and b slide on the x-axis in [-3, 4.5].
// Parts of the region above the axis are shaded and marked +; parts below are hatched and
// marked -. Live text: the integral F(b) - F(a) with F(x) = 6x + x^2/2 - x^3/3, and the area
// (sum of the sizes of the parts, split at -2 and 3), both to 2 d.p.
// Instruction check: with a = 2 the integral is 0 at b = 3.8807 (inside the range).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-area-under-a-curve', {
        boundingbox: [-3.7, 10.4, 5.0, -11.2],
        keepAspectRatio: false,
        axis: true,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    function f(x) { return 6 + x - x * x; }
    function F(x) { return 6 * x + x * x / 2 - x * x * x / 3; }

    var track = board.create('segment', [[-3, 0], [4.5, 0]], {visible: false, fixed: true});
    var A = board.create('glider', [0, 0, track], {name: 'a', size: 5, fillColor: '#000000', strokeColor: '#000000', label: {useMathJax: false, offset: [-4, 14]}});
    var B = board.create('glider', [3, 0, track], {name: 'b', size: 5, fillColor: '#ffffff', strokeColor: '#000000', label: {useMathJax: false, offset: [-4, 14]}});

    function lohi() { return [Math.min(A.X(), B.X()), Math.max(A.X(), B.X())]; }

    // shaded positive part
    var pos = board.create('curve', [[], []], {fillColor: '#999999', fillOpacity: 0.45, strokeWidth: 0, highlight: false});
    pos.updateDataArray = function () {
        var r = lohi(), lo = Math.max(r[0], -2), hi = Math.min(r[1], 3), k, x, n = 80;
        this.dataX = []; this.dataY = [];
        if (hi <= lo) { return; }
        this.dataX.push(lo); this.dataY.push(0);
        for (k = 0; k <= n; k++) { x = lo + (hi - lo) * k / n; this.dataX.push(x); this.dataY.push(f(x)); }
        this.dataX.push(hi); this.dataY.push(0);
    };
    // hatched negative parts: vertical strokes every 0.08
    var neg = board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 1, highlight: false});
    neg.updateDataArray = function () {
        var r = lohi(), x;
        this.dataX = []; this.dataY = [];
        for (x = Math.ceil(r[0] / 0.08) * 0.08; x <= r[1]; x += 0.08) {
            if (f(x) < 0) { this.dataX.push(x, x, NaN); this.dataY.push(0, f(x), NaN); }
        }
    };
    board.create('functiongraph', [f, -3.7, 5.0], {strokeColor: '#000000', strokeWidth: 3, fixed: true, highlight: false});
    board.create('text', [0.4, -3.2, 'y = 6 + x − x²'], {fixed: true, highlight: false, useMathJax: false});

    // + and - labels at the middle of each part wider than 0.3
    function piece(k) {
        var r = lohi(), cuts = [r[0]], out = [], i;
        if (r[0] < -2 && r[1] > -2) { cuts.push(-2); }
        if (r[0] < 3 && r[1] > 3) { cuts.push(3); }
        cuts.push(r[1]);
        for (i = 0; i + 1 < cuts.length; i++) { out.push([cuts[i], cuts[i + 1]]); }
        return out[k];
    }
    var labs = [];
    for (var k = 0; k < 3; k++) {
        (function (k) {
            labs.push(board.create('text', [
                function () { var p = piece(k); return p ? (p[0] + p[1]) / 2 - 0.08 : 0; },
                function () { var p = piece(k); return p ? f((p[0] + p[1]) / 2) / 2 : 0; },
                function () { var p = piece(k); if (!p || p[1] - p[0] < 0.3) { return ''; } return f((p[0] + p[1]) / 2) >= 0 ? '+' : '−'; }
            ], {fixed: true, highlight: false, useMathJax: false, fontSize: 20, strokeColor: '#000000', cssStyle: 'background:#ffffff;'}));
        })(k);
    }

    function area() {
        var r = lohi(), cuts = [r[0]], s = 0, i;
        if (r[0] < -2 && r[1] > -2) { cuts.push(-2); }
        if (r[0] < 3 && r[1] > 3) { cuts.push(3); }
        cuts.push(r[1]);
        for (i = 0; i + 1 < cuts.length; i++) { s += Math.abs(F(cuts[i + 1]) - F(cuts[i])); }
        return s;
    }
    function fix(v) { var s = v.toFixed(2); return (s === '-0.00') ? '0.00' : s; }
    board.create('text', [0.3, 9.7, function () {
        return 'a = ' + fix(A.X()) + ',  b = ' + fix(B.X());
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [0.3, 8.7, function () {
        return 'integral F(b) − F(a) = ' + fix(F(B.X()) - F(A.X()));
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [0.3, 7.7, function () {
        return 'area (curve to x-axis) = ' + fix(area());
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
})();
