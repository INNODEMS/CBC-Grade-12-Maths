// Coin and die simulator (G12 Ch16, sec-discrete-probability, lesson 2.1).
// Buttons choose the experiment (a coin landing heads, or a die showing a six) and run 1, 10
// or 100 more trials. The board plots the relative frequency of a success against the number
// of trials as a joined line, with a dashed line at the theoretical probability (1/2 or 1/6).
// The horizontal axis runs to 1000 trials and rescales to 2000 and then 5000; the simulation
// stops at 5000 trials. Plotting uses scaled coordinates: x = trials / nmax.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-probability-simulator', {
        boundingbox: [-0.16, 1.32, 1.06, -0.2],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var MAXN = 5000;
    var die = false;           // false: coin, success = heads; true: die, success = a six
    var n = 0, k = 0;
    var xs = [0], ys = [0];    // trials and relative frequencies (point 0 is not drawn)
    var nmax = 1000;
    var i;
    var fixedText = {fixed: true, highlight: false, useMathJax: false, fontSize: 12};

    function theory() { return die ? 1 / 6 : 1 / 2; }

    // axes
    board.create('segment', [[0, 0], [1, 0]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    board.create('segment', [[0, 0], [0, 1]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    for (i = 0; i <= 10; i++) {
        board.create('segment', [[0, i / 10], [1, i / 10]], {strokeColor: '#e3e3e3', strokeWidth: 0.6, fixed: true, highlight: false});
        if (i % 2 === 0) {
            board.create('text', [-0.015, i / 10, (i / 10).toFixed(1)], {anchorX: 'right', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 12});
        }
    }
    var tickLabels = [];
    for (i = 0; i <= 5; i++) {
        board.create('segment', [[i / 5, 0], [i / 5, -0.02]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false});
        (function (j) {
            tickLabels.push(board.create('text', [j / 5, -0.06, function () { return String(j * nmax / 5); }],
                {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 12}));
        })(i);
    }
    board.create('text', [0.5, -0.15, 'Number of trials'], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [-0.15, 1.06, 'Relative frequency'], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 13});

    // dashed line at the theoretical probability, and its label
    board.create('segment', [[0, function () { return theory(); }], [1, function () { return theory(); }]],
        {strokeColor: '#000000', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false});
    board.create('text', [1.005, function () { return theory(); }, function () { return die ? '1/6' : '1/2'; }],
        {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 12});

    // the relative-frequency line
    var curve = board.create('curve', [[], []], {strokeColor: '#1f4e9c', strokeWidth: 2, highlight: false});
    function redraw() {
        var X = [], Y = [];
        for (var j = 1; j < xs.length; j++) { X.push(xs[j] / nmax); Y.push(ys[j]); }
        curve.dataX = X;
        curve.dataY = Y;
        board.update();
    }

    function run(m) {
        for (var j = 0; j < m && n < MAXN; j++) {
            n += 1;
            if (die ? (Math.floor(Math.random() * 6) === 5) : (Math.random() < 0.5)) { k += 1; }
            xs.push(n);
            ys.push(k / n);
        }
        while (n > nmax && nmax < MAXN) { nmax = (nmax === 1000) ? 2000 : 5000; }
        redraw();
    }

    function reset() {
        n = 0; k = 0; xs = [0]; ys = [0]; nmax = 1000;
        redraw();
    }

    // status line
    board.create('text', [0.02, 1.13, function () {
        var s = (die ? 'Die: a six. ' : 'Coin: heads. ') + 'Trials: ' + n + ', successes: ' + k;
        s += ', relative frequency: ' + (n > 0 ? (k / n).toFixed(4) : '-');
        if (n >= MAXN) { s += ' (limit reached: press Reset)'; }
        return s;
    }], fixedText);

    // buttons
    board.create('button', [-0.08, 1.25, 'Coin: heads', function () { die = false; reset(); }], {fixed: true});
    board.create('button', [0.13, 1.25, 'Die: a six', function () { die = true; reset(); }], {fixed: true});
    board.create('button', [0.33, 1.25, '1 trial', function () { run(1); }], {fixed: true});
    board.create('button', [0.48, 1.25, '10 trials', function () { run(10); }], {fixed: true});
    board.create('button', [0.65, 1.25, '100 trials', function () { run(100); }], {fixed: true});
    board.create('button', [0.86, 1.25, 'Reset', function () { reset(); }], {fixed: true});

    redraw();
})();
