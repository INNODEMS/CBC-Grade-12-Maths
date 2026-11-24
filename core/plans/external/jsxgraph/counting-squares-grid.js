// Counting squares on grids of different sizes (G12 Ch7, sec-counting-squares, lesson 1.1).
// The leaf of act-tracing-a-leaf: 4.4 - g(x) <= y <= 4.4 + g(x), g(x) = 0.15(x - 1.1)(9.1 - x),
// 1.1 <= x <= 9.1 (cm); true area 2 * 0.15 * 8^3 / 6 = 25.6 cm^2.
// A slider (snapping) chooses the grid size 2, 1, 0.5 or 0.25 cm. Each square is classified by
// column integration (as squares.count_between in the plan's verify folder): full squares are
// shaded grey, part squares have a dotted outline and a light fill.
// Estimates (plan, verified): 2 cm F 1 P 12 -> 28; 1 cm F 14 P 23 -> 25.5;
// 0.5 cm F 78 P 50 -> 25.75; 0.25 cm F 361 P 102 -> 25.75.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-counting-squares-grid', {
        boundingbox: [-0.4, 8.6, 14.6, -2.65],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var W = 10, H = 8;                       // grid area 10 cm by 8 cm
    var SIZES = [2, 1, 0.5, 0.25];
    function g(x) { return 0.15 * (x - 1.1) * (9.1 - x); }
    function lo(x) { return (x < 1.1 || x > 9.1) ? NaN : 4.4 - g(x); }
    function hi(x) { return (x < 1.1 || x > 9.1) ? NaN : 4.4 + g(x); }

    var slider = board.create('slider', [[10.9, 6.6], [13.9, 6.6], [0, 1, 3]], {
        snapWidth: 1, withLabel: false, size: 6, fillColor: '#000000', strokeColor: '#000000',
        baseline: {strokeColor: '#555555'}, highline: {strokeColor: '#000000'}
    });
    board.create('text', [10.6, 7.6, 'grid size'], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('text', [10.7, 6.0, '2 cm'], {fixed: true, highlight: false, useMathJax: false, fontSize: 11});
    board.create('text', [13.2, 6.0, '0.25 cm'], {fixed: true, highlight: false, useMathJax: false, fontSize: 11});

    function size() { return SIZES[Math.round(slider.Value())]; }

    // Classification by columns: for each column, the full rows form one block and the part
    // rows form at most two blocks (below and above it), because each column of the leaf is
    // one interval of y.
    var state = {s: 0, F: 0, P: 0, cols: []};
    function classify() {
        var s = size(), M = 400, ncol = Math.round(W / s), nrow = Math.round(H / s);
        var F = 0, P = 0, cols = [], i, j, k, x, y0, cov, a, b;
        if (s === state.s) { return; }
        for (i = 0; i < ncol; i++) {
            var los = [], his = [], any = false;
            for (k = 0; k < M; k++) {
                x = (i + (k + 0.5) / M) * s;
                if (x >= 1.1 && x <= 9.1) { los.push(lo(x)); his.push(hi(x)); any = true; }
                else { los.push(null); his.push(null); }
            }
            var col = {full: [], part: []};
            if (any) {
                for (j = 0; j < nrow; j++) {
                    y0 = j * s; cov = 0;
                    for (k = 0; k < M; k++) {
                        if (los[k] === null) { continue; }
                        a = Math.max(los[k], y0); b = Math.min(his[k], y0 + s);
                        if (b > a) { cov += b - a; }
                    }
                    cov = cov / (M * s);
                    if (cov > 0.9999) { F++; col.full.push(j); }
                    else if (cov > 1e-9) { P++; col.part.push(j); }
                }
            }
            cols.push(col);
        }
        state = {s: s, F: F, P: P, cols: cols};
    }

    function runs(list) {          // [3,4,5,9,10] -> [[3,5],[9,10]]
        var out = [], k;
        for (k = 0; k < list.length; k++) {
            if (out.length && list[k] === out[out.length - 1][1] + 1) { out[out.length - 1][1] = list[k]; }
            else { out.push([list[k], list[k]]); }
        }
        return out;
    }
    // One full block and up to two part blocks per column (at most 40 columns, at 0.25 cm),
    // made once; each recomputes from the current classification.
    var c, maxCols = 40;
    for (c = 0; c < maxCols; c++) {
        (function (c) {
            var full = board.create('curve', [[], []], {fillColor: '#9a9a9a', fillOpacity: 1, strokeWidth: 0, highlight: false});
            full.updateDataArray = function () {
                classify();
                this.dataX = []; this.dataY = [];
                var col = state.cols[c], s = state.s;
                if (!col || !col.full.length) { return; }
                var y0 = col.full[0] * s, y1 = (col.full[col.full.length - 1] + 1) * s, x0 = c * s;
                this.dataX = [x0, x0 + s, x0 + s, x0, x0];
                this.dataY = [y0, y0, y1, y1, y0];
            };
            for (var part = 0; part < 2; part++) {
                (function (part) {
                    var pc = board.create('curve', [[], []], {fillColor: '#e6e6e6', fillOpacity: 1, strokeColor: '#000000', strokeWidth: 1.2, dash: 1, highlight: false});
                    pc.updateDataArray = function () {
                        classify();
                        this.dataX = []; this.dataY = [];
                        var col = state.cols[c], s = state.s;
                        if (!col) { return; }
                        var r = runs(col.part);
                        if (r.length <= part) { return; }
                        var x0 = c * s, y0 = r[part][0] * s, y1 = (r[part][1] + 1) * s;
                        this.dataX = [x0, x0 + s, x0 + s, x0, x0];
                        this.dataY = [y0, y0, y1, y1, y0];
                    };
                })(part);
            }
        })(c);
    }
    // grid lines
    var grid = board.create('curve', [[], []], {strokeColor: '#777777', strokeWidth: 0.6, highlight: false});
    grid.updateDataArray = function () {
        var s = size(), v;
        this.dataX = []; this.dataY = [];
        for (v = 0; v <= W + 1e-9; v += s) { this.dataX.push(v, v, NaN); this.dataY.push(0, H, NaN); }
        for (v = 0; v <= H + 1e-9; v += s) { this.dataX.push(0, W, NaN); this.dataY.push(v, v, NaN); }
    };
    // the leaf outline
    board.create('functiongraph', [hi, 1.1, 9.1], {strokeColor: '#000000', strokeWidth: 3, fixed: true, highlight: false});
    board.create('functiongraph', [lo, 1.1, 9.1], {strokeColor: '#000000', strokeWidth: 3, fixed: true, highlight: false});
    board.create('segment', [[1.1, 4.4], [0.4, 3.6]], {strokeColor: '#000000', strokeWidth: 3, fixed: true, highlight: false});

    function fmt(v) { return String(Math.round(v * 10000) / 10000); }
    board.create('text', [10.6, 5.1, function () { classify(); return 'squares ' + fmt(state.s) + ' cm by ' + fmt(state.s) + ' cm'; }],
        {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [10.6, 4.3, function () { classify(); return 'one square = ' + fmt(state.s * state.s) + ' cm²'; }],
        {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [10.6, 3.2, function () { classify(); return 'full squares F = ' + state.F; }],
        {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [10.6, 2.4, function () { classify(); return 'part squares P = ' + state.P; }],
        {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [0, -0.8, function () {
        classify();
        return 'estimate = (F + ½P) × one square = (' + state.F + ' + ½ × ' + state.P + ') × ' + fmt(state.s * state.s) +
            ' = ' + fmt((state.F + state.P / 2) * state.s * state.s) + ' cm²';
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14, cssClass: 'cs-estimate'});
    board.create('text', [0, -1.8, 'true area of the leaf = 25.6 cm²'],
        {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.update();
})();
