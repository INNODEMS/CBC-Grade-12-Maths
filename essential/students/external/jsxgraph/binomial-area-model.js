// Area model of (a + b)^n (G12 Ch2, sec-binomial-expansion, lesson 1.1).
// Sliders n (1 to 4), a and b (1 to 4, step 0.5). n = 1: a segment a + b; n = 2: a square of side
// a + b split into a^2, ab, ab, b^2; n = 3: a cube of edge a + b drawn in perspective, its visible
// faces split at a | b, with the count of each kind of block; n = 4: a multiplication grid
// ((a^3 + 3a^2b + 3ab^2 + b^3) times (a + b)) with like terms marked by the same symbol and collected
// below. Live text gives the expansion and checks its value against (a + b)^n.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-binomial-area-model', {
        boundingbox: [-1, 14, 21, -2.5],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    // Slider values are written in a separate text 0.6 units past the end of each slider: the built-in
    // label sits only 5% of the slider length past the end, so on these short sliders the knob at its
    // maximum covered the first letter of the label.
    function slider(p1, p2, rng, name, prec, snap) {
        var s = board.create('slider', [p1, p2, rng], {name: name, snapWidth: snap, precision: prec, withTicks: false, withLabel: false});
        board.create('text', [p2[0] + 0.6, p2[1], function () { return name + ' = ' + s.Value().toFixed(prec); }],
            {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 13});
        return s;
    }
    var nS = slider([0.5, 13], [4, 13], [1, 2, 4], 'n', 0, 1);
    var aS = slider([7, 13], [10.5, 13], [1, 3, 4], 'a', 1, 0.5);
    var bS = slider([13.5, 13], [17, 13], [1, 2, 4], 'b', 1, 0.5);

    var shapes = [];
    var GREY1 = '#d9d9d9', GREY2 = '#a6a6a6', GREY3 = '#f2f2f2', LINE = '#000000';

    function clear() {
        board.suspendUpdate();
        for (var i = shapes.length - 1; i >= 0; i--) { board.removeObject(shapes[i]); }
        shapes = [];
        board.unsuspendUpdate();
    }
    function poly(pts, fill) {
        var p = board.create('polygon', pts, {fillColor: fill, fillOpacity: 0.9, fixed: true, highlight: false, vertices: {visible: false},
            borders: {strokeColor: LINE, strokeWidth: 1.5, highlight: false}});
        shapes.push(p);
        return p;
    }
    function txt(x, y, s, opt) {
        var o = {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, fontSize: 16};
        if (opt) { for (var k in opt) { o[k] = opt[k]; } }
        var t = board.create('text', [x, y, s], o);
        shapes.push(t);
        return t;
    }
    function seg(p, q, dash) {
        var s = board.create('segment', [p, q], {strokeColor: LINE, strokeWidth: 1.5, dash: dash || 0, fixed: true, highlight: false, point1: {visible: false}, point2: {visible: false}});
        shapes.push(s);
        return s;
    }
    function fmt(v) { return (Math.round(v * 10000) / 10000).toString(); }

    var EXP = ['', 'a + b', 'a^2 + 2ab + b^2', 'a^3 + 3a^2b + 3ab^2 + b^3', 'a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4'];
    var COEF = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]];

    function draw() {
        clear();
        board.suspendUpdate();
        var n = Math.round(nS.Value()), a = aS.Value(), b = bS.Value();
        var s = a + b;
        // scale the drawing so that a + b = 8 fills the space
        var u = 1.4;
        var A = a * u, B = b * u, S = s * u;
        if (n === 1) {
            seg([0, 5], [A, 5]); seg([A, 5], [S, 5]);
            seg([0, 4.6], [0, 5.4]); seg([A, 4.6], [A, 5.4]); seg([S, 4.6], [S, 5.4]);
            txt(A / 2, 5.8, '\\(a\\)'); txt(A + B / 2, 5.8, '\\(b\\)');
            txt(S / 2, 4, 'length \\(a + b\\)');
        } else if (n === 2) {
            poly([[0, B], [A, B], [A, S], [0, S]], GREY1);
            poly([[A, B], [S, B], [S, S], [A, S]], GREY3);
            poly([[0, 0], [A, 0], [A, B], [0, B]], GREY3);
            poly([[A, 0], [S, 0], [S, B], [A, B]], GREY2);
            txt(A / 2, B + A / 2, '\\(a^2\\)'); txt(A + B / 2, B + A / 2, '\\(ab\\)');
            txt(A / 2, B / 2, '\\(ab\\)'); txt(A + B / 2, B / 2, '\\(b^2\\)');
            txt(A / 2, S + 0.4, '\\(a\\)'); txt(A + B / 2, S + 0.4, '\\(b\\)');
            txt(-0.4, B + A / 2, '\\(a\\)'); txt(-0.4, B / 2, '\\(b\\)');
        } else if (n === 3) {
            // oblique cube: depth direction (0.5, 0.35) per unit
            var dx = 0.5, dy = 0.35;
            var S3 = S * 0.75, A3 = A * 0.75, B3 = B * 0.75;
            function P(x, y, z) { return [x + dx * z, y + dy * z]; }
            // front face (z = 0), split at a | b both ways
            poly([P(0, B3, 0), P(A3, B3, 0), P(A3, S3, 0), P(0, S3, 0)], GREY1);
            poly([P(A3, B3, 0), P(S3, B3, 0), P(S3, S3, 0), P(A3, S3, 0)], GREY3);
            poly([P(0, 0, 0), P(A3, 0, 0), P(A3, B3, 0), P(0, B3, 0)], GREY3);
            poly([P(A3, 0, 0), P(S3, 0, 0), P(S3, B3, 0), P(A3, B3, 0)], GREY2);
            // top face (y = S3)
            poly([P(0, S3, 0), P(A3, S3, 0), P(A3, S3, A3), P(0, S3, A3)], GREY1);
            poly([P(A3, S3, 0), P(S3, S3, 0), P(S3, S3, A3), P(A3, S3, A3)], GREY3);
            poly([P(0, S3, A3), P(A3, S3, A3), P(A3, S3, S3), P(0, S3, S3)], GREY3);
            poly([P(A3, S3, A3), P(S3, S3, A3), P(S3, S3, S3), P(A3, S3, S3)], GREY2);
            // right face (x = S3)
            poly([P(S3, B3, 0), P(S3, S3, 0), P(S3, S3, A3), P(S3, B3, A3)], GREY3);
            poly([P(S3, 0, 0), P(S3, B3, 0), P(S3, B3, A3), P(S3, 0, A3)], GREY2);
            poly([P(S3, B3, A3), P(S3, S3, A3), P(S3, S3, S3), P(S3, B3, S3)], GREY2);
            poly([P(S3, 0, A3), P(S3, B3, A3), P(S3, B3, S3), P(S3, 0, S3)], '#7f7f7f');
            var c = P(A3 / 2, B3 + A3 / 2, 0); txt(c[0], c[1], '\\(a^3\\)');
            c = P(A3 + B3 / 2, B3 + A3 / 2, 0); txt(c[0], c[1], '\\(a^2b\\)');
            c = P(A3 / 2, B3 / 2, 0); txt(c[0], c[1], '\\(a^2b\\)');
            c = P(A3 + B3 / 2, B3 / 2, 0); txt(c[0], c[1], '\\(ab^2\\)');
            txt(A3 / 2, -0.5, '\\(a\\)'); txt(A3 + B3 / 2, -0.5, '\\(b\\)');
            txt(13.2, 3.4, 'Blocks: 1 of \\(a^3\\), 3 of \\(a^2b\\),', {anchorX: 'left', fontSize: 14});
            txt(13.2, 2.4, '3 of \\(ab^2\\), 1 of \\(b^3\\) (at the back).', {anchorX: 'left', fontSize: 14});
        } else {
            // n = 4: multiplication grid (a^3 + 3a^2b + 3ab^2 + b^3)(a + b)
            var top = ['a^3', '3a^2b', '3ab^2', 'b^3'];
            var side = ['a', 'b'];
            var cell = [['a^4', '3a^3b', '3a^2b^2', 'ab^3'], ['a^3b', '3a^2b^2', '3ab^3', 'b^4']];
            var mark = [['', '\\blacktriangle', '\\blacksquare', '\\bullet'], ['\\blacktriangle', '\\blacksquare', '\\bullet', '']];
            var fill = [[GREY3, GREY1, GREY2, '#bfbfbf'], [GREY1, GREY2, '#bfbfbf', GREY3]];
            var w = 2.9, h = 2.2, x0 = 0.9, y0 = 9.5;
            var i, j;
            txt(x0 - 0.6, y0 + 0.6, '\\(\\times\\)');
            for (j = 0; j < 4; j++) { txt(x0 + w * j + w / 2, y0 + 0.6, '\\(' + top[j] + '\\)'); }
            for (i = 0; i < 2; i++) {
                txt(x0 - 0.6, y0 - h * i - h / 2, '\\(' + side[i] + '\\)');
                for (j = 0; j < 4; j++) {
                    var X = x0 + w * j, Y = y0 - h * i;
                    poly([[X, Y], [X + w, Y], [X + w, Y - h], [X, Y - h]], fill[i][j]);
                    txt(X + w / 2, Y - h / 2, '\\(' + cell[i][j] + '\\)', {fontSize: 14});
                    if (mark[i][j]) { txt(X + w - 0.35, Y - 0.4, '\\(' + mark[i][j] + '\\)', {fontSize: 10}); }
                }
            }
            txt(0.2, 4.0, 'Like terms have the same symbol and shading:', {anchorX: 'left', fontSize: 13});
            txt(0.2, 3.0, '\\(\\blacktriangle\\): \\(4a^3b\\), \\(\\blacksquare\\): \\(6a^2b^2\\), \\(\\bullet\\): \\(4ab^3\\)', {anchorX: 'left', fontSize: 13});
            txt(0.2, 1.8, '\\(a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4\\)', {anchorX: 'left'});
            txt(0.2, 0.6, 'Power 4 has no picture in space, so it is shown as a grid.', {anchorX: 'left', fontSize: 13});
        }
        // live text
        var val = 0, k;
        for (k = 0; k <= n; k++) { val += COEF[n][k] * Math.pow(a, n - k) * Math.pow(b, k); }
        txt(13.2, 9, '\\((a + b)^' + n + ' = ' + EXP[n] + '\\)', {anchorX: 'left', fontSize: 15});
        txt(13.2, 7.2, 'With a = ' + fmt(a) + ' and b = ' + fmt(b) + ':', {anchorX: 'left', useMathJax: false, fontSize: 15});
        txt(13.2, 6, 'expansion = ' + fmt(val), {anchorX: 'left', useMathJax: false, fontSize: 15});
        txt(13.2, 4.8, '(a + b)^' + n + ' = ' + fmt(Math.pow(s, n)), {anchorX: 'left', useMathJax: false, fontSize: 15});
        board.unsuspendUpdate();
    }

    nS.on('drag', draw); aS.on('drag', draw); bS.on('drag', draw);
    nS.on('up', draw); aS.on('up', draw); bS.on('up', draw);
    draw();
})();
