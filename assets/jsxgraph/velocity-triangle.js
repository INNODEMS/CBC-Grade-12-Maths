// The velocity triangle (G12 Ch13, sec-course-track-and-drift, lessons 5.1 and 5.2).
// Units of speed on a grid of 0.1. O is fixed; B (tip of the course arrow O->B) and C (tip of the current arrow B->C)
// snap to the grid. Dragging B carries C, so the current keeps its velocity. The track O->C has a double head.
// Readouts: course bearing and speed, current bearing and speed, track bearing, ground speed, drift angle (1 d.p.).
// "hold track": the direction of the course when ticked becomes the required track (dashed line); the current and
// the boat's speed are frozen, and B moves on its circle (steps of 0.1 degree) so learners turn the course until C
// lies on the required track. Checks: B (0, 0.5), C (0.4, 0.5) gives 0.64 and 38.7; Likoni 2.8 and 0.7 gives 14.5.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-velocity-triangle', {
        boundingbox: [-1.6, 3.6, 3.0, -1.0],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var T = {fixed: true, highlight: false, useMathJax: false};
    var k, v;
    for (k = -15; k <= 30; k++) {
        v = k / 10;
        board.create('segment', [[v, -1], [v, 3.0]], {strokeColor: (k % 5 === 0) ? '#cfcfcf' : '#eeeeee', strokeWidth: 1, fixed: true, highlight: false});
    }
    for (k = -10; k <= 30; k++) {
        v = k / 10;
        board.create('segment', [[-1.5, v], [3.0, v]], {strokeColor: (k % 5 === 0) ? '#cfcfcf' : '#eeeeee', strokeWidth: 1, fixed: true, highlight: false});
    }
    // north arrow
    board.create('arrow', [[-1.3, 2.3], [-1.3, 2.9]], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    board.create('text', [-1.36, 3.0, 'N'], Object.assign({fontSize: 14}, T));
    function r1(x) { return Math.round(x * 10) / 10; }
    function brg(e, n) { var b = Math.atan2(e, n) * 180 / Math.PI; return (b + 360) % 360; }
    function b3(b) { var s = (Math.round(b * 10) / 10).toFixed(1); if (s === '360.0') { s = '0.0'; } while (s.length < 5) { s = '0' + s; } return s + '°'; }
    var O = board.create('point', [0, 0], {name: 'O', fixed: true, size: 2, strokeColor: '#000000', fillColor: '#000000',
        label: {useMathJax: false, offset: [-14, -10]}});
    var pt = {size: 5, withLabel: true, strokeWidth: 2, fillColor: '#ffffff', label: {useMathJax: false, offset: [8, 8]}};
    var B = board.create('point', [0, 0.5], Object.assign({name: 'B', strokeColor: '#1f4e9c'}, pt));
    var C = board.create('point', [0.4, 0.5], Object.assign({name: 'C', strokeColor: '#000000'}, pt));
    var ux = 0.4, uy = 0, hold = false, hb = 0, hs = 0;
    function cl(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
    B.on('drag', function () {
        if (hold) {
            var a = Math.round(brg(B.X(), B.Y()) * 10) / 10 * Math.PI / 180;
            B.moveTo([hs * Math.sin(a), hs * Math.cos(a)]);
        } else {
            B.moveTo([cl(r1(B.X()), -1.5, 3.0), cl(r1(B.Y()), -1, 3.0)]);
        }
        C.moveTo([B.X() + ux, B.Y() + uy]);
    });
    C.on('drag', function () {
        if (hold) { C.moveTo([B.X() + ux, B.Y() + uy]); return; }
        C.moveTo([cl(r1(C.X()), -1.5, 3.0), cl(r1(C.Y()), -1, 3.0)]);
        ux = r1(C.X() - B.X()); uy = r1(C.Y() - B.Y());
    });
    board.create('arrow', [O, B], {strokeColor: '#1f4e9c', strokeWidth: 3, fixed: true, highlight: false});
    board.create('arrow', [B, C], {strokeColor: '#000000', strokeWidth: 2, dash: 2, fixed: true, highlight: false});
    // track: a double head drawn as two arrow heads on O->C and O->(0.9 of C)
    var trk = {strokeColor: '#555555', strokeWidth: 4, fixed: true, highlight: false,
        visible: function () { return Math.abs(C.X()) + Math.abs(C.Y()) > 1e-9; }};
    board.create('arrow', [O, C], trk);
    board.create('arrow', [O, [function () { return 0.92 * C.X(); }, function () { return 0.92 * C.Y(); }]], trk);
    // required track (hold)
    board.create('segment', [O, [function () { return 2.9 * Math.sin(hb * Math.PI / 180); }, function () { return 2.9 * Math.cos(hb * Math.PI / 180); }]],
        {strokeColor: '#000000', strokeWidth: 1, dash: 3, fixed: true, highlight: false, visible: function () { return hold; }});
    var cb = board.create('checkbox', [1.2, 3.35, 'hold track'], {fixed: true, label: {useMathJax: false, fontSize: 14}});
    JXG.addEvent(cb.rendNodeCheckbox, 'change', function () {
        hold = !!cb.rendNodeCheckbox.checked;
        if (hold) { hb = brg(B.X(), B.Y()); hs = Math.sqrt(B.X() * B.X() + B.Y() * B.Y()); ux = C.X() - B.X(); uy = C.Y() - B.Y(); }
        board.update();
    }, cb);
    function course() { return brg(B.X(), B.Y()); }
    function track() { return brg(C.X(), C.Y()); }
    function drift() { var d = Math.abs(((track() - course() + 540) % 360) - 180); return d; }
    function sp(x, y) { return Math.sqrt(x * x + y * y); }
    board.create('text', [-1.5, 3.45, function () {
        return 'course ' + b3(course()) + ' at ' + sp(B.X(), B.Y()).toFixed(1) + ';  current towards ' + b3(brg(C.X() - B.X(), C.Y() - B.Y())) +
            ' at ' + sp(C.X() - B.X(), C.Y() - B.Y()).toFixed(1);
    }], Object.assign({fontSize: 13}, T));
    board.create('text', [-1.5, -0.6, function () {
        return 'track ' + b3(track()) + ',  ground speed ' + sp(C.X(), C.Y()).toFixed(1) + ',  drift ' + drift().toFixed(1) + '°';
    }], Object.assign({fontSize: 14}, T));
    board.create('text', [-1.5, -0.85, function () {
        if (!hold) { return 'The double arrow O→C is the track. Drag B and C.'; }
        var off = Math.abs(((course() - hb + 540) % 360) - 180);
        var on = Math.abs(((track() - hb + 540) % 360) - 180) < 0.05;
        return 'required track ' + b3(hb) + ';  course is ' + off.toFixed(1) + '° from it' + (on ? ':  on track' : '');
    }], Object.assign({fontSize: 13}, T));
})();
