// The perpendicular bisector locus (G12 Ch8 Loci, sec-perpendicular-bisector-loci).
// A and B are draggable. A free point P shows PA and PB (1 d.p.); when they agree within 0.05 it leaves a dot
// (at most 200; Clear removes them; moving A or B clears them). "Show the locus" draws the bisector.
// Next and Back step through the compass construction: arcs from A, arcs from B, the line through the crossings.
// The compass radius is 0.7 AB, more than half of AB, so the arcs always meet.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-perpendicular-bisector-locus', {
        boundingbox: [-1, 8, 11, -1],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var ptStyle = {showInfobox: false, size: 4, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [-14, -12]}};
    var A = board.create('point', [3, 2.5], JXG.merge(ptStyle, {name: 'A'}));
    var B = board.create('point', [7, 4.5], JXG.merge(ptStyle, {name: 'B', label: {useMathJax: false, fontSize: 15, offset: [8, -12]}}));
    var P = board.create('point', [3.5, 6], {name: 'P', showInfobox: false, size: 4, strokeColor: '#b00000', fillColor: '#b00000', label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});
    board.create('segment', [A, B], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    board.create('segment', [P, A], {strokeColor: '#b00000', strokeWidth: 1, dash: 2, fixed: true, highlight: false});
    board.create('segment', [P, B], {strokeColor: '#b00000', strokeWidth: 1, dash: 2, fixed: true, highlight: false});

    function pa() { return P.Dist(A); }
    function pb() { return P.Dist(B); }
    board.create('text', [-0.6, 7.4, function () {
        return '\\(PA = ' + pa().toFixed(1) + '\\), \\(PB = ' + pb().toFixed(1) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 16, anchorY: 'middle'});

    // dots where PA = PB
    var dots = [];
    function clearDots() {
        var k;
        for (k = 0; k < dots.length; k++) { board.removeObject(dots[k]); }
        dots = [];
    }
    function checkDot() {
        if (Math.abs(pa() - pb()) < 0.05 && dots.length < 200) {
            dots.push(board.create('point', [P.X(), P.Y()], {name: '', fixed: true, size: 2, strokeColor: '#2a7a2a', fillColor: '#2a7a2a', showInfobox: false, highlight: false}));
        }
    }
    P.on('drag', checkDot);
    P.on('up', checkDot);
    A.on('drag', clearDots);
    B.on('drag', clearDots);

    // geometry of the construction
    function mid() { return [(A.X() + B.X()) / 2, (A.Y() + B.Y()) / 2]; }
    function len() { return A.Dist(B); }
    function rad() { return 0.7 * len(); }
    function ux() { return (B.X() - A.X()) / len(); }
    function uy() { return (B.Y() - A.Y()) / len(); }
    function h() { var r = rad(), l = len() / 2; return Math.sqrt(r * r - l * l); }
    function cross(s) { var m = mid(); return [m[0] - s * h() * uy(), m[1] + s * h() * ux()]; }

    var step = 0;
    function arcFrom(centre, s) {
        // short arc of radius rad() about centre, around the crossing point on side s
        return board.create('curve', [function (t) {
            var c = cross(s), a0 = Math.atan2(c[1] - centre.Y(), c[0] - centre.X());
            return centre.X() + rad() * Math.cos(a0 + t);
        }, function (t) {
            var c = cross(s), a0 = Math.atan2(c[1] - centre.Y(), c[0] - centre.X());
            return centre.Y() + rad() * Math.sin(a0 + t);
        }, -0.35, 0.35], {strokeColor: '#555555', strokeWidth: 1.5, fixed: true, highlight: false, visible: false});
    }
    var steps = [[], [arcFrom(A, 1), arcFrom(A, -1)], [arcFrom(B, 1), arcFrom(B, -1)],
        [board.create('segment', [function () { return cross(1); }, function () { return cross(-1); }],
            {strokeColor: '#555555', strokeWidth: 1.5, fixed: true, highlight: false, visible: false})]];
    function refresh() {
        var k, j;
        for (k = 1; k <= 3; k++) { for (j = 0; j < steps[k].length; j++) { steps[k][j].setAttribute({visible: step >= k}); } }
        locus.setAttribute({visible: show.Value()});
        board.update();
    }
    var stepText = ['', 'Step 1: compasses more than half of AB; arcs from A', 'Step 2: same radius; arcs from B', 'Step 3: join the crossing points'];
    board.create('text', [-0.6, -0.5, function () { return stepText[step]; }], {fixed: true, highlight: false, fontSize: 14, useMathJax: false, anchorY: 'middle'});
    board.create('button', [5.2, 7.4, 'Back', function () { if (step > 0) { step -= 1; refresh(); } }], {fixed: true});
    board.create('button', [6.6, 7.4, 'Next', function () { if (step < 3) { step += 1; refresh(); } }], {fixed: true});
    board.create('button', [8.0, 7.4, 'Clear', function () { clearDots(); board.update(); }], {fixed: true});

    // the locus itself
    var show = board.create('checkbox', [-0.6, 6.6, 'Show the locus'], {fixed: true, useMathJax: false, fontSize: 14});
    var locus = board.create('line', [function () { return cross(1); }, function () { return cross(-1); }],
        {strokeColor: '#2a7a2a', strokeWidth: 2.5, fixed: true, highlight: false, visible: false});
    JXG.addEvent(show.rendNodeCheckbox, 'change', refresh, show);

    // test hook for headless checks (no effect in the book)
    board.locusTest = {A: A, B: B, P: P, dots: function () { return dots.length; }, checkDot: checkDot, step: function () { return step; },
        next: function () { if (step < 3) { step += 1; refresh(); } }, show: show, locus: locus, refresh: refresh, steps: steps};
    refresh();
})();
