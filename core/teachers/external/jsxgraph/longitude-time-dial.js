// Longitude and local time (G12 Ch13, sec-longitude-and-time, lesson 4.1).
// A longitude scale from 180 W to 180 E with ticks every 15 degrees (one hour of time). Sliders: GMT (00:00 to 23:45,
// steps of 15 min) and longitude (steps of 1 degree) for a marker. Readout: local time = GMT + 4 min x longitude
// (east positive), with "+1 day" / "-1 day" when the date differs from Greenwich. Fixed markers: Greenwich,
// Nairobi (37 E) and the 45 E meridian of East Africa Time (GMT + 3).
(function () {
    JXG.Options.text.useMathJax = true;
    var board = JXG.JSXGraph.initBoard('jsxgraph-longitude-time-dial', {
        boundingbox: [-200, 100, 200, -50],
        keepAspectRatio: false,
        axis: false,
        grid: false,
        showCopyright: false,
        showNavigation: false,
        pan: {enabled: false},
        zoom: {enabled: false}
    });
    var fx = {fixed: true, highlight: false};
    var T = {fixed: true, highlight: false, useMathJax: false};
    function hm(m) {
        m = ((Math.round(m) % 1440) + 1440) % 1440;
        var h = Math.floor(m / 60), mi = m % 60;
        return (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi;
    }
    function lonTxt(l) {
        if (l === 0) { return '0°'; }
        if (Math.abs(l) === 180) { return '180°'; }
        return Math.abs(l) + '° ' + (l > 0 ? 'E' : 'W');
    }
    // the scale
    board.create('segment', [[-180, 0], [180, 0]], {strokeColor: '#000000', strokeWidth: 2, fixed: true, highlight: false});
    for (var L = -180; L <= 180; L += 15) {
        var major = (L % 45 === 0);
        board.create('segment', [[L, -3], [L, major ? 5 : 3]], {strokeColor: '#000000', strokeWidth: 1, fixed: true, highlight: false});
        if (major) {
            board.create('text', [L, -9, (L === 0 ? '0°' : Math.abs(L) + '°' + (L > 0 ? 'E' : 'W'))],
                Object.assign({anchorX: 'middle', fontSize: 12}, T));
        }
        var hrs = L / 15;
        board.create('text', [L, 9, (hrs > 0 ? '+' : '') + hrs + ' h'], Object.assign({anchorX: 'middle', fontSize: 10, strokeColor: '#555555'}, T));
    }
    board.create('text', [-180, 16, 'hours ahead of (+) or behind (−) Greenwich'], Object.assign({fontSize: 11, strokeColor: '#555555'}, T));
    // fixed markers
    function mark(l, txt, y, dash) {
        board.create('segment', [[l, -14], [l, y + 4]], {strokeColor: '#555555', strokeWidth: 1.5, dash: dash, fixed: true, highlight: false});
        board.create('point', [l, 0], {name: '', size: 2, fixed: true, strokeColor: '#555555', fillColor: '#555555', highlight: false});
        board.create('text', [l, y, txt], Object.assign({anchorX: 'middle', fontSize: 12}, T));
    }
    mark(0, 'Greenwich', -24, 0);
    mark(37, 'Nairobi', -24, 0);
    mark(45, 'EAT (GMT + 3)', -34, 2);
    // sliders
    var g = board.create('slider', [[-150, 85], [60, 85], [0, 9, 23.75]], {name: 'GMT', snapWidth: 0.25, withTicks: false,
        label: {useMathJax: false}, precision: 2, suffixLabel: '', withLabel: false});
    board.create('text', [-195, 85, 'GMT'], Object.assign({fontSize: 14}, T));
    board.create('text', [70, 85, function () { return hm(g.Value() * 60); }], Object.assign({fontSize: 14}, T));
    var lon = board.create('slider', [[-150, 70], [60, 70], [-180, 37, 180]], {name: 'longitude', snapWidth: 1, withTicks: false, withLabel: false});
    board.create('text', [-195, 70, 'longitude'], Object.assign({fontSize: 14}, T));
    board.create('text', [70, 70, function () { return lonTxt(Math.round(lon.Value())); }], Object.assign({fontSize: 14}, T));
    // marker
    var P = board.create('point', [function () { return Math.round(lon.Value()); }, 0], {name: '', size: 5, fixed: true,
        strokeColor: '#1f4e9c', fillColor: '#1f4e9c', highlight: false});
    board.create('arrow', [[function () { return Math.round(lon.Value()); }, 30], [function () { return Math.round(lon.Value()); }, 6]],
        {strokeColor: '#1f4e9c', strokeWidth: 2, fixed: true, highlight: false});
    function local() { return g.Value() * 60 + 4 * Math.round(lon.Value()); }
    board.create('text', [-195, 50, function () {
        var t = local(), d = Math.floor(t / 1440);
        var day = d > 0 ? '  (+1 day)' : (d < 0 ? '  (−1 day)' : '');
        var l = Math.round(lon.Value());
        return 'local time at ' + lonTxt(l) + ' = ' + hm(g.Value() * 60) + (l < 0 ? ' − ' : ' + ') + '4 min × ' +
            Math.abs(l) + ' = ' + hm(t) + day;
    }], Object.assign({fontSize: 15}, T));
    board.create('text', [-195, 38, function () {
        return 'East Africa Time (GMT + 3) = ' + hm(g.Value() * 60 + 180) + ';  local time in Nairobi (37° E) = ' + hm(g.Value() * 60 + 148);
    }], Object.assign({fontSize: 13, strokeColor: '#333333'}, T));
})();
