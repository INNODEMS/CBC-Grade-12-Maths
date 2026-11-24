// Appreciation as a growth curve (G12 Ch14 Commercial Arithmetic III, sec-appreciation; Essential).
// Sliders P (starting value) and r (rate of appreciation per cent per year). Curve V = P(1 + r/100)^t for t from 0 to 10;
// dots at the whole years; a year marker n on the time axis reads the value after n years.
// Instruction check: P = 800 000, r = 10, n = 5 shows 1 288 408 (activity act-a-plot-near-kitengela).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-appreciation-curve', {
        boundingbox: [-2.8, 140, 11.9, -16],
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
    var sP = board.create('slider', [[0.5, 130], [4.2, 130], [100000, 800000, 2000000]], {name: 'P', snapWidth: 50000, precision: 0, label: {useMathJax: false, fontSize: 13}});
    var sr = board.create('slider', [[0.5, 120], [4.2, 120], [1, 10, 25]], {name: 'r', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 13}});
    function V(t) { return sP.Value() * Math.pow(1 + sr.Value() / 100, t); }
    function top() { return nice(V(10) * 1.05); }
    function y(v) { return 100 * v / top(); }
    var j;
    for (j = 1; j <= 5; j++) {
        (function (k) {
            board.create('segment', [[0, 20 * k], [10, 20 * k]], F({strokeColor: '#dddddd', strokeWidth: 1}));
            board.create('text', [-2.7, 20 * k, function () { return money(top() * k / 5); }], txt({fontSize: 12, anchorY: 'middle'}));
        })(j);
    }
    for (j = 1; j <= 10; j++) { board.create('text', [j - 0.1, -4, String(j)], txt({fontSize: 12})); }
    var axisX = board.create('segment', [[0, 0], [10, 0]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[0, 0], [0, 104]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('text', [-0.3, -4, '0'], txt({fontSize: 12}));
    board.create('text', [7.6, -10, 'time (years)'], txt());
    board.create('text', [-2.7, 111, 'Ksh'], txt());
    board.create('functiongraph', [function (t) { return y(V(t)); }, 0, 10], F({strokeColor: '#000000', strokeWidth: 2.5}));
    for (j = 0; j <= 10; j++) {
        (function (k) {
            board.create('point', [k, function () { return y(V(k)); }], F({name: '', size: 2.5, strokeColor: '#000000', fillColor: '#000000', showInfobox: false}));
        })(j);
    }
    var n = board.create('glider', [5, 0, axisX], {name: 'n', size: 5, face: '^', strokeColor: '#000000', fillColor: '#ffffff', showInfobox: false, label: {useMathJax: false, fontSize: 14, offset: [8, 10]}});
    var yr = function () { return Math.round(n.X()); };
    n.on('drag', function () { var k = Math.round(n.X()); if (k !== n.X()) { n.moveTo([k, 0]); } });
    n.on('up', function () { n.moveTo([Math.round(n.X()), 0]); board.update(); });
    board.create('segment', [[function () { return yr(); }, 0], [function () { return yr(); }, function () { return y(V(yr())); }]],
        F({strokeColor: '#000000', strokeWidth: 1, dash: 2}));
    board.create('point', [function () { return yr(); }, function () { return y(V(yr())); }],
        F({name: '', size: 5, face: 'o', strokeColor: '#000000', fillColor: '#ffffff', showInfobox: false}));
    board.create('text', [6.3, 133, function () { return 'Multiplier each year: ' + (1 + sr.Value() / 100).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); }], txt());
    board.create('text', [6.3, 125, function () { return 'After n = ' + yr() + ' years: Ksh ' + money(V(yr())); }], txt());
    board.create('text', [6.3, 117, function () { return 'Appreciation: Ksh ' + money(V(yr()) - sP.Value()); }], txt());
})();
