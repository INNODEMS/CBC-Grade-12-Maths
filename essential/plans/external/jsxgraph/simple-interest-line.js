// Simple interest as a straight line (G12 Ch14 Commercial Arithmetic III, sec-simple-interest, lesson 1.1; Essential).
// Sliders P (principal), R (rate per cent per annum) and T (time in years). The amount A = P + PRT/100 is drawn
// for t from 0 to 10 years. The vertical scale adjusts to the largest amount; tick labels are in shillings.
// Instruction check: P = 20 000, R = 8, T = 4 gives I = 6400 and A = 26 400 (activity act-interest-year-by-year).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-simple-interest-line', {
        boundingbox: [-2.6, 140, 11.9, -14],
        keepAspectRatio: false, axis: false, grid: false,
        showCopyright: false, showNavigation: false,
        pan: {enabled: false}, zoom: {enabled: false}
    });
    // F(o): a fresh attribute object (JXG.merge would change its first argument in place)
    function F(o) { var r = {fixed: true, highlight: false}, k; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function txt(o) { var r = F({useMathJax: false, fontSize: 13, cssStyle: 'white-space: nowrap'}), k; o = o || {}; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function money(v, dp) {
        var s = (dp ? v.toFixed(dp) : Math.round(v).toString()), parts = s.split('.'), w = parts[0];
        if (w.length > 4) { w = w.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009'); }
        return parts.length > 1 ? w + '.' + parts[1] : w;
    }
    function nice(v) {
        var p = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), m = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10], i;
        for (i = 0; i < m.length; i++) { if (m[i] * p >= v) { return m[i] * p; } }
        return 10 * p;
    }
    var sP = board.create('slider', [[0.5, 128], [4.2, 128], [1000, 20000, 100000]], {name: 'P', snapWidth: 1000, precision: 0, label: {useMathJax: false, fontSize: 13}});
    var sR = board.create('slider', [[0.5, 119], [4.2, 119], [1, 8, 20]], {name: 'R', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 13}});
    var sT = board.create('slider', [[0.5, 110], [4.2, 110], [0, 4, 10]], {name: 'T', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 13}});
    function A(t) { return sP.Value() * (1 + sR.Value() * t / 100); }
    function top() { return nice(A(10) * 1.05); }
    function y(v) { return 100 * v / top(); }
    // grid and axes
    var j;
    for (j = 1; j <= 5; j++) {
        (function (k) {
            board.create('segment', [[0, 20 * k], [10, 20 * k]], F({strokeColor: '#dddddd', strokeWidth: 1}));
            board.create('text', [-2.5, 20 * k, function () { return money(top() * k / 5); }], txt({fontSize: 12, anchorY: 'middle'}));
        })(j);
    }
    for (j = 1; j <= 10; j++) {
        board.create('segment', [[j, 0], [j, 100]], F({strokeColor: '#eeeeee', strokeWidth: 1}));
        board.create('text', [j - 0.1, -4, String(j)], txt({fontSize: 12}));
    }
    board.create('arrow', [[0, 0], [10.6, 0]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[0, 0], [0, 104]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('text', [-0.3, -4, '0'], txt({fontSize: 12}));
    board.create('text', [7.6, -10, 'time (years)'], txt());
    board.create('text', [-2.5, 111, 'Ksh'], txt());
    // the amount line and the point at T
    board.create('functiongraph', [function (t) { return y(A(t)); }, 0, 10], F({strokeColor: '#000000', strokeWidth: 2.5}));
    board.create('functiongraph', [function () { return y(sP.Value()); }, 0, 10], F({strokeColor: '#777777', strokeWidth: 1, dash: 2}));
    board.create('point', [function () { return sT.Value(); }, function () { return y(A(sT.Value())); }],
        F({name: '', size: 4, strokeColor: '#000000', fillColor: '#000000', showInfobox: false}));
    board.create('segment', [[function () { return sT.Value(); }, function () { return y(sP.Value()); }],
        [function () { return sT.Value(); }, function () { return y(A(sT.Value())); }]], F({strokeColor: '#000000', strokeWidth: 2, dash: 1}));
    board.create('text', [6.3, 128, function () { return 'Interest after T years: I = Ksh ' + money(sP.Value() * sR.Value() * sT.Value() / 100, 0); }], txt());
    board.create('text', [6.3, 119, function () { return 'Amount: A = P + I = Ksh ' + money(A(sT.Value()), 0); }], txt());
    board.create('text', [6.3, 110, 'Dotted: the principal P'], txt({fontSize: 12}));
})();
