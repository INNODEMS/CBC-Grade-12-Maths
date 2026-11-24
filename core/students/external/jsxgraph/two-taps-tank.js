// Two taps and an outlet filling a tank (G12 Ch3 Compound Proportions, Rates of Work and Mixtures, sec-rates-of-work, lesson 3.1; Core and Essential).
// Sliders a (tap A alone fills the tank in a hours), b (tap B alone), c (the outlet alone empties a full tank in c hours);
// checkboxes "tap B open" and "outlet open". The graph shows the fraction of the tank full against time, 0 to 24 hours:
// dashed tap A alone, dotted tap B alone, solid with everything open. Play moves a point along the solid line and fills the tank.
// Instruction checks: a 4, b 12, outlet closed: 3 hours. a 5, tap B closed, outlet 20: 6 h 40 min. a 6, b 4, outlet 8: 3 h 26 min (24/7 h).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-two-taps-tank', {
        boundingbox: [-3.2, 16.2, 36.5, -4.2],
        keepAspectRatio: false, axis: false, grid: false,
        showCopyright: false, showNavigation: false,
        pan: {enabled: false}, zoom: {enabled: false}
    });
    // F(o): a fresh attribute object for fixed, non-highlighting elements
    function F(o) { var r = {fixed: true, highlight: false}, k; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function txt(o) { var r = F({useMathJax: false, fontSize: 13, cssStyle: 'white-space: nowrap'}), k; o = o || {}; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    var Y = 10;      // the full tank is drawn 10 units high
    var TMAX = 24;   // hours shown

    var sa = board.create('slider', [[0, 15], [5, 15], [1, 4, 12]], {name: 'a', snapWidth: 0.5, precision: 1, withLabel: false});
    var sb = board.create('slider', [[10.5, 15], [15.5, 15], [1, 12, 12]], {name: 'b', snapWidth: 0.5, precision: 1, withLabel: false});
    var sc = board.create('slider', [[21.5, 15], [26.5, 15], [2, 20, 24]], {name: 'c', snapWidth: 0.5, precision: 1, withLabel: false});
    // slider labels as separate texts, clear of the slider handle at either end
    function sl(s, x, n) { board.create('text', [x, 15, function () { return n + ' = ' + s.Value().toFixed(1); }], txt({anchorY: 'middle'})); }
    sl(sa, 6.2, 'a'); sl(sb, 16.7, 'b'); sl(sc, 27.7, 'c');
    var cbB = board.create('checkbox', [11, 13.6, 'tap B open'], {checked: true, fixed: true, fontSize: 13});
    var cbO = board.create('checkbox', [21, 13.6, 'outlet open'], {checked: false, fixed: true, fontSize: 13});
    JXG.addEvent(cbB.rendNodeCheckbox, 'change', function () { stop(); board.update(); }, cbB);
    JXG.addEvent(cbO.rendNodeCheckbox, 'change', function () { stop(); board.update(); }, cbO);

    function rate() {
        var r = 1 / sa.Value();
        if (cbB.Value()) { r += 1 / sb.Value(); }
        if (cbO.Value()) { r -= 1 / sc.Value(); }
        return r;
    }
    function full(r, t) { return Math.max(0, Math.min(1, r * t)); }
    function hm(t) {
        var mins = Math.round(t * 60), h = Math.floor(mins / 60), m = mins - 60 * h;
        return h + ' h ' + m + ' min';
    }
    function nice(t) { return (Math.abs(t - Math.round(t * 100) / 100) < 1e-9) ? String(Math.round(t * 100) / 100) : t.toFixed(2); }

    // axes and grid: time 0 to 24 across, fraction full 0 to 1 up
    var j;
    for (j = 1; j <= 4; j++) {
        board.create('segment', [[0, Y * j / 4], [TMAX, Y * j / 4]], F({strokeColor: '#dddddd', strokeWidth: 1}));
        board.create('text', [-2.6, Y * j / 4, String(j / 4)], txt({fontSize: 12, anchorY: 'middle'}));
    }
    for (j = 4; j <= TMAX; j += 4) {
        board.create('segment', [[j, 0], [j, Y]], F({strokeColor: '#eeeeee', strokeWidth: 1}));
        board.create('text', [j - 0.4, -0.9, String(j)], txt({fontSize: 12}));
    }
    board.create('arrow', [[0, 0], [TMAX + 1.2, 0]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('arrow', [[0, 0], [0, Y + 1.2]], F({strokeColor: '#000000', strokeWidth: 1.5}));
    board.create('text', [-0.6, -0.9, '0'], txt({fontSize: 12}));
    board.create('text', [9, -2.1, 'time (hours)'], txt());
    board.create('text', [0.5, 11.0, 'fraction full'], txt({fontSize: 12}));

    // the three graphs
    board.create('functiongraph', [function (t) { return Y * full(1 / sa.Value(), t); }, 0, TMAX],
        F({strokeColor: '#555555', strokeWidth: 2, dash: 3}));
    board.create('functiongraph', [function (t) { return cbB.Value() ? Y * full(1 / sb.Value(), t) : NaN; }, 0, TMAX],
        F({strokeColor: '#555555', strokeWidth: 2, dash: 1, lineCap: 'butt'}));
    board.create('functiongraph', [function (t) { return Y * full(rate(), t); }, 0, TMAX],
        F({strokeColor: '#000000', strokeWidth: 3}));

    // readout
    board.create('text', [0, 12.3, function () {
        var r = rate();
        if (r <= 1e-12) { return 'The tank never fills: the outlet takes away as much as the taps put in, or more.'; }
        var t = 1 / r;
        return 'Time to fill with everything open: ' + nice(t) + ' hours (' + hm(t) + ')';
    }], txt());
    board.create('text', [0, -3.5, 'Dashed: tap A alone. Dotted: tap B alone. Solid: everything open.'], txt({fontSize: 12}));

    // animation: a point on the solid line and the water in the tank
    var T = 0, timer = null;
    function stop() { if (timer) { clearInterval(timer); timer = null; } T = 0; }
    function level() { return Y * full(rate(), T); }
    board.create('point', [function () { return T; }, level],
        F({name: '', size: 4, strokeColor: '#000000', fillColor: '#000000', showInfobox: false}));
    // tank drawing at x 27 to 33
    var w0 = 27.5, w1 = 33.5;
    var q1 = board.create('point', [w0, 0], F({visible: false, name: ''}));
    var q2 = board.create('point', [w1, 0], F({visible: false, name: ''}));
    var q3 = board.create('point', [w1, level], F({visible: false, name: ''}));
    var q4 = board.create('point', [w0, level], F({visible: false, name: ''}));
    board.create('polygon', [q1, q2, q3, q4], F({fillColor: '#7fb2e5', fillOpacity: 0.8, borders: {strokeWidth: 0, highlight: false}, vertices: {visible: false}}));
    board.create('polygon', [[w0, 0], [w1, 0], [w1, Y], [w0, Y]], F({fillOpacity: 0, borders: {strokeColor: '#000000', strokeWidth: 2, highlight: false}, vertices: {visible: false}}));
    board.create('text', [w0, -0.9, function () { return 'tank: ' + Math.round(100 * full(rate(), T)) + '% full'; }], txt({fontSize: 12}));
    board.create('text', [w0, 11.2, function () { return 't = ' + T.toFixed(1) + ' h'; }], txt({fontSize: 12}));

    board.create('button', [w0 + 2, 13.6, 'Play', function () {
        var r = rate(), end = (r > 1e-12) ? Math.min(TMAX, 1 / r) : TMAX, steps = 120, k = 0;
        stop();
        timer = setInterval(function () {
            k += 1; T = end * k / steps; board.update();
            if (k >= steps) { clearInterval(timer); timer = null; }
        }, 30);
    }], {fixed: true});

    sa.on('drag', function () { stop(); });
    sb.on('drag', function () { stop(); });
    sc.on('drag', function () { stop(); });
    board.update();
})();
