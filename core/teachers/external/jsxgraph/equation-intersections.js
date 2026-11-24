// Both sides of an equation (G12 Ch10, sec-solving-trigonometric-equations-using-identities, lesson 3.1).
// y = 2 sin^2 x + cos x (fixed) and the line y = k, slider k (-1.5 to 2.5, step 0.125, start 1).
// The meeting points in 0 to 360 degrees are found exactly: 2 sin^2 x + cos x = k means 2c^2 - c + (k - 2) = 0 with c = cos x.
// They are marked with their x-values (1 d.p.) and counted.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-equation-intersections', {
        boundingbox: [-30, 3.6, 380, -1.9],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var ax = {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false};
    board.create('segment', [[0, 0], [360, 0]], ax);
    board.create('segment', [[0, -1.6], [0, 2.6]], ax);
    for (var t = 30; t <= 360; t += 30) {
        board.create('segment', [[t, -0.04], [t, 0.04]], ax);
        if (t % 90 === 0) { board.create('text', [t - 10, -0.15, t + '°'], {fixed: true, highlight: false, useMathJax: false, fontSize: 11}); }
    }
    for (var v = -1; v <= 2; v += 1) {
        if (v !== 0) { board.create('text', [-22, v, String(v)], {fixed: true, highlight: false, useMathJax: false, fontSize: 11}); board.create('segment', [[-3, v], [3, v]], ax); }
    }
    function rad(x) { return x * Math.PI / 180; }
    function f(x) { var s = Math.sin(rad(x)); return 2 * s * s + Math.cos(rad(x)); }
    board.create('functiongraph', [f, 0, 360], {strokeColor: '#1f4e9c', strokeWidth: 2.5, fixed: true, highlight: false});
    var k = board.create('slider', [[20, 3.3], [150, 3.3], [-1.5, 1, 2.5]], {name: 'k', snapWidth: 0.125, withTicks: false, precision: 3});
    board.create('functiongraph', [function () { return k.Value(); }, 0, 360], {strokeColor: '#000000', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false});

    function roots() {
        var K = k.Value(), disc = 1 - 8 * (K - 2), out = [];
        if (disc < -1e-9) { return out; }
        if (disc < 1e-9) { disc = 0; }
        var cs = [(1 + Math.sqrt(disc)) / 4, (1 - Math.sqrt(disc)) / 4];
        if (disc === 0) { cs = [cs[0]]; }
        cs.forEach(function (c) {
            if (c > 1 + 1e-12 || c < -1 - 1e-12) { return; }
            c = Math.max(-1, Math.min(1, c));
            var al = Math.acos(c) * 180 / Math.PI;
            if (al < 1e-9) { out.push(0, 360); } else if (Math.abs(al - 180) < 1e-9) { out.push(180); } else { out.push(al, 360 - al); }
        });
        out.sort(function (p, q) { return p - q; });
        return out.filter(function (x, i) { return i === 0 || Math.abs(x - out[i - 1]) > 1e-6; });
    }
    for (var i = 0; i < 4; i++) {
        (function (j) {
            board.create('point', [function () { var r = roots(); return j < r.length ? r[j] : -1000; }, function () { return k.Value(); }], {
                name: function () { var r = roots(); return j < r.length ? r[j].toFixed(1) + '°' : ''; },
                size: 4, fixed: true, showInfobox: false, strokeColor: '#b00000', fillColor: '#b00000',
                label: {useMathJax: false, offset: [-14, 14], fontSize: 12}
            });
        })(i);
    }
    board.create('text', [235, 3.3, function () {
        var n = roots().length;
        return 'k = ' + k.Value().toFixed(3) + ': ' + n + (n === 1 ? ' meeting point' : ' meeting points');
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
})();
