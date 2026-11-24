// Shear (G12 Ch6, sec-shear, lesson 6.6).
// Rectangle O(0, 0), (3, 0), (3, 2), (0, 2) (solid) and its image (dashed) under a shear with shear factor k.
// Slider "shear factor" from -3 to 3, step 0.25 (start 0). Buttons choose the invariant axis (x-axis at the start), drawn thick.
// Text: the matrix, where (3, 2) goes, and the areas (always 6).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-shear-slider', {
        boundingbox: [-7, 12.5, 16, -10.5],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var g = {strokeColor: '#e3e3e3', strokeWidth: 1, fixed: true, highlight: false};
    var i;
    for (i = -6; i <= 15; i++) { board.create('segment', [[i, -10], [i, 12]], g); }
    for (i = -10; i <= 12; i++) { board.create('segment', [[-6, i], [15, i]], g); }
    var ax = {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false, lastArrow: true};
    board.create('arrow', [[-6, 0], [15.6, 0]], ax);
    board.create('arrow', [[0, -10], [0, 12.2]], ax);
    var tl = {fixed: true, highlight: false, useMathJax: false, fontSize: 13};
    board.create('text', [15.3, -0.7, 'x'], tl);
    board.create('text', [-0.8, 11.9, 'y'], tl);
    board.create('text', [-0.8, -0.7, 'O'], tl);
    for (i = -4; i <= 14; i += 2) { if (i !== 0) { board.create('text', [i - 0.25, -0.7, String(i)], tl); } }
    for (i = -8; i <= 10; i += 2) { if (i !== 0) { board.create('text', [-1.3, i, String(i)], tl); } }

    var axis = 'x';
    var k = board.create('slider', [[5, 11.5], [11.5, 11.5], [-3, 0, 3]], {name: 'shear factor', snapWidth: 0.25, precision: 2, withTicks: false});
    board.create('button', [5, 10.2, 'x-axis invariant', function () { axis = 'x'; board.update(); }], {fixed: true});
    board.create('button', [10, 10.2, 'y-axis invariant', function () { axis = 'y'; board.update(); }], {fixed: true});

    board.create('segment', [[-6, 0], [15, 0]], {strokeColor: '#000000', strokeWidth: 5, fixed: true, highlight: false,
        visible: function () { return axis === 'x'; }});
    board.create('segment', [[0, -10], [0, 12]], {strokeColor: '#000000', strokeWidth: 5, fixed: true, highlight: false,
        visible: function () { return axis === 'y'; }});

    var rect = [[0, 0], [3, 0], [3, 2], [0, 2]];
    board.create('polygon', rect, {fillColor: '#1f4e9c', fillOpacity: 0.15, vertices: {visible: false},
        borders: {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false}, fixed: true, highlight: false});
    function im(p) {
        var K = k.Value();
        return axis === 'x' ? [p[0] + K * p[1], p[1]] : [p[0], p[1] + K * p[0]];
    }
    var img = rect.map(function (p) {
        return board.create('point', [function () { return im(p)[0]; }, function () { return im(p)[1]; }], {visible: false});
    });
    board.create('polygon', img, {fillColor: '#000000', fillOpacity: 0.05, vertices: {visible: false},
        borders: {strokeColor: '#000000', strokeWidth: 2, dash: 2, fixed: true, highlight: false}, fixed: true, highlight: false});
    board.create('point', [function () { return im([3, 2])[0]; }, function () { return im([3, 2])[1]; }],
        {name: '', size: 3, fixed: true, highlight: false, strokeColor: '#000000', fillColor: '#000000'});

    function f(v) { return (Math.round(v * 100) / 100).toString(); }
    board.create('text', [5, 8, function () {
        var K = f(k.Value());
        var m = axis === 'x' ? '1 & ' + K + ' \\\\ 0 & 1' : '1 & 0 \\\\ ' + K + ' & 1';
        return '\\(M = \\begin{bmatrix} ' + m + ' \\end{bmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [5, 5.6, function () {
        var p = im([3, 2]);
        return '(3, 2) goes to (' + f(p[0]) + ', ' + f(p[1]) + ')';
    }], {fixed: true, highlight: false, fontSize: 15, useMathJax: false});
    board.create('text', [5, 4.2, 'Area of rectangle = 6, area of image = 6'], {fixed: true, highlight: false, fontSize: 15, useMathJax: false});
})();
