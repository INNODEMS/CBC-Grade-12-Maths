// Percentile reader (G12 Ch15, sec-quartiles-deciles-and-percentiles-for-grouped-data).
// Masses of 50 goats at Garissa market, classes 15-19 to 40-44 kg (boundaries 14.5 to 44.5).
// A slider p (0 to 100, whole numbers) sets a cumulative frequency p% of 50. A dashed line goes
// across from it to the curve (straight segments) and down to the mass axis; the label gives
// the reading. Buttons set p to 25, 50 and 75.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-ogive-percentile-reader', {
        boundingbox: [2, 72, 60, -10],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var xs = [14.5, 19.5, 24.5, 29.5, 34.5, 39.5, 44.5];
    var cs = [0, 3, 10, 22, 36, 45, 50];
    var n = 50;
    var i;

    // grid: 1 kg across, 2 goats up; axes from 10 to 50 kg and 0 to 50 goats
    for (i = 10; i <= 50; i += 1) {
        board.create('segment', [[i, 0], [i, 50]], {strokeColor: (i % 5 === 0) ? '#c8c8c8' : '#ececec', strokeWidth: (i % 5 === 0) ? 1 : 0.5, fixed: true, highlight: false});
    }
    for (i = 0; i <= 50; i += 2) {
        board.create('segment', [[10, i], [50, i]], {strokeColor: (i % 10 === 0) ? '#c8c8c8' : '#ececec', strokeWidth: (i % 10 === 0) ? 1 : 0.5, fixed: true, highlight: false});
    }
    board.create('segment', [[10, 0], [50, 0]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    board.create('segment', [[10, 0], [10, 50]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    for (i = 10; i <= 50; i += 5) {
        board.create('text', [i, -3, String(i)], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    }
    for (i = 0; i <= 50; i += 10) {
        board.create('text', [9.3, i, String(i)], {anchorX: 'right', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    }
    board.create('text', [30, -7.5, 'Mass (kg)'], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    board.create('text', [3, 53, 'Cumulative frequency'], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});

    // the curve: straight segments between the plotted points
    var pts = [];
    for (i = 0; i < xs.length; i++) {
        pts.push(board.create('point', [xs[i], cs[i]], {name: '', size: 2, fixed: true, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', showInfobox: false}));
    }
    for (i = 0; i < xs.length - 1; i++) {
        board.create('segment', [pts[i], pts[i + 1]], {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false});
    }

    // slider and buttons above the graph
    var p = board.create('slider', [[12, 64], [34, 64], [0, 50, 100]], {
        name: 'p', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}
    });
    function setP(v) { p.setValue(v); board.update(); }
    board.create('button', [45, 66, '25%', function () { setP(25); }], {useMathJax: false});
    board.create('button', [49.5, 66, '50%', function () { setP(50); }], {useMathJax: false});
    board.create('button', [54, 66, '75%', function () { setP(75); }], {useMathJax: false});

    function level() { return Math.round(p.Value()) * n / 100; }
    function massAt(c) {
        for (var k = 1; k < xs.length; k++) {
            if (c <= cs[k]) {
                return xs[k - 1] + (c - cs[k - 1]) / (cs[k] - cs[k - 1]) * (xs[k] - xs[k - 1]);
            }
        }
        return xs[xs.length - 1];
    }

    // the reading lines
    board.create('segment', [[10, level], [function () { return massAt(level()); }, level]], {strokeColor: '#b03a2e', strokeWidth: 2, dash: 2, fixed: true, highlight: false});
    board.create('segment', [[function () { return massAt(level()); }, level], [function () { return massAt(level()); }, 0]], {strokeColor: '#b03a2e', strokeWidth: 2, dash: 2, fixed: true, highlight: false});
    board.create('point', [function () { return massAt(level()); }, level], {name: '', size: 3, fixed: true, strokeColor: '#b03a2e', fillColor: '#ffffff', showInfobox: false});

    board.create('text', [14, 58, function () {
        var pv = Math.round(p.Value());
        return pv + '% of the 50 goats (' + level() + ' goats) weigh less than ' + massAt(level()).toFixed(1) + ' kg';
    }], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 14});
})();
