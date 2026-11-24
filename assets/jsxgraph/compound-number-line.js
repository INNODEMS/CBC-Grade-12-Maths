// Compound inequalities on a number line (G12 Ch4 Linear Inequalities, sec-simple-and-compound-inequalities,
// lesson 1.2). Sliders a and b (from -8 to 8, step 0.5) set the two ends; the buttons Left end and Right end switch
// each end between open (not included) and filled (included). The numbers between are drawn as a thick segment and
// the statement is written above it, for example "-1.5 < x <= 5" with the book's symbols. When a > b, or a = b with an open end, no number
// satisfies both and nothing is drawn; a = b with both ends filled is the single number x = a. The checkbox Show integers marks the integers in the range and counts them.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-compound-number-line', {
        boundingbox: [-11, 4.5, 11, -3.5],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    // copy-merge (JXG.merge changes its first argument)
    function mg(a, b) { var o = {}, k; for (k in a) { o[k] = a[k]; } for (k in b) { o[k] = b[k]; } return o; }
    var fix = {fixed: true, highlight: false};
    var txt = {fixed: true, highlight: false, useMathJax: false};
    var closed = [false, true];

    // the number line from -10 to 10
    board.create('arrow', [[-10.4, 0], [10.6, 0]], mg(fix, {strokeColor: '#000000', strokeWidth: 1.5, firstArrow: true, lastArrow: true}));
    var k;
    for (k = -10; k <= 10; k++) {
        board.create('segment', [[k, -0.15], [k, 0.15]], mg(fix, {strokeColor: '#000000', strokeWidth: 1}));
        board.create('text', [k, -0.4, String(k).replace('-', '−')], mg(txt, {anchorX: 'middle', anchorY: 'top', fontSize: 12}));
    }

    var sOpt = {snapWidth: 0.5, precision: 1, label: {useMathJax: false, fontSize: 14}};
    var aS = board.create('slider', [[-10, 3.8], [-3.5, 3.8], [-8, -1.5, 8]], mg(sOpt, {name: 'a'}));
    var bS = board.create('slider', [[1.5, 3.8], [8, 3.8], [-8, 5, 8]], mg(sOpt, {name: 'b'}));
    function A() { return Math.round(aS.Value() * 2) / 2; }
    function B() { return Math.round(bS.Value() * 2) / 2; }
    function ok() { return A() < B() || (A() === B() && closed[0] && closed[1]); }
    function num(v) { return v < 0 ? '−' + (-v) : String(v); }

    board.create('button', [-10, 2.8, function () { return 'Left end: ' + (closed[0] ? 'filled' : 'open'); }, function () {
        closed[0] = !closed[0]; style(); board.update();
    }], {fixed: true, fontSize: 14, useMathJax: false});
    board.create('button', [1.5, 2.8, function () { return 'Right end: ' + (closed[1] ? 'filled' : 'open'); }, function () {
        closed[1] = !closed[1]; style(); board.update();
    }], {fixed: true, fontSize: 14, useMathJax: false});
    var cb = board.create('checkbox', [-10, -1.6, 'Show integers'], {fixed: true, fontSize: 14, useMathJax: false});

    board.create('segment', [[function () { return A(); }, 0], [function () { return B(); }, 0]],
        mg(fix, {strokeColor: '#1f4e9a', strokeWidth: 7, visible: function () { return ok(); }}));
    var pOpt = {fixed: true, highlight: false, withLabel: false, showInfobox: false, size: 6, strokeColor: '#1f4e9a', strokeWidth: 2.5, fillOpacity: 1};
    var ends = [board.create('point', [function () { return A(); }, 0], mg(pOpt, {visible: function () { return ok(); }})),
        board.create('point', [function () { return B(); }, 0], mg(pOpt, {visible: function () { return ok(); }}))];
    function style() {
        ends[0].setAttribute({fillColor: closed[0] ? '#1f4e9a' : '#ffffff'});
        ends[1].setAttribute({fillColor: closed[1] ? '#1f4e9a' : '#ffffff'});
    }
    style();

    function statement() {
        if (!ok()) { return 'No number satisfies both'; }
        if (A() === B()) { return 'x = ' + num(A()) + ' only'; }
        return num(A()) + (closed[0] ? ' ≤ ' : ' < ') + 'x' + (closed[1] ? ' ≤ ' : ' < ') + num(B());
    }
    board.create('text', [function () { return ok() ? (A() + B()) / 2 : 0; }, 1.2, statement],
        mg(txt, {anchorX: 'middle', anchorY: 'middle', fontSize: 18, cssStyle: 'background-color: #ffffff; padding: 2px;'}));

    function ints() {
        var out = [], n;
        if (!ok()) { return out; }
        for (n = Math.ceil(A()); n <= Math.floor(B()); n++) {
            if ((n > A() || (n === A() && closed[0])) && (n < B() || (n === B() && closed[1]))) { out.push(n); }
        }
        return out;
    }
    var marks = [];
    for (k = -10; k <= 10; k++) {
        marks.push(board.create('point', [k, 0.55], {fixed: true, highlight: false, withLabel: false, showInfobox: false, size: 3, face: 'o',
            strokeColor: '#b00000', fillColor: '#b00000',
            visible: (function (n) { return function () { return cb.Value() && ints().indexOf(n) >= 0; }; })(k)}));
    }
    board.create('text', [-10, -2.6, function () {
        if (!cb.Value()) { return ''; }
        var L = ints();
        if (!ok()) { return 'No integers: no number satisfies both.'; }
        if (L.length === 0) { return 'No integers in this range.'; }
        return 'Integers: ' + L.map(num).join(', ') + ' (' + L.length + (L.length === 1 ? ' integer)' : ' integers)');
    }], mg(txt, {anchorY: 'middle', fontSize: 14}));

    // test hook (no effect in the book)
    board.cnlTest = {set: function (a, b) { aS.setValue(a); bS.setValue(b); board.update(); }, statement: statement, ints: ints,
        show: function (v) { if (cb.rendNodeCheckbox.checked !== v) { cb.rendNodeCheckbox.click(); } board.fullUpdate(); },
        ends: function () { return [ends[0].visProp.fillcolor, ends[1].visProp.fillcolor, ends[0].visProp.visible === false ? 'hidden' : 'vis']; }};
    board.update();
})();
