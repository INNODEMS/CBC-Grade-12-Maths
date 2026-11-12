// A family of integrals (G12 Ch18, sec-integration-as-the-reverse-of-differentiation).
// Dashed: y = x^2 - 1. Solid: y = x^3/3 - x + C, an integral of x^2 - 1, with a slider for C.
// A point P glides on the solid curve with its tangent; the gradient at P equals x^2 - 1 at
// the same x and does not change when C changes. The gradient is measured numerically from the
// solid curve itself (central difference), not copied from the formula.
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-family-of-integrals', {
        boundingbox: [-3.6, 6.2, 3.6, -5.2],
        keepAspectRatio: false,
        axis: true,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });

    var C = board.create('slider', [[-3.2, 5.4], [-0.8, 5.4], [-3, 0, 3]], {
        name: 'C', snapWidth: 0.5, precision: 1, withTicks: false, label: {useMathJax: false}
    });

    board.create('functiongraph', [function (x) { return x * x - 1; }, -3.6, 3.6], {
        strokeColor: '#555555', strokeWidth: 2, dash: 2, fixed: true, highlight: false
    });
    var F = board.create('functiongraph', [function (x) { return x * x * x / 3 - x + C.Value(); }, -3.6, 3.6], {
        strokeColor: '#000000', strokeWidth: 3, fixed: true, highlight: false
    });
    board.create('text', [0.6, -4.5, 'dashed: y = x² − 1'], {fixed: true, highlight: false, useMathJax: false, cssStyle: 'background:#ffffff;'});
    board.create('text', [0.6, -3.7, 'solid: y = x³/3 − x + C'], {fixed: true, highlight: false, useMathJax: false, cssStyle: 'background:#ffffff;'});

    var P = board.create('glider', [1.5, 1.5 * 1.5 * 1.5 / 3 - 1.5, F], {
        name: 'P', size: 4, fillColor: '#000000', strokeColor: '#000000', label: {useMathJax: false}
    });
    board.create('tangent', [P], {strokeColor: '#000000', strokeWidth: 1.5, dash: 1, highlight: false});
    board.create('text', [0.25, 6.0, function () {
        var x0 = P.X();
        return 'At P, x = ' + x0.toFixed(2) + '<br>gradient of solid curve = ' + ((F.Y(x0 + 0.0001) - F.Y(x0 - 0.0001)) / 0.0002).toFixed(2) +
            '<br>height of dashed curve = ' + (x0 * x0 - 1).toFixed(2);
    }], {fixed: true, highlight: false, useMathJax: false, anchorY: 'top', cssStyle: 'background:#ffffff;'});
})();
