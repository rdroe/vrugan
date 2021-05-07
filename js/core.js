var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { vrugs } from './globals.js';
import optionsMixin from './optionsMixin.js';
import follower from './follower.js';
import simpleApi from './simple-api.js';
var qs = function (arg) {
    return document.querySelector(arg);
};
var BadScrollerSelector = (function (_super) {
    __extends(BadScrollerSelector, _super);
    function BadScrollerSelector() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    return BadScrollerSelector;
}(Error));
var vrugFns = function (el) {
    return Object.assign({
        el: el,
        children: new Map,
        scrolls: function (chSel) {
            var chEl = typeof chSel === 'string' ? qs(chSel) : chSel;
            if (!chEl) {
                throw new BadScrollerSelector(chSel);
            }
            var f = follower(chEl, el);
            var thisVrug = vrugs.get(el);
            window.removeEventListener('resize', thisVrug.resize);
            window.addEventListener('resize', thisVrug.resize);
            return f;
        },
        resize: function () {
            var thisVrug = vrugs.get(el);
            var followers = __spreadArray([], thisVrug.children.values());
            followers.forEach(function (foll) {
                foll.reactivate();
            });
            if (window.masterResizer)
                window.masterResizer();
        },
        addScroller: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var master = vrugs.get(el);
            return addScroller.apply(void 0, __spreadArray([master], args));
        }
    }, __assign({}, simpleApi(el)), __assign({}, optionsMixin(vrugs.get(el))));
};
export default (function (sel) {
    var el = qs(sel);
    if (!el)
        throw new BadScrollerSelector("Main element not found: " + sel);
    if (vrugs.has(el))
        return vrugs.get(el);
    var master = vrugFns(el);
    vrugs.set(el, master);
    return master;
});
var addScroller = function (master, sel) {
    return master
        .scrolls(sel);
};
//# sourceMappingURL=core.js.map