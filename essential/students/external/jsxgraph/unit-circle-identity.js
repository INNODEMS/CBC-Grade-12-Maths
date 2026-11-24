// The identity on the unit circle (G12 Ch10, sec-trigonometric-identity, lesson 1.1).
// A glider P on the unit circle (start 50 degrees) with the right-angled triangle O, (cos x, 0), P.
// The legs are labelled cos x and sin x (values with their signs in the readout); live text gives x (0 to 360, whole degrees),
// sin x and cos x (3 d.p.), their squares (4 d.p.) and the sum, which is always 1.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-unit-circle-identity', {
        boundingbox: [-1.6, 1.45, 2.9, -1.45],
        keepAspectRatio: true,
        axis: true,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var O = board.create('point', [0, 0], {visible: false, fixed: true});
    var circ = board.create('circle', [O, 1], {strokeColor: '#888888', strokeWidth: 1.5, fixed: true, highlight: false});
    var a0 = 50 * Math.PI / 180;
    var P = board.create('glider', [Math.cos(a0), Math.sin(a0), circ], {name: 'P', size: 5, strokeColor: '#b00000', fillColor: '#b00000', showInfobox: false, label: {useMathJax: false, offset: [8, 10]}});

    // snap P to whole degrees
    function deg() {
        var d = Math.atan2(P.Y(), P.X()) * 180 / Math.PI;
        if (d < 0) { d += 360; }
        return Math.round(d) % 360;
    }
    P.on('drag', function () {
        var d = deg() * Math.PI / 180;
        P.moveTo([Math.cos(d), Math.sin(d)]);
    });
    function c() { return Math.cos(deg() * Math.PI / 180); }
    function s() { return Math.sin(deg() * Math.PI / 180); }

    var F = board.create('point', [function () { return c(); }, 0], {visible: false});
    board.create('segment', [O, P], {strokeColor: '#000000', strokeWidth: 2, highlight: false, fixed: true});
    board.create('segment', [O, F], {strokeColor: '#1f4e9c', strokeWidth: 3, highlight: false, fixed: true});
    board.create('segment', [F, P], {strokeColor: '#1f4e9c', strokeWidth: 3, dash: 2, highlight: false, fixed: true});
    board.create('text', [function () { return c() / 2 - 0.25; }, function () { return s() >= 0 ? -0.1 : 0.12; },
        function () { return 'cos x'; }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});
    board.create('text', [function () { return c() + (c() >= 0 ? 0.05 : -0.4); }, function () { return s() / 2; },
        function () { return 'sin x'; }], {fixed: true, highlight: false, useMathJax: false, fontSize: 13});

    board.create('text', [1.5, 1.2, function () {
        var cs = c() * c(), sn = s() * s();
        return 'x = ' + deg() + '°<br>sin x = ' + s().toFixed(3) + '<br>cos x = ' + c().toFixed(3) +
            '<br>sin²x = ' + sn.toFixed(4) + '<br>cos²x = ' + cs.toFixed(4) +
            '<br>sin²x + cos²x = ' + (sn + cs).toFixed(4);
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 14, anchorY: 'top'});
})();
