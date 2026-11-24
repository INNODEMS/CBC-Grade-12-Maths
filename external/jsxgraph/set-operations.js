// Set operations on two circles (G12 Ch1 Sets, sec-operations-on-sets, lessons 4.1 and 4.2; Core and Essential).
// A rectangle is the universal set; circles A and B (fixed radii, B smaller so that it can lie inside A) move by
// dragging their centres P and Q,
// which are kept inside the rectangle so the circles never leave it. Four buttons choose the set to shade:
// A u B, A n B, A - B, A'. The shading is hatched (a curve of short parallel segments), never colour alone,
// and a text names the set in words. When the circles do not meet, A n B is reported as empty.
// Checks: circles apart (A n B empty, A - B = A), overlapping, B inside A (A u B = A, A n B = B).
// B's radius (0.95) is smaller than A's: with equal radii one circle could only be
// inside the other by landing exactly on it, so the instructions' question could not be explored.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-set-operations', {
        boundingbox: [-5, 4.1, 5, -3.4],
        keepAspectRatio: true, axis: false, grid: false,
        showCopyright: false, showNavigation: false,
        pan: {enabled: false}, zoom: {enabled: false}
    });
    var X0 = -4.6, X1 = 4.6, Y0 = -2.4, Y1 = 3.0, R = 1.5, RB = 0.95;
    function F(o) { var r = {fixed: true, highlight: false}, k; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function txt(o) { var r = F({useMathJax: false, fontSize: 14}), k; o = o || {}; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    board.create('polygon', [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]], F({fillOpacity: 0, vertices: {visible: false},
        borders: {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false}}));
    board.create('text', [X0 + 0.15, Y1 - 0.3, 'ξ'], txt({fontSize: 18, cssStyle: 'font-style: italic'}));

    var P = board.create('point', [-1.1, 0.3], {name: 'P', size: 3, strokeColor: '#000000', fillColor: '#ffffff', showInfobox: false,
        label: {useMathJax: false, fontSize: 12, offset: [6, -10]}});
    var Q = board.create('point', [1.1, 0.3], {name: 'Q', size: 3, strokeColor: '#000000', fillColor: '#ffffff', showInfobox: false,
        label: {useMathJax: false, fontSize: 12, offset: [6, -10]}});
    function keepIn(p, r) {
        p.on('drag', function () {
            p.moveTo([clamp(p.X(), X0 + r, X1 - r), clamp(p.Y(), Y0 + r, Y1 - r)]);
        });
    }
    keepIn(P, R); keepIn(Q, RB);
    board.create('circle', [P, R], F({strokeColor: '#000000', strokeWidth: 2, fillOpacity: 0}));
    board.create('circle', [Q, RB], F({strokeColor: '#000000', strokeWidth: 2, fillOpacity: 0}));
    board.create('text', [function () { return P.X() - 1.25; }, function () { return P.Y() + 1.3; }, 'A'], txt({fontSize: 18, cssStyle: 'font-style: italic'}));
    board.create('text', [function () { return Q.X() + 0.7; }, function () { return Q.Y() + 0.95; }, 'B'], txt({fontSize: 18, cssStyle: 'font-style: italic'}));

    var mode = 'union';
    function inA(x, y) { return (x - P.X()) * (x - P.X()) + (y - P.Y()) * (y - P.Y()) < R * R; }
    function inB(x, y) { return (x - Q.X()) * (x - Q.X()) + (y - Q.Y()) * (y - Q.Y()) < RB * RB; }
    function inSet(x, y) {
        if (x <= X0 || x >= X1 || y <= Y0 || y >= Y1) { return false; }
        if (mode === 'union') { return inA(x, y) || inB(x, y); }
        if (mode === 'inter') { return inA(x, y) && inB(x, y); }
        if (mode === 'diff') { return inA(x, y) && !inB(x, y); }
        return !inA(x, y);
    }
    // hatching: lines y = x - c, sampled; runs inside the set become segments separated by NaN
    var hatch = board.create('curve', [[], []], F({strokeColor: '#1f5fa8', strokeWidth: 1.5}));
    hatch.updateDataArray = function () {
        var xs = [], ys = [], c, t, x, y, on, sx, sy, h = 0.02;
        for (c = -10; c <= 10; c += 0.25) {
            on = false;
            for (t = X0; t <= X1 + h; t += h) {
                x = t; y = t - c;
                if (inSet(x, y)) {
                    if (!on) { sx = x; sy = y; on = true; }
                } else if (on) {
                    xs.push(sx, x - h, NaN); ys.push(sy, y - h, NaN); on = false;
                }
            }
            if (on) { xs.push(sx, X1, NaN); ys.push(sy, X1 - c, NaN); }
        }
        this.dataX = xs; this.dataY = ys;
    };
    function words() {
        var d = Math.sqrt((P.X() - Q.X()) * (P.X() - Q.X()) + (P.Y() - Q.Y()) * (P.Y() - Q.Y()));
        var inside = d <= R - RB, apart = d >= R + RB;
        if (mode === 'union') { return inside ? 'A ∪ B = A: B lies inside A.' : 'A ∪ B: everything in A or B or both.'; }
        if (mode === 'inter') { return apart ? 'A ∩ B is empty: the circles do not meet.' : (inside ? 'A ∩ B = B: B lies inside A.' : 'A ∩ B: everything in both A and B.'); }
        if (mode === 'diff') { return apart ? 'A − B = A: the circles do not meet.' : 'A − B: everything in A that is not in B.'; }
        return 'A′: everything in ξ that is not in A.';
    }
    board.create('text', [X0, -2.95, words], txt({fontSize: 15}));
    function choose(m) { return function () { mode = m; board.update(); }; }
    board.create('button', [-4.6, 3.65, 'A ∪ B', choose('union')], {fixed: true});
    board.create('button', [-2.3, 3.65, 'A ∩ B', choose('inter')], {fixed: true});
    board.create('button', [0.0, 3.65, 'A − B', choose('diff')], {fixed: true});
    board.create('button', [2.3, 3.65, 'A′', choose('comp')], {fixed: true});
    board.update();
})();
