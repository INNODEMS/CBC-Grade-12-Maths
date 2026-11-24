// Stretch (G12 Ch6, sec-stretch, lesson 6.5).
// House (2, 1), (4, 1), (4, 3), (3, 4), (2, 3) (solid) and its image (dashed) under a stretch with stretch factor k.
// Slider k from 0.25 to 4, step 0.25 (start 1). Buttons choose the invariant axis (x-axis at the start), drawn thick.
// Text: the matrix and the areas (house 5, image 5k).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-stretch-slider', {
        boundingbox: [-2, 17.5, 17.5, -2],
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
    for (i = -1; i <= 17; i++) {
        board.create('segment', [[i, -1], [i, 17]], g);
        board.create('segment', [[-1, i], [17, i]], g);
    }
    var ax = {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false, lastArrow: true};
    board.create('arrow', [[-1, 0], [17.2, 0]], ax);
    board.create('arrow', [[0, -1], [0, 17.2]], ax);
    var tl = {fixed: true, highlight: false, useMathJax: false, fontSize: 13};
    board.create('text', [16.8, -0.7, 'x'], tl);
    board.create('text', [-0.8, 16.9, 'y'], tl);
    board.create('text', [-0.8, -0.7, 'O'], tl);
    for (i = 2; i <= 16; i += 2) {
        board.create('text', [i - 0.25, -0.7, String(i)], tl);
        board.create('text', [-1.3, i, String(i)], tl);
    }

    var axis = 'x';
    var k = board.create('slider', [[6, 16.5], [12.5, 16.5], [0.25, 1, 4]], {name: 'k', snapWidth: 0.25, precision: 2, withTicks: false});
    board.create('button', [6, 15.2, 'x-axis invariant', function () { axis = 'x'; board.update(); }], {fixed: true});
    board.create('button', [11, 15.2, 'y-axis invariant', function () { axis = 'y'; board.update(); }], {fixed: true});

    // invariant axis drawn thick
    board.create('segment', [[-1, 0], [17, 0]], {strokeColor: '#000000', strokeWidth: 5, fixed: true, highlight: false,
        visible: function () { return axis === 'x'; }});
    board.create('segment', [[0, -1], [0, 17]], {strokeColor: '#000000', strokeWidth: 5, fixed: true, highlight: false,
        visible: function () { return axis === 'y'; }});

    var house = [[2, 1], [4, 1], [4, 3], [3, 4], [2, 3]];
    board.create('polygon', house, {fillColor: '#1f4e9c', fillOpacity: 0.15, vertices: {visible: false},
        borders: {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false}, fixed: true, highlight: false});
    var img = house.map(function (p) {
        return board.create('point', [
            function () { return axis === 'y' ? k.Value() * p[0] : p[0]; },
            function () { return axis === 'x' ? k.Value() * p[1] : p[1]; }], {visible: false});
    });
    board.create('polygon', img, {fillColor: '#000000', fillOpacity: 0.05, vertices: {visible: false},
        borders: {strokeColor: '#000000', strokeWidth: 2, dash: 2, fixed: true, highlight: false}, fixed: true, highlight: false});

    function f(v) { return (Math.round(v * 100) / 100).toString(); }
    board.create('text', [6, 13, function () {
        var K = f(k.Value());
        var m = axis === 'x' ? '1 \\amp 0 \\\\ 0 \\amp ' + K : K + ' \\amp 0 \\\\ 0 \\amp 1';
        m = m.replace(/\\amp/g, '&');
        return '\\(M = \\begin{bmatrix} ' + m + ' \\end{bmatrix}\\)';
    }], {fixed: true, highlight: false, fontSize: 15});
    board.create('text', [6, 10.6, function () {
        return 'Invariant axis: the ' + axis + '-axis';
    }], {fixed: true, highlight: false, fontSize: 15, useMathJax: false});
    board.create('text', [6, 9.2, function () {
        return 'Area of house = 5, area of image = ' + f(5 * k.Value());
    }], {fixed: true, highlight: false, fontSize: 15, useMathJax: false});
    board.create('text', [6, 7.8, function () {
        return 'Area of image ÷ area of house = ' + f(k.Value());
    }], {fixed: true, highlight: false, fontSize: 15, useMathJax: false});
})();
