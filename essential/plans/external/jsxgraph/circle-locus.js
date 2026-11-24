// The circle locus (G12 Ch8 Loci, sec-loci-at-a-given-distance-from-a-fixed-point).
// Draggable centre C and a slider r (1 to 5, step 0.5). A glider P on the circle leaves a trace as it is dragged,
// so the locus builds up; "Clear trace" removes it. The box "Show PC < r" shades the unwanted region (outside the
// circle), leaves the disc clear (the book shades the unwanted region), shows a key, and draws the circle
// dashed (points on it are not included). A free point Q reports QC and whether it is inside, on or outside.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-circle-locus', {
        boundingbox: [-8, 7, 8, -5],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var r = board.create('slider', [[-7.5, 6.2], [-3.5, 6.2], [1, 3, 5]], {name: 'r', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 14}});
    var C = board.create('point', [0, 0], {name: 'C', showInfobox: false, size: 4, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [-14, -12]}});
    var circ = board.create('circle', [C, function () { return r.Value(); }], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    // the unwanted region: the board rectangle with the disc cut out (a slit joins the two loops, so the fill leaves a hole)
    var disc = board.create('curve', [[], []], {strokeWidth: 0, fillColor: '#9a9a9a', fillOpacity: 0.35, fixed: true, highlight: false, visible: false});
    disc.updateDataArray = function () {
        var X = [-8, 8, 8, -8, -8], Y = [7, 7, -5, -5, 7], j, t, rr = r.Value(), cx = C.X(), cy = C.Y();
        for (j = 0; j <= 120; j++) { t = Math.PI - 2 * Math.PI * j / 120; X.push(cx + rr * Math.cos(t)); Y.push(cy + rr * Math.sin(t)); }
        X.push(-8); Y.push(7);
        this.dataX = X; this.dataY = Y;
    };
    var P = board.create('glider', [3, 0, circ], {name: 'P', showInfobox: false, size: 4, strokeColor: '#b00000', fillColor: '#b00000', trace: true, traceAttributes: {size: 1, strokeColor: '#b00000', fillColor: '#b00000'}, label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});
    board.create('segment', [C, P], {strokeColor: '#b00000', strokeWidth: 1, dash: 2, fixed: true, highlight: false});
    var Q = board.create('point', [5.5, -3.5], {name: 'Q', showInfobox: false, size: 4, face: '[]', strokeColor: '#2a7a2a', fillColor: '#2a7a2a', label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});

    function qc() { return Q.Dist(C); }
    function where() {
        var d = qc() - r.Value();
        if (Math.abs(d) < 0.05) { return 'on the circle'; }
        return d < 0 ? 'inside the circle' : 'outside the circle';
    }
    board.create('text', [-7.5, 5.2, function () { return '\\(PC = ' + P.Dist(C).toFixed(1) + '\\)'; }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.create('text', [-7.5, 4.3, function () { return '\\(QC = ' + qc().toFixed(1) + '\\): ' + where(); }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});

    var shade = board.create('checkbox', [1, 6.2, 'Show PC < r'], {fixed: true, useMathJax: false, fontSize: 14});
    var key = board.create('text', [-7.5, -4.4, 'Key: shaded, not wanted; unshaded, PC < r (the required region).'],
        {fixed: true, highlight: false, fontSize: 13, useMathJax: false, anchorY: 'middle', visible: false, cssStyle: 'background-color: #ffffff;'});
    function refresh() {
        var on = shade.Value();
        disc.setAttribute({visible: on});
        key.setAttribute({visible: on});
        circ.setAttribute({dash: on ? 3 : 0});
        board.update();
    }
    JXG.addEvent(shade.rendNodeCheckbox, 'change', refresh, shade);
    board.create('button', [5, 6.2, 'Clear trace', function () { P.clearTrace(); board.update(); }], {fixed: true});
    C.on('drag', function () { P.clearTrace(); });

    // test hook for headless checks (no effect in the book)
    board.locusTest = {C: C, P: P, Q: Q, r: r, shade: shade, refresh: refresh, disc: disc, circ: circ, where: where};
    board.update();
})();
