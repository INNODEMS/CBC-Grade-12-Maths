// Depreciation as a decay curve (G12 Ch14 Commercial Arithmetic III, sec-depreciation; Essential).
// Sliders P (price) and r (rate of depreciation per cent per year). Solid curve: reducing balance V = P(1 - r/100)^t, dots at
// whole years. Dotted line: half the price. Checkbox: a dashed line losing r% of the price every year (straight line, stops at 0).
// A year marker n on the time axis reads both values.
// Instruction check: P = 160 000, r = 15, n = 3 shows 98 260 on the curve and 88 000 on the line (act-a-boda-boda-motorbike).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-depreciation-curve', {
        boundingbox: [-2.6, 140, 11.9, -16],
        keepAspectRatio: false, axis: false, grid: false,
        showCopyright: false, showNavigation: false,
        pan: {enabled: false}, zoom: {enabled: false}
    });
    // F(o): a fresh attribute object (JXG.merge would change its first argument in place)
    function F(o) { var r = {fixed: true, highlight: false}, k; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function txt(o) { var r = F({useMathJax: false, fontSize: 13, cssStyle: 'white-space: nowrap'}), k; o = o || {}; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function money(v) {
        var w = Math.round(v).toString();
        return w.length > 4 ? w.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009') : w;
    }
    function nice(v) {
        var p = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), m = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10], i;
        for (i = 0; i < m.length; i++) { if (m[i] * p >= v) { return m[i] * p; } }
        return 10 * p;
    }
    var sP = board.create('slider', [[0.5, 130], [4.2, 130], [10000, 160000, 500000]], {name: 'P', snapWidth: 5000, precision: 0, label: {useMathJax: false, fontSize: 13}});
    var sr = board.create('slider', [[0.5, 120], [4.2, 120], [1, 15, 40]], {name: 'r', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 13}});
    var box = board.create('checkbox', [0.4, 110, 'same amount each year'], {checked: false, fixed: true, useMathJax: false, fontSize: 13});
    function V(t) { return sP.Value() * Math.pow(1 - sr.Value() / 100, t); }
    function Lin(t) { return Math.max(0, sP.Value() * (1 - sr.Value() * t / 100)); }
    function top() { return nice(sP.Value() * 1.05); }
    function y(v) { return 100 * v / top(); }
    var j;
    for (j = 1; j <= 5; j++) {
        (function (k) {
            board.create('segment', [[0, 20 * k], [10, 20 * k]], F({strokeColor: '#dddddd', strokeWidth: 1}));
            board.create('text', [-2.5, 20 * k, function () { return money(top() * k / 5); }], txt({fontSize: 12, anchorY: 'middle'}));
        })(j);
    }
    for (j = 1; j <= 10; j++) { board.create('text', [j - 0.1, -4, String(j)], txt({fontSize: 12})); }
    var axisX = board.create('segment', [[0, 0], [10, 0]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[0, 0], [0, 104]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('text', [-0.3, -4, '0'], txt({fontSize: 12}));
    board.create('text', [7.6, -10, 'time (years)'], txt());
    board.create('text', [-2.5, 111, 'Ksh'], txt());
    board.create('functiongraph', [function () { return y(sP.Value() / 2); }, 0, 10], F({strokeColor: '#555555', strokeWidth: 1.5, dash: 1}));
    board.create('text', [8.4, function () { return y(sP.Value() / 2) + 4; }, 'half the price'], txt({fontSize: 12}));
    board.create('functiongraph', [function (t) { return y(V(t)); }, 0, 10], F({strokeColor: '#000000', strokeWidth: 2.5}));
    board.create('functiongraph', [function (t) { return y(Lin(t)); }, 0, 10],
        F({strokeColor: '#000000', strokeWidth: 2, dash: 3, visible: function () { return box.Value(); }}));
    for (j = 0; j <= 10; j++) {
        (function (k) {
            board.create('point', [k, function () { return y(V(k)); }], F({name: '', size: 2.5, strokeColor: '#000000', fillColor: '#000000', showInfobox: false}));
        })(j);
    }
    var n = board.create('glider', [3, 0, axisX], {name: 'n', size: 5, face: '^', strokeColor: '#000000', fillColor: '#ffffff', showInfobox: false, label: {useMathJax: false, fontSize: 14, offset: [8, 10]}});
    var yr = function () { return Math.round(n.X()); };
    n.on('drag', function () { var k = Math.round(n.X()); if (k !== n.X()) { n.moveTo([k, 0]); } });
    n.on('up', function () { n.moveTo([Math.round(n.X()), 0]); board.update(); });
    board.create('segment', [[function () { return yr(); }, 0], [function () { return yr(); }, function () { return y(sP.Value()); }]],
        F({strokeColor: '#999999', strokeWidth: 1, dash: 2}));
    board.create('point', [function () { return yr(); }, function () { return y(V(yr())); }],
        F({name: '', size: 5, face: 'o', strokeColor: '#000000', fillColor: '#ffffff', showInfobox: false}));
    board.create('text', [6.3, 133, function () { return 'Multiplier each year: ' + (1 - sr.Value() / 100).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); }], txt());
    board.create('text', [6.3, 125, function () { return 'After n = ' + yr() + ' years: Ksh ' + money(V(yr())) + ' (curve)'; }], txt());
    board.create('text', [6.3, 117, function () { return box.Value() ? 'Same amount each year: Ksh ' + money(Lin(yr())) : ''; }], txt());
})();
