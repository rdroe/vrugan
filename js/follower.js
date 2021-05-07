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
import { vrugs, UPDATER, SCROLLER, VERTICAL, HORIZONTAL, assert, asVw, asVh, showScrollers, unitize } from './globals.js';
import scroller from './scroller.js';
import optionsMixin from './optionsMixin.js';
import getEffectiveScrollers, { applicableScrollResult, fireApplicableUpdaters, getEffectiveUpdaters } from './getEffectiveScrollers.js';
import { follower as apiMixin } from './simple-api.js';
import { scrollToTitle } from './url.js';
var cntr = 0;
var InvalidUnit = (function (_super) {
    __extends(InvalidUnit, _super);
    function InvalidUnit() {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return _super.apply(this, a) || this;
    }
    return InvalidUnit;
}(Error));
var lookUpOrMake = function (map, obj, wrapperFn) {
    if (map.has(obj))
        return map.get(obj);
    var wrapped = wrapperFn ? wrapperFn(obj) : new Map;
    map.set(obj, wrapped);
    return wrapped;
};
export var addDirection = function (follower, dir, s, e, ps, pe, senseUnit) {
    if (senseUnit === void 0) { senseUnit = 'vw'; }
    var toOwnUnits = dir === 'h' ? asVw : asVh;
    follower
        .senses('v')
        .responds(dir)
        .set('start', toOwnUnits(s))
        .set('end', toOwnUnits(e))
        .set('parentStart', unitize(ps, senseUnit))
        .set('parentEnd', unitize(pe, senseUnit))
        .listen();
    return follower;
};
export var addUpdater = function (follower, fn, ps, pe, overrideSenseUnits) {
    if (overrideSenseUnits === void 0) { overrideSenseUnits = 'vw'; }
    var parentStart = unitize(ps, overrideSenseUnits);
    var parentEnd = unitize(pe, overrideSenseUnits);
    follower
        .senses('v')
        .set('parentStart', parentStart)
        .set('parentEnd', parentEnd)
        .listen(fn);
    return follower;
};
export default (function (childEl, el) {
    var _a;
    var top = vrugs.get(el);
    if (!top.children.has(childEl)) {
        top.children.set(childEl, {});
    }
    var thisChild = top.children.get(childEl);
    var fireScrollers = function (pos) {
        var verticalScrollingData = getEffectiveScrollers(thisChild.scrollers, VERTICAL, pos);
        var horizontalScrollingData = getEffectiveScrollers(thisChild.scrollers, HORIZONTAL, pos);
        showScrollers(verticalScrollingData, horizontalScrollingData);
        var vertResults = applicableScrollResult(pos, verticalScrollingData[SCROLLER]);
        var horizResults = applicableScrollResult(pos, horizontalScrollingData[SCROLLER]);
        var final = { scrollLeft: horizResults.scrollLeft, scrollTop: vertResults.scrollTop };
        return final;
    };
    var fireUpdaters = function (pos) {
        var activeScrollerData = getEffectiveUpdaters(thisChild.scrollers, pos);
        fireApplicableUpdaters(pos, activeScrollerData[UPDATER]);
    };
    var handlers = (_a = {},
        _a[SCROLLER] = function () {
            var pos = el.scrollTop;
            var _a = fireScrollers(pos), scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
            if (childEl) {
                childEl.scrollTop = typeof scrollTop === 'number' ? scrollTop : childEl.scrollTop;
                childEl.scrollLeft = typeof scrollLeft === 'number' ? scrollLeft : childEl.scrollLeft;
            }
        },
        _a[UPDATER] = function () {
            fireUpdaters(el.scrollTop);
        },
        _a);
    return Object.assign(thisChild, __assign(__assign({ scrollers: new Map, doers: new Map, opts: new Map, _limit: function (eOrS) {
            assert(function () { return ['e', 's'].includes(eOrS); }, 'arg for limit most be "e" or "s" (for end or start) ');
            var pes = __spreadArray([], thisChild.scrollers.values()).map(function (scr) {
                var propName = eOrS === 'e' ? 'parentEnd' : 'parentStart';
                return parseInt(scr.get(propName), 10);
            });
            return eOrS === 'e' ? Math.max.apply(Math, pes) : Math.min.apply(Math, pes);
        }, end: function () {
            return thisChild._limit('e');
        }, start: function () {
            return thisChild._limit('s');
        }, asLinkableRange: function () {
            var linkFn = thisChild.getOpt('linkFn');
            if (linkFn)
                return linkFn.call(null, thisChild);
            return null;
        }, nthStage: function (n) {
            var all = __spreadArray([], thisChild.scrollers.values());
            var pes = all.reduce(function (accum, scr, idx) {
                var _a;
                var strtWithUnits = scr.get('parentStart');
                var endWithUnits = scr.get('parentEnd');
                var strt = parseInt(scr.get('parentStart'), 10);
                return __assign(__assign({}, accum), (_a = {}, _a[strt] = [strtWithUnits, endWithUnits, scr], _a));
            }, {});
            var nth = Object.values(pes)[n];
            if (!nth)
                throw new Error('Could not get an nth stage for a scroller; ' + ("index: " + n));
            return nth;
        }, reactivate: function () {
            thisChild.scrollers.forEach(function (scr) {
                var type = scr.get('isUpdater') ? UPDATER : SCROLLER;
                if (type === UPDATER) {
                    var fn = scr.get('fn');
                    scr.listen(fn);
                }
                else {
                    scr.listen();
                }
            });
            thisChild.init();
        }, activate: function (parent, type) {
            if (type === UPDATER) {
                parent.el.removeEventListener('scroll', handlers[UPDATER]);
                parent.el.addEventListener('scroll', handlers[UPDATER]);
                return;
            }
            parent.el.removeEventListener('scroll', handlers[SCROLLER]);
            parent.el.addEventListener('scroll', handlers[SCROLLER]);
        }, scrollWrapper: function (senses, id) { return scroller(id, senses, childEl, el); }, senses: function (dir) {
            assert(function () { return [VERTICAL, HORIZONTAL].includes(dir); });
            var identifier = thisChild.getIdentifier(dir);
            var scroller = lookUpOrMake(thisChild.scrollers, identifier, function (ident) { return thisChild.scrollWrapper(dir, ident); });
            return scroller;
        }, init: function () {
            handlers[SCROLLER]();
            handlers[UPDATER]();
        }, getIdentifier: function (dir) {
            var id = dir + "--" + cntr + " ";
            cntr += 1;
            return id;
        }, doerWrapper: function () { return ({}); }, doer: function () { return ({}); }, addDirection: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return addDirection.apply(void 0, __spreadArray([thisChild], args));
        }, addUpdater: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return addUpdater.apply(void 0, __spreadArray([thisChild], args));
        }, makeFocusable: function (title, tabIndex) {
            if (tabIndex === void 0) { tabIndex = 0; }
            if (!title)
                return;
            thisChild.setOpt('title', title);
            var parElem = childEl.parentElement;
            if (parElem.tagName !== 'MAIN')
                return;
            var a = document.createElement('div');
            a.setAttribute('name', title);
            a.setAttribute('id', title);
            a.setAttribute('aria-label', title);
            a.setAttribute('aria-role', 'region');
            parElem.insertBefore(a, childEl);
            a.appendChild(childEl);
            a.setAttribute('tabindex', tabIndex);
            var setHash = function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                a.setAttribute('id', '');
                scrollToTitle(title);
                var newUrl = "#" + title;
                history.replaceState({}, document.title, newUrl);
                a.setAttribute('id', title);
            };
            a.onfocus = function () {
                var argz = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argz[_i] = arguments[_i];
                }
                argz[0].preventDefault();
                setHash.call.apply(setHash, __spreadArray([null], argz));
            };
        } }, optionsMixin(thisChild)), apiMixin()));
});
//# sourceMappingURL=follower.js.map