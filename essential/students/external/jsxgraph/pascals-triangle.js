// Pascal's triangle built row by row (G12 Ch2, sec-coefficients-in-binomial-expansions, lesson 2.1).
// Slider n (0 to 10): rows for powers 0 to n are shown, the row for power n is boxed, and (a + b)^n
// is written out below with those coefficients. Clicking any inside number draws arrows from the
// two numbers above it and shows their sum.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-pascals-triangle', {
        boundingbox: [-10.5, 13, 10.5, -2.75],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var DX = 1.55, DY = 1.0, TOP = 11;
    var nS = board.create('slider', [[-6, 12.3], [2, 12.3], [0, 4, 10]], {name: 'n', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}});

    function C(r, k) {
        var v = 1, i;
        for (i = 1; i <= k; i++) { v = v * (r - i + 1) / i; }
        return Math.round(v);
    }
    function X(r, k) { return (k - r / 2) * DX; }
    function Y(r) { return TOP - r * DY; }

    var nums = [], labels = [], r, k;
    for (r = 0; r <= 10; r++) {
        nums.push([]);
        labels.push(board.create('text', [-10.4, Y(r), 'n = ' + r], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 12, strokeColor: '#555555'}));
        for (k = 0; k <= r; k++) {
            nums[r].push(board.create('text', [X(r, k), Y(r), String(C(r, k))], {
                anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 14,
                cssStyle: (k > 0 && k < r) ? 'cursor:pointer;' : ''
            }));
        }
    }

    // box round the row for power n
    var box = board.create('polygon', [
        [function () { return X(nS.Value(), 0) - 0.8; }, function () { return Y(nS.Value()) + 0.45; }],
        [function () { return X(nS.Value(), nS.Value()) + 0.8; }, function () { return Y(nS.Value()) + 0.45; }],
        [function () { return X(nS.Value(), nS.Value()) + 0.8; }, function () { return Y(nS.Value()) - 0.45; }],
        [function () { return X(nS.Value(), 0) - 0.8; }, function () { return Y(nS.Value()) - 0.45; }]
    ], {fillColor: '#ffffff', fillOpacity: 0, fixed: true, highlight: false, vertices: {visible: false},
        borders: {strokeColor: '#000000', strokeWidth: 2, highlight: false}});

    // arrows and sum for a clicked number
    var sel = null;
    var ar1 = board.create('arrow', [[0, 0], [0, 0]], {strokeColor: '#000000', strokeWidth: 2, visible: false, fixed: true, highlight: false, lastArrow: {type: 2, size: 6}});
    var ar2 = board.create('arrow', [[0, 0], [0, 0]], {strokeColor: '#000000', strokeWidth: 2, visible: false, fixed: true, highlight: false, lastArrow: {type: 2, size: 6}});
    var sumT = board.create('text', [4.3, 12.3, ''], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 15});

    function showSum(rr, kk) {
        sel = [rr, kk];
        ar1.point1.setPosition(JXG.COORDS_BY_USER, [X(rr - 1, kk - 1), Y(rr - 1) - 0.3]);
        ar1.point2.setPosition(JXG.COORDS_BY_USER, [X(rr, kk) - 0.25, Y(rr) + 0.3]);
        ar2.point1.setPosition(JXG.COORDS_BY_USER, [X(rr - 1, kk), Y(rr - 1) - 0.3]);
        ar2.point2.setPosition(JXG.COORDS_BY_USER, [X(rr, kk) + 0.25, Y(rr) + 0.3]);
        ar1.setAttribute({visible: true}); ar2.setAttribute({visible: true});
        sumT.setText(C(rr - 1, kk - 1) + ' + ' + C(rr - 1, kk) + ' = ' + C(rr, kk));
        board.update();
    }
    function hook(rr, kk) { nums[rr][kk].on('down', function () { if (rr <= Math.round(nS.Value())) { showSum(rr, kk); } }); }
    for (r = 2; r <= 10; r++) { for (k = 1; k < r; k++) { hook(r, k); } }

    // expansion of (a + b)^n, split over two lines when long
    function term(n, j) {
        var c = C(n, j), s = (c === 1 ? '' : String(c));
        var pa = n - j, pb = j;
        if (pa > 0) { s += 'a' + (pa > 1 ? '^{' + pa + '}' : ''); }
        if (pb > 0) { s += 'b' + (pb > 1 ? '^{' + pb + '}' : ''); }
        return s === '' ? '1' : s;
    }
    var line1 = board.create('text', [-10.2, -0.9, ''], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, fontSize: 14});
    var line2 = board.create('text', [-8.6, -2.1, ''], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, fontSize: 14});

    function update() {
        var n = Math.round(nS.Value()), rr, kk, terms = [], j;
        board.suspendUpdate();
        for (rr = 0; rr <= 10; rr++) {
            labels[rr].setAttribute({visible: rr <= n});
            for (kk = 0; kk <= rr; kk++) {
                nums[rr][kk].setAttribute({visible: rr <= n, fontWeight: rr === n ? 'bold' : 'normal'});
            }
        }
        if (sel && sel[0] > n) { sel = null; ar1.setAttribute({visible: false}); ar2.setAttribute({visible: false}); sumT.setText(''); }
        for (j = 0; j <= n; j++) { terms.push(term(n, j)); }
        if (n <= 5) {
            line1.setText('\\((a + b)^{' + n + '} = ' + terms.join(' + ') + '\\)');
            line2.setText('');
        } else {
            var h = Math.ceil((n + 1) / 2);
            line1.setText('\\((a + b)^{' + n + '} = ' + terms.slice(0, h).join(' + ') + ' + \\)');
            line2.setText('\\(' + terms.slice(h).join(' + ') + '\\)');
        }
        board.unsuspendUpdate();
    }
    nS.on('drag', update); nS.on('up', update);
    update();
})();
