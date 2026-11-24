// Tree diagram explorer (G12 Ch16, sec-tree-diagrams, lesson 5.1).
// A two-stage tree: first stage A / not A, second stage B / not B. Three sliders set P(A),
// P(B after A) and P(B after not A), from 0 to 1 in steps of 0.05; the other branch of each pair
// shows 1 minus the slider. The four path products and P(B) are shown to 4 decimal places.
// The checkbox "same second stage" makes P(B after not A) equal to P(B after A) (independent
// stages); the third slider is then ignored.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-tree-diagram-explorer', {
        boundingbox: [-0.5, 7.2, 12.5, -4.6],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var lab = {useMathJax: false};
    var sA = board.create('slider', [[0.6, 6.5], [4.6, 6.5], [0, 0.6, 1]], {name: 'P(A)', snapWidth: 0.05, precision: 2, withTicks: false, label: lab});
    var sB1 = board.create('slider', [[0.6, 5.7], [4.6, 5.7], [0, 0.7, 1]], {name: 'P(B after A)', snapWidth: 0.05, precision: 2, withTicks: false, label: lab});
    var sB2 = board.create('slider', [[0.6, 4.9], [4.6, 4.9], [0, 0.3, 1]], {name: 'P(B after not A)', snapWidth: 0.05, precision: 2, withTicks: false, label: lab});
    var same = board.create('checkbox', [8.4, 6.5, 'same second stage'], {fixed: true});
    board.create('text', [8.4, 5.7, function () { return same.Value() ? 'P(B after not A) = P(B after A)' : ''; }],
        {fixed: true, highlight: false, useMathJax: false, fontSize: 12, anchorY: 'middle'});

    function p() { return sA.Value(); }
    function q1() { return sB1.Value(); }
    function q2() { return same.Value() ? sB1.Value() : sB2.Value(); }
    function f(v) { return v.toFixed(2); }
    function f4(v) { return v.toFixed(4); }

    var st = {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false};
    var tx = {fixed: true, highlight: false, useMathJax: false, fontSize: 13, anchorY: 'middle'};
    function seg(x1, y1, x2, y2) { board.create('segment', [[x1, y1], [x2, y2]], st); }
    function text(x, y, s, ax) { var o = {}; for (var k in tx) { o[k] = tx[k]; } o.anchorX = ax; return board.create('text', [x, y, s], o); }

    // first stage
    seg(0, 0, 3.4, 1.9); seg(0, 0, 3.4, -1.9);
    text(1.5, 1.4, function () { return f(p()); }, 'right');
    text(1.5, -1.4, function () { return f(1 - p()); }, 'right');
    text(3.5, 1.9, 'A', 'left');
    text(3.5, -1.9, 'not A', 'left');
    // second stage
    seg(4.9, 1.9, 7.6, 2.85); seg(4.9, 1.9, 7.6, 0.95);
    seg(4.9, -1.9, 7.6, -0.95); seg(4.9, -1.9, 7.6, -2.85);
    text(6.1, 2.75, function () { return f(q1()); }, 'right');
    text(6.1, 1.05, function () { return f(1 - q1()); }, 'right');
    text(6.1, -1.05, function () { return f(q2()); }, 'right');
    text(6.1, -2.75, function () { return f(1 - q2()); }, 'right');
    text(7.7, 2.85, 'B', 'left'); text(7.7, 0.95, 'not B', 'left');
    text(7.7, -0.95, 'B', 'left'); text(7.7, -2.85, 'not B', 'left');
    // path products
    text(9.0, 2.85, function () { return 'A and B: ' + f4(p() * q1()); }, 'left');
    text(9.0, 0.95, function () { return 'A and not B: ' + f4(p() * (1 - q1())); }, 'left');
    text(9.0, -0.95, function () { return 'not A and B: ' + f4((1 - p()) * q2()); }, 'left');
    text(9.0, -2.85, function () { return 'not A and not B: ' + f4((1 - p()) * (1 - q2())); }, 'left');
    // totals
    text(0, -3.9, function () { return 'P(B) = ' + f4(p() * q1() + (1 - p()) * q2()); }, 'left');
    text(4.6, -3.9, function () {
        var t = p() * q1() + p() * (1 - q1()) + (1 - p()) * q2() + (1 - p()) * (1 - q2());
        return 'Sum of the four paths = ' + f4(t);
    }, 'left');
})();
