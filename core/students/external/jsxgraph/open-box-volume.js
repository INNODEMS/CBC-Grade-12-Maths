// Folding a box (G12 Ch17, sec-application-of-differentiation, lesson 3.1).
// Left: the 24 cm square with four corner squares of side x shaded and dashed fold lines.
// Middle: an oblique drawing of the open box (base 24 - 2x, height x).
// Right: the graph of V(x) = x(24 - 2x)^2 for 0 <= x <= 12 with a moving point and a readout.
// Slider x from 0 to 12, step 0.1, so x = 4 (the greatest volume, 1024 cm^3) is reachable exactly.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-open-box-volume', {
        boundingbox: [0, 100, 160, 0],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var sx = board.create('slider', [[20, 8], [80, 8], [0, 3, 12]], {name: 'x', snapWidth: 0.1, precision: 1, label: {useMathJax: false}});
    function X() { return Math.round(sx.Value() * 10) / 10; }
    function V(x) { return x * (24 - 2 * x) * (24 - 2 * x); }

    // ---- the net: 24 cm drawn as 36 units, lower-left corner at (4, 36)
    var k = 1.5, nx = 4, ny = 36;
    function P(u, v) { return [nx + k * u, ny + k * v]; }
    board.create('polygon', [P(0, 0), P(24, 0), P(24, 24), P(0, 24)], {fillColor: '#ffffff', fillOpacity: 0, borders: {strokeColor: '#000000', strokeWidth: 1.5}, vertices: {visible: false}, fixed: true, highlight: false});
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(function (c) {
        board.create('polygon', [
            function () { var x = X(); return P(c[0] * (24 - x), c[1] * (24 - x)); },
            function () { var x = X(); return P(c[0] * (24 - x) + x, c[1] * (24 - x)); },
            function () { var x = X(); return P(c[0] * (24 - x) + x, c[1] * (24 - x) + x); },
            function () { var x = X(); return P(c[0] * (24 - x), c[1] * (24 - x) + x); }
        ], {fillColor: '#999999', fillOpacity: 0.5, borders: {strokeColor: '#666666', strokeWidth: 1}, vertices: {visible: false}, fixed: true, highlight: false});
    });
    board.create('polygon', [
        function () { var x = X(); return P(x, x); }, function () { var x = X(); return P(24 - x, x); },
        function () { var x = X(); return P(24 - x, 24 - x); }, function () { var x = X(); return P(x, 24 - x); }
    ], {fillOpacity: 0, borders: {strokeColor: '#000000', strokeWidth: 1, dash: 2}, vertices: {visible: false}, fixed: true, highlight: false});
    board.create('text', [4, 93, 'Sheet 24 cm by 24 cm'], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});

    // ---- the box: oblique drawing, base side b = 24 - 2x, height h = x, scale 1.2, depth offset 0.5
    var s = 1.2, bx = 52, by = 30;
    function Q(u, v, w) { return [bx + s * (u + 0.5 * w), by + s * (v + 0.5 * w)]; } // u across, v up, w back
    function seg(a, b, dash) {
        board.create('segment', [a, b], {strokeColor: '#1f4e9c', strokeWidth: 1.5, dash: dash ? 2 : 0, fixed: true, highlight: false});
    }
    function bb() { return 24 - 2 * X(); }
    function hh() { return X(); }
    // front face
    seg(function () { return Q(0, 0, 0); }, function () { return Q(bb(), 0, 0); });
    seg(function () { return Q(bb(), 0, 0); }, function () { return Q(bb(), hh(), 0); });
    seg(function () { return Q(bb(), hh(), 0); }, function () { return Q(0, hh(), 0); });
    seg(function () { return Q(0, hh(), 0); }, function () { return Q(0, 0, 0); });
    // back top edge and side edges
    seg(function () { return Q(0, hh(), 0); }, function () { return Q(0, hh(), bb()); });
    seg(function () { return Q(bb(), hh(), 0); }, function () { return Q(bb(), hh(), bb()); });
    seg(function () { return Q(0, hh(), bb()); }, function () { return Q(bb(), hh(), bb()); });
    seg(function () { return Q(bb(), 0, 0); }, function () { return Q(bb(), 0, bb()); });
    seg(function () { return Q(bb(), 0, bb()); }, function () { return Q(bb(), hh(), bb()); });
    // hidden edges
    seg(function () { return Q(0, 0, 0); }, function () { return Q(0, 0, bb()); }, true);
    seg(function () { return Q(0, 0, bb()); }, function () { return Q(bb(), 0, bb()); }, true);
    seg(function () { return Q(0, 0, bb()); }, function () { return Q(0, hh(), bb()); }, true);
    board.create('text', [52, 93, function () { return 'Box ' + bb().toFixed(1) + ' by ' + bb().toFixed(1) + ' by ' + hh().toFixed(1) + ' cm'; }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});

    // ---- the graph of V: x 0 to 12 on 108..156, V 0 to 1200 on 16..84
    var gx0 = 108, gy0 = 16, gw = 48, gh = 68;
    function G(x, v) { return [gx0 + gw * x / 12, gy0 + gh * v / 1200]; }
    board.create('segment', [G(0, 0), G(12.5, 0)], {strokeColor: '#000000', fixed: true, highlight: false});
    board.create('segment', [G(0, 0), G(0, 1200)], {strokeColor: '#000000', fixed: true, highlight: false});
    var t;
    for (t = 0; t <= 12; t += 2) { board.create('text', [G(t, 0)[0], gy0 - 4, String(t)], {anchorX: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 11}); }
    for (t = 0; t <= 1200; t += 400) { board.create('text', [gx0 - 2, G(0, t)[1], String(t)], {anchorX: 'right', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 11}); }
    board.create('curve', [function (u) { return G(u, V(u))[0]; }, function (u) { return G(u, V(u))[1]; }, 0, 12], {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false});
    board.create('point', [function () { return G(X(), V(X()))[0]; }, function () { return G(X(), V(X()))[1]; }], {name: '', size: 4, fixed: true, strokeColor: '#b00000', fillColor: '#b00000', showInfobox: false});
    board.create('text', [108, 93, function () { return 'x = ' + X().toFixed(1) + ' cm, V = ' + Math.round(V(X())) + ' cm³'; }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [150, 10, 'x (cm)'], {fixed: true, highlight: false, useMathJax: false, fontSize: 11});
    board.create('text', [110, 88, 'V'], {fixed: true, highlight: false, useMathJax: false, fontSize: 11});
})();
