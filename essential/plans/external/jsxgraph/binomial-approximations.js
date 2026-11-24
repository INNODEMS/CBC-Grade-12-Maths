// (1 + x)^n and its 2-, 3- and 4-term binomial approximations (G12 Ch2,
// sec-evaluating-numerical-cases-using-binomial-expansion, lesson 3.1).
// Sliders x (-0.5 to 0.5, step 0.01) and n (2 to 10). The exact curve is solid; the 2-, 3- and
// 4-term approximations are dashed, dotted and long-dashed, labelled at the right end of the graph.
// A vertical line marks the current x, and a table gives the four values and the errors there.
// For large n and |x| the curves leave the board (their labels are then hidden); the table still gives the values.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-binomial-approximations', {
        boundingbox: [-0.6, 4.3, 1.75, -1.15],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    // axes drawn only over the graphed part: x from -0.55 to 0.55, y from -1 to 3.5
    var xAx = board.create('segment', [[-0.55, 0], [0.56, 0]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false, lastArrow: true, point1: {visible: false}, point2: {visible: false}});
    var yAx = board.create('segment', [[0, -1], [0, 3.5]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false, lastArrow: true, point1: {visible: false}, point2: {visible: false}});
    var k;
    for (k = -5; k <= 5; k++) {
        if (k === 0) { continue; }
        board.create('segment', [[k / 10, -0.04], [k / 10, 0.04]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false, point1: {visible: false}, point2: {visible: false}});
        board.create('text', [k / 10, -0.15, (k / 10).toFixed(1)], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 11});
    }
    for (k = -1; k <= 3; k++) {
        board.create('segment', [[-0.008, k], [0.008, k]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false, point1: {visible: false}, point2: {visible: false}});
        if (k !== 0) { board.create('text', [-0.02, k, String(k)], {anchorX: 'right', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 11}); }
    }
    board.create('text', [0.57, 0.05, 'x'], {anchorX: 'left', anchorY: 'bottom', fixed: true, highlight: false, useMathJax: false, fontSize: 12});
    board.create('text', [0.03, 3.32, 'y'], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 12});

    // Slider values in a separate text clear of the knob (the built-in label sits only 5% of the
    // slider length past the end, under the knob at its maximum on these short sliders).
    function slider(p1, p2, rng, name, prec, snap) {
        var s = board.create('slider', [p1, p2, rng], {name: name, snapWidth: snap, precision: prec, withTicks: false, withLabel: false});
        board.create('text', [p2[0] + 0.06, p2[1], function () { return name + ' = ' + s.Value().toFixed(prec); }],
            {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 13});
        return s;
    }
    var xS = slider([-0.55, 3.95], [-0.25, 3.95], [-0.5, 0.02, 0.5], 'x', 2, 0.01);
    var nS = slider([-0.55, 3.55], [-0.25, 3.55], [2, 5, 10], 'n', 0, 1);

    function C(n, k) {
        var v = 1, i;
        for (i = 1; i <= k; i++) { v = v * (n - i + 1) / i; }
        return v;
    }
    function approx(x, m) {
        var n = Math.round(nS.Value()), s = 0, k;
        for (k = 0; k < m; k++) { s += C(n, k) * Math.pow(x, k); }
        return s;
    }
    function exact(x) { return Math.pow(1 + x, Math.round(nS.Value())); }

    var opt = {strokeColor: '#000000', highlight: false, fixed: true};
    board.create('functiongraph', [exact, -0.5, 0.5], {strokeColor: '#000000', strokeWidth: 3, highlight: false, fixed: true});
    var styles = [[2, 2], [3, 1], [4, 4]];  // [terms, dash]
    // Label heights at the right end (x = 0.5): curves that leave the board lose their label, a
    // 4-term label is dropped when n + 1 < 4 (it would sit on the 3-term curve), and labels that
    // would touch are pushed apart by GAP so they never overlap.
    var GAP = 0.25;
    function labelY(key) {
        var n = Math.round(nS.Value()), items = [], i;
        styles.forEach(function (st) { if (st[0] <= n + 1) { items.push({k: st[0], v: approx(0.5, st[0])}); } });
        items.push({k: 0, v: exact(0.5)});
        items = items.filter(function (it) { return it.v > -0.9 && it.v < 4.1; });
        items.sort(function (p, q) { return (p.v - q.v) || (p.k - q.k); });
        for (i = 1; i < items.length; i++) { if (items[i].v - items[i - 1].v < GAP) { items[i].v = items[i - 1].v + GAP; } }
        for (i = 0; i < items.length; i++) { if (items[i].k === key) { return items[i].v < 4.2 ? items[i].v : NaN; } }
        return NaN;
    }
    styles.forEach(function (st) {
        var m = st[0];
        board.create('functiongraph', [function (x) { return approx(x, m); }, -0.5, 0.5], {strokeColor: '#000000', strokeWidth: 2, dash: st[1], highlight: false, fixed: true});
        board.create('text', [0.52, function () { return labelY(m); }, m + ' terms'],
            {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 12});
    });
    board.create('text', [0.52, function () { return labelY(0); }, '(1 + x)^n'],
        {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 12});
    board.create('segment', [[function () { return xS.Value(); }, -1], [function () { return xS.Value(); }, 3.3]],
        {strokeColor: '#666666', strokeWidth: 1, dash: 1, highlight: false, fixed: true, point1: {visible: false}, point2: {visible: false}});
    board.create('point', [function () { return xS.Value(); }, function () { return exact(xS.Value()); }],
        {name: '', size: 3, fillColor: '#000000', strokeColor: '#000000', fixed: true, highlight: false});

    function f6(v) { return v.toFixed(6); }
    function e6(v) { return v.toFixed(6); }
    board.create('text', [0.8, 2.4, function () {
        var x = xS.Value(), n = Math.round(nS.Value()), e = exact(x), s = '';
        s += '<table style="border-collapse:collapse;font-size:11px;white-space:nowrap;">';
        s += '<tr><th style="padding:1px 3px;text-align:left;">x = ' + x.toFixed(2) + ', n = ' + n + '</th><th style="padding:1px 3px;">value</th><th style="padding:1px 3px;">error</th></tr>';
        s += '<tr><td style="padding:1px 3px;">(1 + x)<sup>n</sup> (solid)</td><td style="padding:1px 3px;">' + f6(e) + '</td><td></td></tr>';
        var names = ['2 terms (dashed)', '3 terms (dotted)', '4 terms (long dashes)'];
        for (var i = 0; i < 3; i++) {
            var v = approx(x, i + 2);
            s += '<tr><td style="padding:1px 3px;">' + names[i] + '</td><td style="padding:1px 3px;">' + f6(v) + '</td><td style="padding:1px 3px;">' + f6(e - v) + '</td></tr>';
        }
        return s + '</table>';
    }], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
})();
