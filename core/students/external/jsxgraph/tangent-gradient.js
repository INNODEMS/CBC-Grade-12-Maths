// Tangent and gradient (G12 Ch17, sec-curve-sketching, lesson 2.1).
// The curve y = (x + 3)(x - 3)^2 = x^3 - 3x^2 - 9x + 27 with a glider P. The tangent at P is drawn and
// its gradient shown to 2 d.p. P snaps to multiples of 0.05 in x, so it can land exactly on the
// stationary points x = -1 and x = 3; when |gradient| < 0.05 the readout says "gradient 0: stationary point".
// The stationary points are faint crosses until P reaches them.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-tangent-gradient', {
        boundingbox: [-5, 60, 6, -30],
        keepAspectRatio: false,
        axis: true,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    function f(x) { return x * x * x - 3 * x * x - 9 * x + 27; }
    function df(x) { return 3 * x * x - 6 * x - 9; }

    var curve = board.create('functiongraph', [f, -4.2, 5.2], {strokeColor: '#1f4e9c', strokeWidth: 2, highlight: false, fixed: true});
    var P = board.create('glider', [-3, 0, curve], {name: 'P', size: 5, strokeColor: '#b00000', fillColor: '#b00000', showInfobox: false, label: {useMathJax: false, offset: [-16, 12]}});

    // snap P to multiples of 0.05 in x
    P.on('drag', function () {
        var x = Math.round(P.X() * 20) / 20;
        if (x < -4.2) { x = -4.2; }
        if (x > 5.2) { x = 5.2; }
        P.moveTo([x, f(x)]);
    });

    function m() { return df(P.X()); }
    function flat() { return Math.abs(m()) < 0.05; }

    board.create('line', [function () { return [P.X(), P.Y()]; }, function () { return [P.X() + 1, P.Y() + m()]; }], {
        strokeColor: '#000000', strokeWidth: 1.5, dash: 2, highlight: false, fixed: true
    });

    // faint crosses at the stationary points, solid once P reaches them
    [[-1, 32, 'maximum point (-1, 32)'], [3, 0, 'minimum point (3, 0)']].forEach(function (s) {
        board.create('point', [s[0], s[1]], {
            name: function () { return (Math.abs(P.X() - s[0]) < 0.001) ? s[2] : ''; },
            face: 'x', size: 6, fixed: true, showInfobox: false,
            strokeColor: function () { return (Math.abs(P.X() - s[0]) < 0.001) ? '#000000' : '#bbbbbb'; },
            label: {useMathJax: false, offset: [10, (s[1] > 10) ? 14 : -16], fontSize: 13}
        });
    });

    board.create('text', [-4.7, 54, function () {
        var g = m();
        if (flat()) { return 'x = ' + P.X().toFixed(2) + ', gradient 0: stationary point'; }
        return 'x = ' + P.X().toFixed(2) + ', gradient ' + g.toFixed(2) + (g > 0 ? ' (rising)' : ' (falling)');
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 15});
})();
