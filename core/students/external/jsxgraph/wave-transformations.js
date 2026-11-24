// Transforming a wave (G12 Ch10, sec-transformation-of-waves, lesson 4.2).
// The grey wave is y = sin x; its image y = A sin(B(x - H)) + D in black, B = 1/K.
// Sliders: A stretch factor with the x-axis invariant (0.5 to 3, step 0.5), K stretch factor with the y-axis invariant
// (0.25 to 2, step 0.25), H translation along x (-180 to 180, step 15), D translation along y (-2 to 2, step 0.5).
// Live equation y = A sin(Bx + C) + D with C = -BH, and the image of (90, 1) tracked.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-wave-transformations', {
        boundingbox: [-200, 9.2, 380, -5.6],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var ax = {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false};
    board.create('segment', [[-180, 0], [360, 0]], ax);
    board.create('segment', [[0, -5], [0, 5]], ax);
    for (var t = -180; t <= 360; t += 90) {
        if (t !== 0) { board.create('segment', [[t, -0.12], [t, 0.12]], ax); board.create('text', [t - 12, -0.5, t + '°'], {fixed: true, highlight: false, useMathJax: false, fontSize: 11}); }
    }
    for (var v = -5; v <= 5; v += 1) {
        if (v !== 0) { board.create('segment', [[-4, v], [4, v]], ax); board.create('text', [-22, v, String(v)], {fixed: true, highlight: false, useMathJax: false, fontSize: 11}); }
    }
    var A = board.create('slider', [[-170, 8.8], [-70, 8.8], [0.5, 1, 3]], {name: 'stretch factor, x-axis invariant', snapWidth: 0.5, withTicks: false});
    var K = board.create('slider', [[-170, 8.1], [-70, 8.1], [0.25, 1, 2]], {name: 'stretch factor, y-axis invariant', snapWidth: 0.25, withTicks: false});
    var H = board.create('slider', [[-170, 7.4], [-70, 7.4], [-180, 0, 180]], {name: 'translation along x', snapWidth: 15, withTicks: false});
    var D = board.create('slider', [[-170, 6.7], [-70, 6.7], [-2, 0, 2]], {name: 'translation along y', snapWidth: 0.5, withTicks: false});
    function rad(x) { return x * Math.PI / 180; }
    function g(x) { return A.Value() * Math.sin(rad((x - H.Value()) / K.Value())) + D.Value(); }
    board.create('functiongraph', [function (x) { return Math.sin(rad(x)); }, -180, 360], {strokeColor: '#999999', strokeWidth: 2, fixed: true, highlight: false});
    board.create('functiongraph', [g, -180, 360], {strokeColor: '#000000', strokeWidth: 2.5, fixed: true, highlight: false});
    board.create('point', [90, 1], {name: '(90°, 1)', size: 3, fixed: true, showInfobox: false, strokeColor: '#999999', fillColor: '#999999', label: {useMathJax: false, offset: [6, 10]}});
    function fmt(n) { var r = Math.round(n * 100) / 100; return String(r); }
    board.create('point', [function () { return 90 * K.Value() + H.Value(); }, function () { return A.Value() + D.Value(); }], {
        name: function () { return 'image (' + fmt(90 * K.Value() + H.Value()) + '°, ' + fmt(A.Value() + D.Value()) + ')'; },
        size: 4, fixed: true, showInfobox: false, strokeColor: '#b00000', fillColor: '#b00000', label: {useMathJax: false, offset: [8, -14]}
    });
    board.create('text', [-170, 5.9, function () {
        var B = 1 / K.Value(), C = -B * H.Value(), d = D.Value();
        var s = 'y = ' + (Math.abs(A.Value() - 1) < 1e-9 ? '' : fmt(A.Value()) + ' ') + 'sin(' + (Math.abs(B - 1) < 1e-9 ? '' : fmt(B)) + 'x';
        if (Math.abs(C) > 1e-9) { s += (C > 0 ? ' + ' : ' − ') + fmt(Math.abs(C)) + '°'; }
        s += ')';
        if (Math.abs(d) > 1e-9) { s += (d > 0 ? ' + ' : ' − ') + fmt(Math.abs(d)); }
        return s;
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 15});
})();
