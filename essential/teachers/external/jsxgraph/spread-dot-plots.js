// Spread on dot plots (G12 Ch15, sec-measures-of-dispersion).
// Marks of the same 12 learners in Mathematics and Kiswahili, as two dot plots on one scale.
// Sliders act on Kiswahili only: each mark x becomes mean + spread * (x - mean) + shift, where
// mean = 60 is the original Kiswahili mean. Live text gives the mean, variance and standard
// deviation (dividing by n) of both subjects. The spread slider runs to 3 so the two SDs can be made about equal (about 2.85).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-spread-dot-plots', {
        boundingbox: [18, 8.6, 96, -1.6],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var maths = [45, 62, 58, 71, 52, 66, 49, 75, 60, 55, 68, 63];
    var kis = [58, 61, 55, 64, 60, 57, 63, 59, 62, 56, 65, 60];
    var kisMean = 60;
    var yM = 3.2, yK = 1.4, dy = 0.35;
    var i;

    function stats(a) {
        var m = 0, v = 0, k;
        for (k = 0; k < a.length; k++) { m += a[k]; }
        m = m / a.length;
        for (k = 0; k < a.length; k++) { v += (a[k] - m) * (a[k] - m); }
        v = v / a.length;
        return [m, v, Math.sqrt(v)];
    }

    // number line from 30 to 90
    board.create('segment', [[30, 0], [90, 0]], {strokeColor: '#000000', strokeWidth: 1.5, fixed: true, highlight: false});
    for (i = 30; i <= 90; i += 5) {
        board.create('segment', [[i, 0], [i, (i % 10 === 0) ? 0.25 : 0.15]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false});
        if (i % 10 === 0) {
            board.create('text', [i, -0.5, String(i)], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
        }
    }
    board.create('text', [60, -1.2, 'Mark (%)'], {anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    board.create('text', [19, yM, 'Mathematics'], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});
    board.create('text', [19, yK, 'Kiswahili'], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false});

    // sliders
    var shift = board.create('slider', [[32, 7.6], [52, 7.6], [-10, 0, 10]], {
        name: 'shift', snapWidth: 1, precision: 0, withTicks: false, label: {useMathJax: false}
    });
    var spread = board.create('slider', [[66, 7.6], [86, 7.6], [0.5, 1, 3]], {
        name: 'spread', snapWidth: 0.1, precision: 1, withTicks: false, label: {useMathJax: false}
    });

    function kisNow() {
        var out = [];
        for (var k = 0; k < kis.length; k++) {
            out.push(kisMean + spread.Value() * (kis[k] - kisMean) + shift.Value());
        }
        return out;
    }
    // height of the k-th dot: stacked above earlier dots with the same value
    function stackHeight(a, k, base) {
        var c = 0;
        for (var t = 0; t < k; t++) {
            if (Math.abs(a[t] - a[k]) < 0.05) { c++; }
        }
        return base + c * dy;
    }

    for (i = 0; i < maths.length; i++) {
        board.create('point', [maths[i], stackHeight(maths, i, yM)], {name: '', size: 3, fixed: true, strokeColor: '#1f4e9c', fillColor: '#1f4e9c', showInfobox: false});
    }
    for (i = 0; i < kis.length; i++) {
        (function (k) {
            board.create('point', [function () { return kisNow()[k]; }, function () { return stackHeight(kisNow(), k, yK); }], {
                name: '', size: 3, face: 'square', fixed: true, strokeColor: '#7a4a00', fillColor: '#ffffff', showInfobox: false
            });
        })(i);
    }

    // mean markers: dashed vertical line on each row
    var sm = stats(maths);
    board.create('segment', [[sm[0], yM - 0.5], [sm[0], yM + 1]], {strokeColor: '#1f4e9c', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false});
    board.create('segment', [[function () { return stats(kisNow())[0]; }, yK - 0.5], [function () { return stats(kisNow())[0]; }, yK + 1]], {strokeColor: '#7a4a00', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false});

    // live statistics
    board.create('text', [30, 6.4, 'Mathematics: mean ' + sm[0].toFixed(2) + ', variance ' + sm[1].toFixed(2) + ', SD ' + sm[2].toFixed(2)], {
        anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 14
    });
    board.create('text', [30, 5.6, function () {
        var s = stats(kisNow());
        return 'Kiswahili: mean ' + s[0].toFixed(2) + ', variance ' + s[1].toFixed(2) + ', SD ' + s[2].toFixed(2);
    }], {anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false, useMathJax: false, fontSize: 14});
})();
