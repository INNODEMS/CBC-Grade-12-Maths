// Waves with sliders (G12 Ch10, sec-trigonometric-graphs-and-waves, lesson 2.2).
// y = a sin(bx + c) in degrees on -180 to 360, with y = sin x dotted for comparison and the mean line y = 0.
// Sliders a (-4 to 4, step 0.5, start 2), b (0.5 to 4, step 0.5, start 1), c (-180 to 180, step 15, start 30).
// Live labels: amplitude |a|, period 360/b, phase angle c, translation c/b left or right of y = a sin bx.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-wave-sliders', {
        boundingbox: [-200, 7.5, 380, -5.2],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var ax = {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false};
    board.create('segment', [[-180, 0], [360, 0]], ax);
    board.create('segment', [[0, -4.5], [0, 4.5]], ax);
    for (var t = -180; t <= 360; t += 90) {
        if (t !== 0) {
            board.create('segment', [[t, -0.12], [t, 0.12]], ax);
            board.create('text', [t - 12, -0.45, t + '°'], {fixed: true, highlight: false, useMathJax: false, fontSize: 11});
        }
    }
    for (var v = -4; v <= 4; v += 1) {
        if (v !== 0) {
            board.create('segment', [[-4, v], [4, v]], ax);
            board.create('text', [-22, v, String(v)], {fixed: true, highlight: false, useMathJax: false, fontSize: 11});
        }
    }
    var a = board.create('slider', [[-170, 6.8], [-30, 6.8], [-4, 2, 4]], {name: 'a', snapWidth: 0.5, withTicks: false});
    var b = board.create('slider', [[30, 6.8], [170, 6.8], [0.5, 1, 4]], {name: 'b', snapWidth: 0.5, withTicks: false});
    var c = board.create('slider', [[-170, 5.9], [-30, 5.9], [-180, 30, 180]], {name: 'c', snapWidth: 15, withTicks: false});
    function rad(x) { return x * Math.PI / 180; }
    board.create('functiongraph', [function (x) { return Math.sin(rad(x)); }, -180, 360], {strokeColor: '#777777', strokeWidth: 1.5, dash: 1, fixed: true, highlight: false});
    board.create('functiongraph', [function (x) { return a.Value() * Math.sin(rad(b.Value() * x + c.Value())); }, -180, 360], {strokeColor: '#1f4e9c', strokeWidth: 2.5, fixed: true, highlight: false});
    board.create('text', [60, 5.9, function () {
        var A = a.Value(), B = b.Value(), C = c.Value(), sh = C / B;
        var tr = (Math.abs(sh) < 1e-9) ? 'no translation' : (Math.abs(sh).toFixed(1).replace(/\.0$/, '') + '° to the ' + (sh > 0 ? 'left' : 'right'));
        return 'amplitude ' + Math.abs(A) + ', period ' + (360 / B).toFixed(1).replace(/\.0$/, '') + '°, phase angle ' + C + '°; ' + tr + ' of y = a sin bx';
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
})();
