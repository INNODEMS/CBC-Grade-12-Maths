// Midpoints of equal chords (G12 Ch8 Loci, sec-loci-involving-chords).
// A circle, centre O, radius 5. P is a glider on the circle; Q is the other end of a chord PQ of length c (slider).
// Dragging P round the circle rotates the chord; its midpoint M leaves a trace, a smaller circle with centre O.
// The text gives OM = sqrt(r^2 - (c/2)^2). A checkbox draws the locus circle dashed; a button clears the trace.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-midpoints-of-equal-chords', {
        boundingbox: [-8, 7.5, 8, -5.2],
        keepAspectRatio: true,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var R = 5;
    var st = {fixed: true, highlight: false};
    var c = board.create('slider', [[-7.5, 6.6], [-3, 6.6], [1, 8, 10]], {name: 'c', snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 14}});
    var O = board.create('point', [0, 1], {name: 'O', fixed: true, showInfobox: false, size: 2, strokeColor: '#000000', fillColor: '#000000', label: {useMathJax: false, fontSize: 15, offset: [-14, -10]}});
    var circ = board.create('circle', [O, R], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    var P = board.create('glider', [O.X() + R * Math.cos(2.4), O.Y() + R * Math.sin(2.4), circ], {name: 'P', showInfobox: false, size: 5, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [-16, 8]}});
    function half() { return Math.asin(Math.min(1, c.Value() / (2 * R))); }
    var Q = board.create('point', [function () {
        var a = Math.atan2(P.Y() - O.Y(), P.X() - O.X()) - 2 * half();
        return O.X() + R * Math.cos(a);
    }, function () {
        var a = Math.atan2(P.Y() - O.Y(), P.X() - O.X()) - 2 * half();
        return O.Y() + R * Math.sin(a);
    }], {name: 'Q', fixed: true, showInfobox: false, size: 3, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', label: {useMathJax: false, fontSize: 15, offset: [8, -8]}});
    board.create('segment', [P, Q], {strokeColor: '#1f4e9c', strokeWidth: 2.5, fixed: true, highlight: false});
    var M = board.create('midpoint', [P, Q], {name: 'M', showInfobox: false, size: 3, strokeColor: '#b00000', fillColor: '#b00000', trace: true, label: {useMathJax: false, fontSize: 15, offset: [8, 8]}});
    board.create('segment', [O, M], {strokeColor: '#b00000', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false});
    function om() { return Math.sqrt(Math.max(0, R * R - c.Value() * c.Value() / 4)); }
    var show = board.create('checkbox', [1, 6.6, 'Show the locus'], {fixed: true, fontSize: 14, useMathJax: false});
    var loc = board.create('circle', [O, function () { return om(); }], {strokeColor: '#b00000', strokeWidth: 1.5, dash: 3, fixed: true, highlight: false, visible: false});
    JXG.addEvent(show.rendNodeCheckbox, 'change', function () { loc.setAttribute({visible: show.Value()}); board.update(); }, show);
    board.create('button', [5.2, 6.6, 'Clear', function () { M.clearTrace(); board.update(); }], {fixed: true, fontSize: 14, useMathJax: false});
    c.on('drag', function () { M.clearTrace(); });
    board.create('text', [-7.5, -4.6, function () {
        var h = c.Value() / 2;
        return '\\(r = 5,\\ c = ' + c.Value().toFixed(1) + ',\\ OM = \\sqrt{5^2 - ' + h.toFixed(2).replace(/\.?0+$/, '') + '^2} = ' + om().toFixed(2) + '\\)';
    }], {fixed: true, highlight: false, fontSize: 15, anchorY: 'middle'});
    board.update();
})();
