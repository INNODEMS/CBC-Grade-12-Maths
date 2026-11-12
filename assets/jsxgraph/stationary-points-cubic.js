// Stationary points of a cubic (G12 Ch17, sec-stationary-points-and-their-nature, lesson 1.2).
// y = a x^3 + b x^2 + c x + d with sliders a (-2 to 2, step 0.5, never 0), b, c (-6 to 6, step 1)
// and d (-5 to 5, step 1). The stationary points solve 3a x^2 + 2b x + c = 0 and are labelled
// "maximum point", "minimum point" or "point of inflection" with coordinates to 2 d.p.
// When the discriminant is negative the readout says "no stationary points".
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-stationary-points-cubic', {
        boundingbox: [-6, 16, 6, -14],
        keepAspectRatio: false,
        axis: true,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    // sliders along the top
    var sa = board.create('slider', [[-5.4, 14.5], [-2.4, 14.5], [-2, 1, 2]], {name: 'a', snapWidth: 0.5, precision: 1, label: {useMathJax: false}});
    var sb = board.create('slider', [[-5.4, 13], [-2.4, 13], [-6, 0, 6]], {name: 'b', snapWidth: 1, precision: 0, label: {useMathJax: false}});
    var sc = board.create('slider', [[0.6, 14.5], [3.6, 14.5], [-6, -3, 6]], {name: 'c', snapWidth: 1, precision: 0, label: {useMathJax: false}});
    var sd = board.create('slider', [[0.6, 13], [3.6, 13], [-5, 0, 5]], {name: 'd', snapWidth: 1, precision: 0, label: {useMathJax: false}});

    // a is never 0: snap 0 to 0.5
    function A() { var a = Math.round(sa.Value() * 2) / 2; return (a === 0) ? 0.5 : a; }
    function B() { return Math.round(sb.Value()); }
    function C() { return Math.round(sc.Value()); }
    function D() { return Math.round(sd.Value()); }
    function f(x) { return A() * x * x * x + B() * x * x + C() * x + D(); }

    board.create('functiongraph', [f, -6, 6], {strokeColor: '#1f4e9c', strokeWidth: 2, highlight: false});

    // stationary points: roots of 3a x^2 + 2b x + c
    function disc() { return 4 * B() * B() - 12 * A() * C(); }
    function sx(k) {
        var dd = disc();
        if (dd < 0) { return NaN; }
        if (Math.abs(dd) < 1e-9) { return -B() / (3 * A()); }
        var r = Math.sqrt(dd);
        var x1 = (-2 * B() - r) / (6 * A()), x2 = (-2 * B() + r) / (6 * A());
        return (k === 0) ? Math.min(x1, x2) : Math.max(x1, x2);
    }
    function kind(k) {
        if (Math.abs(disc()) < 1e-9) { return 'point of inflection'; }
        var f2 = 6 * A() * sx(k) + 2 * B();
        return (f2 < 0) ? 'maximum point' : 'minimum point';
    }
    function fmt(v) { var s = v.toFixed(2); return (s === '-0.00') ? '0.00' : s; }

    [0, 1].forEach(function (k) {
        board.create('point', [function () { return sx(k); }, function () { return f(sx(k)); }], {
            name: function () { return kind(k) + ' (' + fmt(sx(k)) + ', ' + fmt(f(sx(k))) + ')'; },
            size: 4, fixed: true, strokeColor: '#000000', fillColor: '#000000', showInfobox: false,
            label: {useMathJax: false, offset: [8, (k === 0) ? 12 : -14], fontSize: 13},
            visible: function () { return disc() >= 0 && (k === 0 || Math.abs(disc()) >= 1e-9); }
        });
    });

    board.create('text', [-5.6, -12.5, function () {
        var dd = disc();
        if (dd < 0) { return 'no stationary points'; }
        if (Math.abs(dd) < 1e-9) { return 'one stationary point'; }
        return 'two stationary points';
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 15});
})();
