// Constant angle loci (G12 Ch8 Loci, sec-constant-angle-loci).
// A(-2.5, 0) and B(2.5, 0) are fixed; slider theta (40 to 160 degrees, step 5; the board shows the mirror arc and the centre for every value). The arc above AB is the locus of P with
// angle APB = theta: centre O(0, 2.5/tan theta), radius 2.5/sin theta (O is below AB when theta > 90). A glider P on the arc
// shows angle APB to the nearest degree. "Show centre" draws O, OA, OB and angle AOB = 2 theta; "Other side" adds the
// mirror arc below AB. A free point Q reports angle AQB, so learners see larger angles inside the arc and smaller outside.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-constant-angle-locus', {
        boundingbox: [-12, 10.5, 12, -7.5],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var deg = Math.PI / 180;
    var th = board.create('slider', [[-9.2, 9.8], [-3.6, 9.8], [40, 50, 160]], {name: '\u03b8', snapWidth: 5, precision: 0, suffixLabel: '\u03b8 = ', postLabel: '\u00b0', label: {useMathJax: false, fontSize: 14}});
    function T() { return Math.round(th.Value()) * deg; }
    function oy() { var t = T(); return Math.abs(t - Math.PI / 2) < 1e-9 ? 0 : 2.5 / Math.tan(t); }
    var black = {fixed: true, highlight: false, showInfobox: false};
    var A = board.create('point', [-2.5, 0], {name: 'A', fixed: true, showInfobox: false, size: 3, color: '#000000', label: {useMathJax: false, fontSize: 15, offset: [-16, -14]}});
    var B = board.create('point', [2.5, 0], {name: 'B', fixed: true, showInfobox: false, size: 3, color: '#000000', label: {useMathJax: false, fontSize: 15, offset: [6, -14]}});
    board.create('segment', [A, B], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    var O = board.create('point', [0, oy], {name: 'O', fixed: true, showInfobox: false, size: 3, color: '#1f4e9c', visible: false, label: {useMathJax: false, fontSize: 15, offset: [8, 0]}});
    var O2 = board.create('point', [0, function () { return -oy(); }], {visible: false, fixed: true, name: ''});
    var arc = board.create('arc', [O, B, A], {strokeColor: '#1f4e9c', strokeWidth: 3, fixed: true, highlight: false});
    var arc2 = board.create('arc', [O2, A, B], {strokeColor: '#1f4e9c', strokeWidth: 2, dash: 2, fixed: true, highlight: false, visible: false});
    var P = board.create('glider', [0, 6, arc], {name: 'P', showInfobox: false, size: 4, color: '#b00000', label: {useMathJax: false, fontSize: 15, offset: [6, 10]}});
    board.create('segment', [P, A], {strokeColor: '#b00000', strokeWidth: 1.5, fixed: true, highlight: false});
    board.create('segment', [P, B], {strokeColor: '#b00000', strokeWidth: 1.5, fixed: true, highlight: false});
    var OA = board.create('segment', [O, A], {strokeColor: '#1f4e9c', strokeWidth: 1, dash: 1, fixed: true, highlight: false, visible: false});
    var OB = board.create('segment', [O, B], {strokeColor: '#1f4e9c', strokeWidth: 1, dash: 1, fixed: true, highlight: false, visible: false});
    var Q = board.create('point', [6, 5], {name: 'Q', showInfobox: false, size: 4, face: '[]', color: '#2e7d32', label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});
    function ang(X, Y, Z) {
        var ux = X.X() - Y.X(), uy = X.Y() - Y.Y(), vx = Z.X() - Y.X(), vy = Z.Y() - Y.Y();
        var c = (ux * vx + uy * vy) / Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
        return Math.acos(Math.max(-1, Math.min(1, c))) / deg;
    }
    var showC = board.create('checkbox', [4, 9.8, 'Show centre'], {fixed: true, fontSize: 14});
    var other = board.create('checkbox', [4, 8.8, 'Other side'], {fixed: true, fontSize: 14});
    function sync() {
        var c = showC.Value(), o = other.Value();
        O.setAttribute({visible: c}); OA.setAttribute({visible: c}); OB.setAttribute({visible: c});
        arc2.setAttribute({visible: o});
        board.update();
    }
    JXG.addEvent(showC.rendNodeCheckbox, 'change', sync, showC);
    JXG.addEvent(other.rendNodeCheckbox, 'change', sync, other);
    board.create('text', [-9.6, 8.4, function () { return '\\(\\angle APB = ' + Math.round(ang(A, P, B)) + '^{\\circ}\\)'; }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-9.6, 7.3, function () { return '\\(\\angle AQB = ' + Math.round(ang(A, Q, B)) + '^{\\circ}\\)'; }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [-9.6, 6.2, function () {
        if (!showC.Value()) { return ''; }
        var t = Math.round(th.Value());
        if (t < 90) { return '\\(\\angle AOB = ' + (2 * t) + '^{\\circ} = 2\\theta\\)'; }
        if (t === 90) { return '\\(O\\) is the midpoint of \\(AB\\)'; }
        return 'reflex \\(\\angle AOB = ' + (2 * t) + '^{\\circ} = 2\\theta\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    th.on('drag', function () { board.update(); });
    board.update();
})();
