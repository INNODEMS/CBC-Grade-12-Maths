// Locus of points a distance d from a line (G12 Ch8 Loci, sec-loci-at-a-given-distance-from-a-fixed-line).
// A and B are draggable and fix the line l; the d slider sets the distance. The two lines parallel to l at
// distance d are drawn dashed. P is a free point: the perpendicular from P to l (or, with "Segment only", to the
// nearest point of the segment AB) is drawn and its length shown. With "Segment only" the locus becomes two
// parallel segments joined by semicircles of radius d round A and B.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-parallel-lines-locus', {
        boundingbox: [-8, 6.5, 8, -5.5],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var d = board.create('slider', [[-7, 5.6], [-3, 5.6], [0.5, 1.5, 3]], {name: 'd', snapWidth: 0.1, precision: 1, label: {useMathJax: false, fontSize: 14}});
    var seg = board.create('checkbox', [1, 5.6, 'Segment only'], {fixed: true, label: {useMathJax: false, fontSize: 14}});

    var pt = {showInfobox: false, size: 4, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [6, 10]}};
    var A = board.create('point', [-3, -1], JXG.merge(pt, {name: 'A'}));
    var B = board.create('point', [3, 0.5], JXG.merge(pt, {name: 'B'}));
    var P = board.create('point', [1, 3], {name: 'P', showInfobox: false, size: 4, strokeColor: '#b00000', fillColor: '#b00000', label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});

    function segOnly() { return seg.Value(); }
    // unit vector along AB and unit normal
    function u() { var dx = B.X() - A.X(), dy = B.Y() - A.Y(), L = Math.sqrt(dx * dx + dy * dy) || 1; return [dx / L, dy / L, L]; }
    function n() { var v = u(); return [-v[1], v[0]]; }
    function off(p, s) { var nn = n(); return [p.X() + s * d.Value() * nn[0], p.Y() + s * d.Value() * nn[1]]; }

    // the line l (whole line, or the segment AB)
    board.create('line', [A, B], {strokeColor: '#000000', strokeWidth: 2, highlight: false, fixed: true,
        straightFirst: function () { return !segOnly(); }, straightLast: function () { return !segOnly(); }});

    // the locus: two parallels (whole) or two parallel segments and two semicircles
    var lineStyle = {strokeColor: '#1f4e9c', strokeWidth: 2, dash: 2, highlight: false, fixed: true};
    [1, -1].forEach(function (s) {
        board.create('line', [function () { return off(A, s); }, function () { return off(B, s); }],
            JXG.merge(lineStyle, {straightFirst: function () { return !segOnly(); }, straightLast: function () { return !segOnly(); }}));
    });
    // semicircle round B goes from the + side through the far end to the - side; round A the other way
    board.create('curve', [function (t) { var v = u(), nn = n(); return B.X() + d.Value() * (Math.cos(t) * nn[0] + Math.sin(t) * v[0]); },
        function (t) { var v = u(), nn = n(); return B.Y() + d.Value() * (Math.cos(t) * nn[1] + Math.sin(t) * v[1]); }, 0, Math.PI],
        JXG.merge(lineStyle, {visible: function () { return segOnly(); }}));
    board.create('curve', [function (t) { var v = u(), nn = n(); return A.X() + d.Value() * (Math.cos(t) * nn[0] - Math.sin(t) * v[0]); },
        function (t) { var v = u(), nn = n(); return A.Y() + d.Value() * (Math.cos(t) * nn[1] - Math.sin(t) * v[1]); }, 0, Math.PI],
        JXG.merge(lineStyle, {visible: function () { return segOnly(); }}));

    // foot of the perpendicular from P (clamped to AB when "Segment only")
    function foot() {
        var v = u(), t = (P.X() - A.X()) * v[0] + (P.Y() - A.Y()) * v[1];
        if (segOnly()) { t = Math.max(0, Math.min(v[2], t)); }
        return [A.X() + t * v[0], A.Y() + t * v[1]];
    }
    var F = board.create('point', [function () { return foot()[0]; }, function () { return foot()[1]; }],
        {name: '', size: 2, fixed: true, showInfobox: false, strokeColor: '#b00000', fillColor: '#ffffff'});
    board.create('segment', [P, F], {strokeColor: '#b00000', strokeWidth: 1.5, dash: 1, highlight: false, fixed: true});
    function dist() { var f = foot(); return Math.sqrt(Math.pow(P.X() - f[0], 2) + Math.pow(P.Y() - f[1], 2)); }
    board.create('text', [-7.5, -4.6, function () {
        return 'Distance of P from the ' + (segOnly() ? 'segment' : 'line') + ' = ' + dist().toFixed(2) + '     d = ' + d.Value().toFixed(1);
    }], {fixed: true, highlight: false, useMathJax: false, fontSize: 15});

    board.update();
})();
