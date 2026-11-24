// Simple and compound interest compared (G12 Ch14 Commercial Arithmetic III, sec-compound-interest, lesson 2.2; Essential).
// Sliders P (principal) and r (rate per cent per annum); a year marker n moves along the time axis in whole years.
// Dashed line: simple amount P(1 + rt/100). Solid curve: compound amount P(1 + r/100)^t, interest added once a year
// (drawn as a smooth curve through the year-end values). The vertical segment at n shows the gap.
// Instruction check: P = 70 000, r = 9, n = 8 shows 120 400.00, 139 479.38 and a gap of 19 079.38.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-simple-and-compound-interest', {
        boundingbox: [-2.6, 140, 11.9, -16],
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
    var sP = board.create('slider', [[0.5, 130], [4.2, 130], [10000, 70000, 200000]], {name: 'P', snapWidth: 10000, precision: 0, label: {useMathJax: false, fontSize: 13}});
    var sr = board.create('slider', [[0.5, 120], [4.2, 120], [1, 9, 20]], {name: 'r', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 13}});
    function S(t) { return sP.Value() * (1 + sr.Value() * t / 100); }
    function C(t) { return sP.Value() * Math.pow(1 + sr.Value() / 100, t); }
    function top() { return nice(C(10) * 1.05); }
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
    board.create('functiongraph', [function (t) { return y(S(t)); }, 0, 10], F({strokeColor: '#000000', strokeWidth: 2, dash: 3}));
    board.create('functiongraph', [function (t) { return y(C(t)); }, 0, 10], F({strokeColor: '#000000', strokeWidth: 2.5}));
    board.create('text', [10.1, function () { return y(S(10)); }, 'simple'], txt({fontSize: 12, anchorY: 'middle'}));
    board.create('text', [10.1, function () { return y(C(10)); }, 'compound'], txt({fontSize: 12, anchorY: 'middle'}));
    // the year marker n: a glider on the time axis, kept on whole years
    var n = board.create('glider', [3, 0, axisX], {name: 'n', size: 5, face: '^', strokeColor: '#000000', fillColor: '#ffffff', showInfobox: false, label: {useMathJax: false, fontSize: 14, offset: [8, 10]}});
    var yr = function () { return Math.round(n.X()); };
    n.on('drag', function () { var k = Math.round(n.X()); if (k !== n.X()) { n.moveTo([k, 0]); } });
    n.on('up', function () { n.moveTo([Math.round(n.X()), 0]); board.update(); });
    board.create('segment', [[function () { return yr(); }, function () { return y(S(yr())); }], [function () { return yr(); }, function () { return y(C(yr())); }]],
        F({strokeColor: '#000000', strokeWidth: 4}));
    board.create('segment', [[function () { return yr(); }, 0], [function () { return yr(); }, function () { return y(S(yr())); }]],
        F({strokeColor: '#999999', strokeWidth: 1, dash: 1}));
    board.create('text', [6.3, 133, function () { return 'After n = ' + yr() + ' years:'; }], txt());
    board.create('text', [6.3, 126, function () { return 'simple: Ksh ' + money(S(yr()), 2); }], txt());
    board.create('text', [6.3, 119, function () { return 'compound: Ksh ' + money(C(yr()), 2); }], txt());
    board.create('text', [6.3, 112, function () { return 'gap: Ksh ' + money(C(yr()) - S(yr()), 2); }], txt());
})();
