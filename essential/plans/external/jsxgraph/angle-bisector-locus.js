// Locus of points equidistant from the arms of an angle (G12 Ch8 Loci, sec-angle-bisector-loci).
// O is fixed; the ends X and Y of the two arms are draggable. P is a free point: its perpendicular distances to
// the arms (feet F and G) are shown, and P leaves a dot whenever they agree to within 0.05 (at most 200 dots;
// Clear removes them). "Show the bisector" draws the bisector; Next and Back step through the compass construction
// (arc from O, equal arcs from A and B, the bisector), which follows the arms when they move. "Whole lines" extends
// the arms through O, measures to the whole lines and shows both bisectors.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-angle-bisector-locus', {
        boundingbox: [-7, 7, 9, -5],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var showB = board.create('checkbox', [-6.6, 6.3, 'Show the bisector'], {fixed: true, label: {useMathJax: false, fontSize: 14}});
    var whole = board.create('checkbox', [-6.6, 5.6, 'Whole lines'], {fixed: true, label: {useMathJax: false, fontSize: 14}});

    var O = board.create('point', [0, 0], {name: 'O', fixed: true, showInfobox: false, size: 3, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, fontSize: 15, offset: [-16, -12]}});
    var pt = {showInfobox: false, size: 4, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [6, 10]}};
    var X = board.create('point', [7, 0], JXG.merge(pt, {name: 'X'}));
    var Y = board.create('point', [2.6, 5.3], JXG.merge(pt, {name: 'Y'}));
    var P = board.create('point', [4, 3.6], {name: 'P', showInfobox: false, size: 4, strokeColor: '#b00000', fillColor: '#b00000', label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});

    function isWhole() { return whole.Value(); }
    function unit(Q) { var x = Q.X() - O.X(), y = Q.Y() - O.Y(), L = Math.sqrt(x * x + y * y) || 1; return [x / L, y / L]; }
    // foot of the perpendicular from P to the arm OQ (a ray), or to the whole line OQ
    function foot(Q) {
        var v = unit(Q), t = (P.X() - O.X()) * v[0] + (P.Y() - O.Y()) * v[1];
        if (!isWhole()) { t = Math.max(0, t); }
        return [O.X() + t * v[0], O.Y() + t * v[1]];
    }
    function dist(Q) { var f = foot(Q); return Math.sqrt(Math.pow(P.X() - f[0], 2) + Math.pow(P.Y() - f[1], 2)); }

    var armStyle = {strokeColor: '#000000', strokeWidth: 2, highlight: false, fixed: true, straightFirst: function () { return isWhole(); }, straightLast: false};
    board.create('line', [O, X], armStyle);
    board.create('line', [O, Y], armStyle);

    var F = board.create('point', [function () { return foot(X)[0]; }, function () { return foot(X)[1]; }], {name: 'F', fixed: true, showInfobox: false, size: 2, strokeColor: '#b00000', fillColor: '#ffffff', label: {useMathJax: false, fontSize: 13}});
    var G = board.create('point', [function () { return foot(Y)[0]; }, function () { return foot(Y)[1]; }], {name: 'G', fixed: true, showInfobox: false, size: 2, strokeColor: '#b00000', fillColor: '#ffffff', label: {useMathJax: false, fontSize: 13}});
    board.create('segment', [P, F], {strokeColor: '#b00000', strokeWidth: 1.5, dash: 1, highlight: false, fixed: true});
    board.create('segment', [P, G], {strokeColor: '#b00000', strokeWidth: 1.5, dash: 1, highlight: false, fixed: true});
    board.create('text', [-6.6, -4.3, function () {
        return 'PF = ' + dist(X).toFixed(2) + '    PG = ' + dist(Y).toFixed(2);
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 15});

    // the bisector of angle XOY, and the second bisector for whole lines
    function bis(sgn) {
        var a = unit(X), b = unit(Y), x = a[0] + sgn * b[0], y = a[1] + sgn * b[1], L = Math.sqrt(x * x + y * y) || 1;
        return [x / L, y / L];
    }
    board.create('line', [O, function () { var w = bis(1); return [O.X() + w[0], O.Y() + w[1]]; }],
        {strokeColor: '#1f4e9c', strokeWidth: 2, dash: 2, highlight: false, fixed: true, straightFirst: function () { return isWhole(); },
         visible: function () { return showB.Value(); }});
    board.create('line', [O, function () { var w = bis(-1); return [O.X() + w[0], O.Y() + w[1]]; }],
        {strokeColor: '#1f4e9c', strokeWidth: 2, dash: 2, highlight: false, fixed: true,
         visible: function () { return showB.Value() && isWhole(); }});

    // dots where PF = PG (within 0.05)
    var dots = [];
    function maybeDot() {
        if (dots.length >= 200) { return; }
        if (Math.abs(dist(X) - dist(Y)) < 0.05) {
            dots.push(board.create('point', [P.X(), P.Y()], {name: '', fixed: true, size: 1.5, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', showInfobox: false, highlight: false}));
        }
    }
    P.on('drag', maybeDot);
    P.on('up', maybeDot);
    board.create('button', [5.2, -4.3, 'Clear', function () {
        board.suspendUpdate();
        dots.forEach(function (q) { board.removeObject(q); });
        dots = [];
        board.unsuspendUpdate();
    }], {fixed: true});

    // the compass construction, step by step: 1 arc from O (r = 2) cutting the arms at A and B;
    // 2 equal arcs from A and B crossing at C (radius 1.6, or 0.75 AB when the angle is wide, so the arcs always meet);
    // 3 the bisector OC
    var step = 0, R0 = 2;
    function R1() { var a = pA(), b = pB(); return Math.max(1.6, 0.75 * Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))); }
    function pA() { var a = unit(X); return [O.X() + R0 * a[0], O.Y() + R0 * a[1]]; }
    function pB() { var b = unit(Y); return [O.X() + R0 * b[0], O.Y() + R0 * b[1]]; }
    function pC() {
        // C on the bisector with AC = R1
        var w = bis(1), a = pA(), h = (a[0] - O.X()) * w[0] + (a[1] - O.Y()) * w[1];
        var q = Math.sqrt(Math.max(0, R0 * R0 - h * h)), s = h + Math.sqrt(Math.max(0, R1() * R1() - q * q));
        return [O.X() + s * w[0], O.Y() + s * w[1]];
    }
    function ang(p, c) { return Math.atan2(p[1] - c[1], p[0] - c[0]); }
    var cs = {strokeColor: '#555555', strokeWidth: 1.5, highlight: false, fixed: true};
    board.create('curve', [function (t) { return O.X() + R0 * Math.cos(t); }, function (t) { return O.Y() + R0 * Math.sin(t); },
        function () { return ang(pA(), [0, 0]) - 0.25; }, function () { var a1 = ang(pA(), [0, 0]), b1 = ang(pB(), [0, 0]); if (b1 < a1) { b1 += 2 * Math.PI; } return b1 + 0.25; }],
        JXG.merge(cs, {visible: function () { return step >= 1; }}));
    var Apt = board.create('point', [function () { return pA()[0]; }, function () { return pA()[1]; }], {name: 'A', fixed: true, size: 2, showInfobox: false, strokeColor: '#555555', fillColor: '#555555', label: {useMathJax: false, fontSize: 13, offset: [2, -12]}, visible: function () { return step >= 1; }});
    var Bpt = board.create('point', [function () { return pB()[0]; }, function () { return pB()[1]; }], {name: 'B', fixed: true, size: 2, showInfobox: false, strokeColor: '#555555', fillColor: '#555555', label: {useMathJax: false, fontSize: 13, offset: [-14, 4]}, visible: function () { return step >= 1; }});
    [pA, pB].forEach(function (c) {
        board.create('curve', [function (t) { return c()[0] + R1() * Math.cos(t); }, function (t) { return c()[1] + R1() * Math.sin(t); },
            function () { return ang(pC(), c()) - 0.3; }, function () { return ang(pC(), c()) + 0.3; }],
            JXG.merge(cs, {visible: function () { return step >= 2; }}));
    });
    board.create('point', [function () { return pC()[0]; }, function () { return pC()[1]; }], {name: 'C', fixed: true, size: 2, showInfobox: false, strokeColor: '#555555', fillColor: '#555555', label: {useMathJax: false, fontSize: 13, offset: [6, -4]}, visible: function () { return step >= 2; }});
    board.create('line', [O, function () { return pC(); }], JXG.merge(cs, {straightFirst: false, strokeWidth: 2, visible: function () { return step >= 3; }}));
    var stepText = ['', 'Step 1: an arc centred at O cuts the arms at A and B.', 'Step 2: equal arcs from A and B cross at C.', 'Step 3: the line OC is the bisector.'];
    board.create('text', [-6.6, -3.5, function () { return stepText[step]; }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14});
    board.create('button', [3.6, 6.3, 'Back', function () { step = Math.max(0, step - 1); board.update(); }], {fixed: true});
    board.create('button', [5.2, 6.3, 'Next', function () { step = Math.min(3, step + 1); board.update(); }], {fixed: true});

    board.update();
})();
