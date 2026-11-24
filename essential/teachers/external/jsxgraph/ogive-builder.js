// Build an ogive (G12 Ch15, sec-cumulative-frequency-curves).
// Journey times to school, classes 5-14 to 55-64 minutes (class boundaries 4.5 to 64.5).
// Six frequency sliders (0 to 20, whole numbers). The cumulative frequency points sit at the
// upper class boundaries, start at (4.5, 0), and are joined by straight line segments.
// The last point always sits at the total frequency n.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-ogive-builder', {
        boundingbox: [-14, 132, 110, -30],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var lo = [5, 15, 25, 35, 45, 55];
    var start = [0, 4, 9, 13, 8, 4, 2];   // index 0 unused; D13 frequencies
    var ucb = [4.5, 14.5, 24.5, 34.5, 44.5, 54.5, 64.5];
    var i;

    // grid and axes: x 0 to 70 (minutes), y 0 to 120 (cumulative frequency)
    for (i = 0; i <= 70; i += 5) {
        board.create('segment', [[i, 0], [i, 120]], {strokeColor: '#dddddd', strokeWidth: (i % 10 === 0) ? 1 : 0.5, fixed: true, highlight: false});
    }
    for (i = 0; i <= 120; i += 10) {
        board.create('segment', [[0, i], [70, i]], {strokeColor: '#dddddd', strokeWidth: (i % 20 === 0) ? 1 : 0.5, fixed: true, highlight: false});
    }
    board.create('segment', [[0, 0], [70, 0]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    board.create('segment', [[0, 0], [0, 120]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    for (i = 0; i <= 70; i += 10) {
        board.create('text', [i, -6, String(i)], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    }
    for (i = 0; i <= 120; i += 20) {
        board.create('text', [-2, i, String(i)], {anchorX: 'right', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    }
    board.create('text', [35, -15, 'Time (minutes)'], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    board.create('text', [1, 127, 'Cumulative frequency'], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});

    // sliders on the right, one per class
    var sl = [null];
    for (i = 1; i <= 6; i++) {
        var y = 120 - (i - 1) * 18;
        sl.push(board.create('slider', [[74, y], [90, y], [0, start[i], 20]], {
            name: lo[i - 1] + '–' + (lo[i - 1] + 9),
            snapWidth: 1, precision: 0, withTicks: false,
            label: {useMathJax: false}
        }));
    }
    board.create('text', [74, 128, 'Frequencies'], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});

    function cf(k) {
        var s = 0;
        for (var t = 1; t <= k; t++) { s += Math.round(sl[t].Value()); }
        return s;
    }

    // the cumulative frequency points and the joining segments
    var pts = [board.create('point', [4.5, 0], {name: '', size: 3, fixed: true, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', showInfobox: false})];
    for (i = 1; i <= 6; i++) {
        (function (k) {
            pts.push(board.create('point', [ucb[k], function () { return cf(k); }], {
                name: function () { return String(cf(k)); },
                size: 3, fixed: true, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', showInfobox: false,
                label: {useMathJax: false, offset: [-14, 10]}
            }));
        })(i);
    }
    for (i = 0; i < 6; i++) {
        board.create('segment', [pts[i], pts[i + 1]], {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false});
    }
    board.create('text', [74, 8, function () { return 'Total n = ' + cf(6); }], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 14});
})();
