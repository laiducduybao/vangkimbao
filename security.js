(function () {
    'use strict';

    // Tắt toàn bộ console output
    var noop = function () {};
    ['log', 'warn', 'error', 'info', 'debug', 'table', 'dir', 'trace', 'group', 'groupEnd'].forEach(function (m) {
        try { console[m] = noop; } catch (e) {}
    });
    setInterval(function () { try { console.clear(); } catch (e) {} }, 1000);

    // Chặn chuột phải
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    // Chặn phím tắt mở DevTools và xem nguồn trang
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.key === 'F12') { e.preventDefault(); return false; }
        // Ctrl+Shift+I / J / C
        if (e.ctrlKey && e.shiftKey && /^[ijcIJC]$/.test(e.key)) { e.preventDefault(); return false; }
        // Ctrl+U (xem nguồn), Ctrl+S (lưu trang)
        if (e.ctrlKey && /^[uUsS]$/.test(e.key)) { e.preventDefault(); return false; }
    });

    var wiped = false;
    var timers = [];

    // Che đen toàn trang khi phát hiện DevTools
    function wipe() {
        if (wiped) return;
        wiped = true;
        timers.forEach(clearInterval);
        try {
            document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;z-index:2147483647;"></div>';
        } catch (e) {}
    }

    // Phương pháp 1: Chênh lệch kích thước cửa sổ khi DevTools chiếm không gian bên cạnh/dưới
    function sizeCheck() {
        var wDiff = window.outerWidth - window.innerWidth > 160;
        var hDiff = window.outerHeight - window.innerHeight > 200;
        if (wDiff || hDiff) wipe();
    }

    // Phương pháp 2: DevTools làm chậm thực thi tại câu lệnh debugger
    function debugCheck() {
        var t = performance.now();
        debugger; // eslint-disable-line no-debugger
        if (performance.now() - t > 150) wipe();
    }

    timers.push(setInterval(sizeCheck, 500));
    timers.push(setInterval(debugCheck, 1000));

})();
