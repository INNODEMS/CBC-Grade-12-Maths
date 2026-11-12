// Loci and inequalities (G12 Ch8 Loci, sec-loci-involving-inequalities).
// Draggable A and B; sliders r and theta. Three buttons cycle each condition through off, <, >, <=, >=:
//   condition 1: PA against r; condition 2: PA against PB; condition 3: angle APB against theta.
// The points that break an active condition are shaded (scanlines of a fine grid, drawn as one curve), so the region
// obeying every active condition is left clear (the book shades the unwanted region); a frame marks the sampled area;
// each active boundary is drawn solid when it belongs to the region (<=, >=) and dashed when it does not (<, >).
// A free point Q reports which conditions it obeys. If no sampled point obeys them all, a text says so.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-loci-inequalities', {
        boundingbox: [-6, 6, 6, -3],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var XMIN = -6, XMAX = 6, YMIN = -2.3, YMAX = 4.3, H = 0.06;
    var ST = ['off', '<', '>', '≤', '≥'];
    var state = [1, 2, 0];
    var rS = board.create('slider', [[-5.6, 5.5], [-2.6, 5.5], [0.5, 2.5, 5]], {name: 'r', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 14}});
    var tS = board.create('slider', [[0.6, 5.5], [3.6, 5.5], [20, 60, 160]], {name: 'θ', snapWidth: 5, precision: 0, label: {useMathJax: false, fontSize: 14}});
    var pst = {showInfobox: false, size: 4, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, fontSize: 15, offset: [-6, -16]}};
    var A = board.create('point', [-1.5, 0.8], JXG.merge(pst, {name: 'A'}));
    var B = board.create('point', [1.5, 0.8], JXG.merge(pst, {name: 'B'}));
    var Q = board.create('point', [3.5, 3], {name: 'Q', showInfobox: false, size: 4, face: '[]', strokeColor: '#b00000', fillColor: '#b00000', label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});

    function d(x, y, P) { return Math.sqrt((x - P.X()) * (x - P.X()) + (y - P.Y()) * (y - P.Y())); }
    function angle(x, y) {
        var ux = A.X() - x, uy = A.Y() - y, vx = B.X() - x, vy = B.Y() - y;
        var nu = Math.sqrt(ux * ux + uy * uy), nv = Math.sqrt(vx * vx + vy * vy);
        if (nu < 1e-9 || nv < 1e-9) { return 180; }
        var cs = (ux * vx + uy * vy) / (nu * nv);
        return Math.acos(Math.max(-1, Math.min(1, cs))) * 180 / Math.PI;
    }
    function cmp(s, a, b) {
        if (s === 1) { return a < b; }
        if (s === 2) { return a > b; }
        if (s === 3) { return a <= b; }
        return a >= b;
    }
    function vals(x, y) { return [d(x, y, A), d(x, y, A), angle(x, y)]; }
    function refs(x, y) { return [rS.Value(), d(x, y, B), tS.Value()]; }
    function obeys(x, y, k) { return cmp(state[k], vals(x, y)[k], refs(x, y)[k]); }
    function all(x, y) {
        var k;
        for (k = 0; k < 3; k++) { if (state[k] > 0 && !obeys(x, y, k)) { return false; } }
        return true;
    }
    function active() { return state[0] + state[1] + state[2] > 0; }

    // unwanted region: horizontal runs of sampled points that break a condition, separated by NaN so one curve draws them all
    var count = 0;
    board.create('polygon', [[XMIN, YMIN - H / 2], [XMAX, YMIN - H / 2], [XMAX, YMAX + H / 2], [XMIN, YMAX + H / 2]],
        {fillOpacity: 0, borders: {strokeColor: '#999999', strokeWidth: 1, fixed: true, highlight: false}, vertices: {visible: false}, fixed: true, highlight: false, hasInnerPoints: false});
    var region = board.create('curve', [[], []], {strokeColor: '#c4c4c4', strokeWidth: 3.6, strokeOpacity: 1, fixed: true, highlight: false, lineCap: 'butt'});
    region.updateDataArray = function () {
        var X = [], Y = [], x, y, inrun, x0;
        count = 0;
        if (!active()) { this.dataX = X; this.dataY = Y; return; }
        for (y = YMIN; y <= YMAX; y += H) {
            inrun = false;
            for (x = XMIN; x <= XMAX + 1e-9; x += H) {
                if (all(x, y)) { count++; }
                if (!all(x, y)) {
                    if (!inrun) { inrun = true; x0 = x; }
                } else if (inrun) {
                    X.push(x0 - H / 2, x - H / 2, NaN); Y.push(y, y, NaN); inrun = false;
                }
            }
            if (inrun) { X.push(x0 - H / 2, XMAX, NaN); Y.push(y, y, NaN); }
        }
        this.dataX = X; this.dataY = Y;
    };

    function dash(k) { return (state[k] === 1 || state[k] === 2) ? 3 : 0; }
    // condition 1 boundary: circle centre A, radius r
    var c1 = board.create('curve', [function (t) { return A.X() + rS.Value() * Math.cos(t); }, function (t) { return A.Y() + rS.Value() * Math.sin(t); }, 0, 2 * Math.PI],
        {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    // condition 2 boundary: perpendicular bisector of AB
    var c2 = board.create('perpendicular', [board.create('segment', [A, B], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false}),
        board.create('midpoint', [A, B], {visible: false, name: '', withLabel: false})], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    // condition 3 boundary: the two arcs through A and B on which angle APB = theta
    function arcCurve(s) {
        return board.create('curve', [[], []], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    }
    var arcs = [arcCurve(1), arcCurve(-1)];
    function fillArc(cv, s) {
        cv.updateDataArray = function () {
            var mx = (A.X() + B.X()) / 2, my = (A.Y() + B.Y()) / 2, dx = B.X() - A.X(), dy = B.Y() - A.Y();
            var L = Math.sqrt(dx * dx + dy * dy), th = tS.Value() * Math.PI / 180;
            var nx = -s * dy / L, ny = s * dx / L, R = L / (2 * Math.sin(th)), h = (L / 2) / Math.tan(th);
            var ox = mx + nx * h, oy = my + ny * h, X = [], Y = [], j, t, px, py;
            for (j = 0; j <= 240; j++) {
                t = 2 * Math.PI * j / 240; px = ox + R * Math.cos(t); py = oy + R * Math.sin(t);
                if ((px - mx) * nx + (py - my) * ny > -1e-9) { X.push(px); Y.push(py); } else { X.push(NaN); Y.push(NaN); }
            }
            this.dataX = X; this.dataY = Y;
        };
    }
    fillArc(arcs[0], 1); fillArc(arcs[1], -1);

    function styleBoundaries() {
        c1.setAttribute({visible: state[0] > 0, dash: dash(0)});
        c2.setAttribute({visible: state[1] > 0, dash: dash(1)});
        arcs[0].setAttribute({visible: state[2] > 0, dash: dash(2)});
        arcs[1].setAttribute({visible: state[2] > 0, dash: dash(2)});
    }
    var names = ['PA ? r', 'PA ? PB', 'angle APB ? θ'];
    var offs = ['PA and r: off', 'PA and PB: off', 'angle APB: off'];
    function label(k) { return state[k] === 0 ? offs[k] : names[k].replace('?', ST[state[k]]); }
    var buttons = [];
    function makeButton(k, x) {
        buttons[k] = board.create('button', [x, 4.85, function () { return label(k); }, function () {
            state[k] = (state[k] + 1) % 5; styleBoundaries(); board.update();
        }], {fixed: true, fontSize: 13, useMathJax: false});
    }
    makeButton(0, -5.8); makeButton(1, -2.3); makeButton(2, 1.3);
    styleBoundaries();

    board.create('text', [-5.8, -2.7, function () {
        if (!active()) { return 'Turn on at least one condition.'; }
        if (count === 0) { return 'No point obeys all the conditions.'; }
        var x = Q.X(), y = Q.Y(), out = [], k;
        for (k = 0; k < 3; k++) {
            if (state[k] > 0) { out.push('condition ' + (k + 1) + (obeys(x, y, k) ? ' yes' : ' no')); }
        }
        return 'Q: PA = ' + d(x, y, A).toFixed(2) + ', PB = ' + d(x, y, B).toFixed(2) + ', angle AQB = ' + angle(x, y).toFixed(1) + '°; ' + out.join(', ') + '. Key: shaded, not wanted; unshaded, obeys every condition.';
    }], {fixed: true, highlight: false, fontSize: 13, useMathJax: false, anchorY: 'middle', cssStyle: 'background-color: #ffffff;'});

    // test hook (no effect in the book): set the states and redraw
    board.lociTest = {set: function (s) { state = s.slice(); styleBoundaries(); board.update(); }, count: function () { return count; },
        all: all, A: A, B: B, Q: Q, r: rS, t: tS};
    board.update();
})();
