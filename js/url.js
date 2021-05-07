var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { util } from './globals.js';
var MS_INTERVAL = 400;
var PIXELS_SCROLL_SPEED = 900;
var state = {
    idx: 0,
    startOrEnd: 'e',
    root: null,
    master: null,
    updated: null
};
var getRange = window.getRange = function (master, whichStage, sOrE) {
    if (whichStage === void 0) { whichStage = state.idx; }
    if (sOrE === void 0) { sOrE = state.startOrEnd; }
    var arr = __spreadArray([], master.children.values());
    var range = [];
    arr.forEach(function (ch) {
        var asCustomRange = ch.asLinkableRange();
        if (asCustomRange) {
            range[range.length] = asCustomRange;
            return;
        }
        var rng = ch.nthStage(whichStage);
        var end = rng[sOrE === 's' ? 0 : 1];
        var ttl = ch.getOpt('title');
        range[range.length] = [end, ttl];
    });
    return range;
};
var getCurr = function (range, scr) {
    var curr = null;
    range.forEach(function (_a) {
        var end = _a[0], ttl = _a[1];
        if (parseInt(scr, 10) >= parseInt(end)) {
            curr = ttl;
        }
    });
    return curr;
};
var updateConditionally = function (st, scrVh, idx, sOrE) {
    var scr = parseInt(scrVh, 10);
    var range = getRange(st.master, idx, sOrE);
    var curr = getCurr(range, scr);
    var newHash = curr === null
        ? "" + scrVh
        : scrVh + "/" + curr;
    var stateArg = st.root + "#" + newHash;
    st.updated = scrVh;
    history.replaceState({}, document.title, stateArg);
};
var updateLocation = function (idx, sOrE) {
    var scrolled = util(state.master.el.scrollTop).toVh();
    if (state.updated !== scrolled) {
        updateConditionally(state, scrolled, idx, sOrE);
    }
};
var getScrollCoords = function (range, hash) {
    var ret = 0;
    var num, ttl;
    var _a = hash.split('/').map(function (str) { return str.replace('#', ''); }), numOrTtl = _a[0], ttlOrUndef = _a[1];
    var testHash = "#" + parseInt(numOrTtl, 10) + "vh";
    if (ttlOrUndef) {
        num = util(numOrTtl).toPx();
        ttl = ttlOrUndef;
    }
    else if (testHash === hash) {
        num = util(numOrTtl).toPx();
    }
    else {
        ttl = numOrTtl;
    }
    if (num || num === 0)
        return num;
    range.forEach(function (_a) {
        var rngNum = _a[0], itmTtl = _a[1];
        if (ret > 0)
            return;
        if (itmTtl === ttl) {
            ret = util(parseInt(rngNum) + 30 + "vh").toPx();
        }
    });
    if (typeof ret !== 'number')
        throw new TypeError('Exit check: Number is required.');
    return ret;
};
export var scrollToCoord = function (target) {
    var num = Math.min(target, state.master.el.scrollHeight - PIXELS_SCROLL_SPEED);
    var animScroll = function () {
        var diff = document.body.scrollTop - num;
        document.body.scrollTop -= PIXELS_SCROLL_SPEED * Math.sign(diff);
        if (Math.abs(document.body.scrollTop - num) >= Math.ceil(PIXELS_SCROLL_SPEED / 2)) {
            window.requestAnimationFrame(animScroll);
        }
        else {
            window.requestAnimationFrame(function () {
                document.body.scrollTop = num;
                var vhIdx = util(num).toVh();
                state.updated = vhIdx + "vh";
            });
        }
    };
    window.requestAnimationFrame(animScroll);
};
export var scrollToTitle = function (title) {
    var range = getRange(state.master);
    var target = getScrollCoords(range, "#" + title);
    scrollToCoord(target);
};
export default (function (mstr, root) {
    state.root = "/" + root;
    state.master = mstr;
    return {
        init: function (hash, idx, sOrE) {
            if (idx === void 0) { idx = state.idx; }
            if (sOrE === void 0) { sOrE = state.startOrEnd; }
            state.idx = idx;
            state.startOrEnd = sOrE;
            if (!hash)
                return;
            var range = getRange(state.master, state.idx, state.startOrEnd);
            var coord = getScrollCoords(range, hash);
            scrollToCoord(coord);
            document.onfocus = function (ev) {
                ev.preventDefault();
            };
            document.onfocusin = function (ev) {
                ev.preventDefault();
            };
            window.addEventListener('hashchange', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                document.scrollTop = util(state.updated).toPx();
                var range = getRange(state.master, state.idx, state.startOrEnd);
                var coord = getScrollCoords(range, document.location.hash);
                scrollToCoord(coord);
            }, true);
        },
        listen: function () {
            setInterval(function () {
                updateLocation(state.idx, state.startOrEnd);
            }, MS_INTERVAL);
        }
    };
});
//# sourceMappingURL=url.js.map