// Three-set Venn counts (G12 Ch1 Sets, sec-venn-diagrams, lesson 5.2; Core and Essential).
// A fixed three-set diagram (the chapter's region layout) with one number box per region (regions 1 to 8:
// A only, A and B only, B only, A and C only, all three, B and C only, C only, none). The readout gives
// n(A), n(B), n(C), n(A u B u C) and the total, updating as the learner types; a warning names any box that
// does not hold a whole number. Preset: the class survey of act-three-subjects (4, 1, 3, 2, 2, 2, 3, 3).
// Checks: the preset gives 9, 8, 9, 17, 20; the Bungoma crops (15, 9, 10, 5, 6, 4, 9, 7) give 35, 29, 24, 58, 65.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-three-set-venn-counts', {
        boundingbox: [-4.8, 3.3, 4.8, -3.9],
        keepAspectRatio: true, axis: false, grid: false,
        showCopyright: false, showNavigation: false,
        pan: {enabled: false}, zoom: {enabled: false}
    });
    function F(o) { var r = {fixed: true, highlight: false}, k; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    function txt(o) { var r = F({useMathJax: false, fontSize: 14}), k; o = o || {}; for (k in o) { if (o.hasOwnProperty(k)) { r[k] = o[k]; } } return r; }
    board.create('polygon', [[-4, -2.8], [4, -2.8], [4, 2.8], [-4, 2.8]], F({fillOpacity: 0, vertices: {visible: false},
        borders: {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false}}));
    board.create('text', [-3.85, 2.5, 'ξ'], txt({fontSize: 18, cssStyle: 'font-style: italic'}));
    var C = [[-0.85, 0.55], [0.85, 0.55], [0, -0.9]], Rr = 1.55, L = [[-2.45, 2.1, 'A'], [2.3, 2.1, 'B'], [1.55, -2.45, 'C']], i;
    for (i = 0; i < 3; i++) {
        board.create('circle', [C[i], Rr], F({strokeColor: '#000000', strokeWidth: 2, fillOpacity: 0}));
        board.create('text', [L[i][0], L[i][1], L[i][2]], txt({fontSize: 18, cssStyle: 'font-style: italic'}));
    }
    var PP = [[-1.6, 1.0], [0, 1.35], [1.6, 1.0], [-1.0, -0.5], [0, 0.05], [1.0, -0.5], [0, -1.85], [-3.1, -2.35]];
    var preset = [4, 1, 3, 2, 2, 2, 3, 3], box = [];
    for (i = 0; i < 8; i++) {
        box.push(board.create('input', [PP[i][0] - 0.27, PP[i][1], String(preset[i]), ''],
            {fixed: true, anchorY: 'middle', cssStyle: 'width: 2.2em; text-align: center;', useMathJax: false}));
    }
    function val(k) {
        var s = String(box[k].Value()).replace(/\s/g, '');
        return /^\d+$/.test(s) ? parseInt(s, 10) : NaN;
    }
    function bad() {
        var out = [], k;
        for (k = 0; k < 8; k++) { if (isNaN(val(k))) { out.push(k + 1); } }
        return out;
    }
    function sum(list) { var s = 0, k; for (k = 0; k < list.length; k++) { s += val(list[k] - 1); } return s; }
    board.create('text', [-4, -3.25, function () {
        if (bad().length > 0) { return 'n(A) = ?\u2003 n(B) = ?\u2003 n(C) = ?\u2003 n(A ∪ B ∪ C) = ?\u2003 total = ?'; }
        return 'n(A) = ' + sum([1, 2, 4, 5]) + '\u2003 n(B) = ' + sum([2, 3, 5, 6]) + '\u2003 n(C) = ' + sum([4, 5, 6, 7]) +
            '\u2003 n(A ∪ B ∪ C) = ' + sum([1, 2, 3, 4, 5, 6, 7]) + '\u2003 total = ' + sum([1, 2, 3, 4, 5, 6, 7, 8]);
    }], txt({fontSize: 14}));
    board.create('text', [-4, -3.65, function () {
        var b = bad();
        if (b.length === 0) { return ''; }
        return 'Type a whole number in ' + (b.length === 1 ? 'region box ' : 'region boxes ') + b.join(', ') + '.';
    }], txt({fontSize: 13, strokeColor: '#a00000'}));
    for (i = 0; i < 8; i++) { JXG.addEvent(box[i].rendNodeInput, 'input', function () { board.update(); }, box[i]); }
    board.update();
})();
