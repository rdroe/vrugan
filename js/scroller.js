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
import { VERTICAL, LESS, GREATER, IN_RANGE, UPDATER, vrugs, util, tr, unitize } from './globals.js';
import optionsMixin from './optionsMixin.js';
export default (function (id, senses, childEl, el) {
    var top = vrugs.get(el);
    var wrappedEl;
    var getWrappedEl = function () {
        wrappedEl = wrappedEl || top.children.get(childEl);
        return wrappedEl;
    };
    var sibScrollers = function () {
        var wrappedEl = getWrappedEl();
        return wrappedEl.scrollers;
    };
    var getThisScroller = function () {
        var ss = sibScrollers();
        if (!ss.has(id)) {
            ss.set(id, {});
        }
        return ss.get(id);
    };
    var proportion = function (nume, divi) {
        return tr(nume / divi * 100) / 100;
    };
    var thisScroller = getThisScroller();
    return Object.assign(thisScroller, __assign({ id: id, el: childEl, opts: new Map, listen: function (fn) {
            var ps = util(thisScroller.get('parentStart')).toPx();
            var pe = util(thisScroller.get('parentEnd')).toPx();
            thisScroller.set('pixels', 'ps', ps);
            thisScroller.set('pixels', 'pe', pe);
            var senseProp = senses === VERTICAL ? 'scrollTop' : 'scrollLeft';
            thisScroller.set('senseProp', senseProp);
            thisScroller.set('isActive', true);
            if (fn === undefined) {
                return thisScroller.scrollResponder(fn);
            }
            return thisScroller.functionResponder(fn);
        }, scrollResponder: function () {
            var ps = thisScroller.get('pixels', 'ps');
            var pe = thisScroller.get('pixels', 'pe');
            getWrappedEl().activate(top);
            thisScroller.set('senses', senses);
            var s = util(thisScroller.get('start')).toPx();
            var e = util(thisScroller.get('end')).toPx();
            thisScroller.set('pixels', 's', s);
            thisScroller.set('pixels', 'e', e);
            var traversable = e - s;
            var ratio = proportion(traversable, (pe - ps));
            thisScroller.set('ratio', ratio);
            return getThisScroller();
        }, functionResponder: function (fn) {
            thisScroller.responds('n/a');
            thisScroller.set('isUpdater', true);
            thisScroller.set('fn', fn);
            getWrappedEl().activate(top, UPDATER);
        },
        getScrollResult: function (pos) {
            var pe = thisScroller.get('pixels', 'pe');
            var ps = thisScroller.get('pixels', 'ps');
            var ratio = thisScroller.get('ratio');
            var s = thisScroller.get('pixels', 's');
            var e = thisScroller.get('pixels', 'e');
            if (pos > ps && pos < pe) {
                var traversed = (pos - ps);
                var scaledTraversal = tr(traversed * ratio);
                return s + scaledTraversal;
            }
            else if (pos <= ps) {
                return s;
            }
            else {
                return e;
            }
        },
        getRelativePosition: function (pos) {
            var pe = thisScroller.get('pixels', 'pe');
            var ps = thisScroller.get('pixels', 'ps');
            if (pos >= ps && pos <= pe) {
                return IN_RANGE;
            }
            else if (pos > ps) {
                return LESS;
            }
            else if (pos < ps) {
                return GREATER;
            }
        }, update: function (pos) {
            thisScroller.get('fn').call(thisScroller, pos, thisScroller);
        }, responds: function (dir) {
            return thisScroller.set('responds', dir);
        }, set: function (arg1, arg2, arg3) {
            return thisScroller.setOpt(arg1, arg2, arg3);
        }, get: function (nsOrProp, prop) {
            return thisScroller.getOpt(nsOrProp, prop);
        }, showScroller: function () {
            var isVisible = thisScroller.get('isVisible');
            if (!thisScroller.el) {
                throw new Error('No el property on trying to showScroller');
            }
            if (isVisible !== true) {
                thisScroller.set('isVisible', true);
                thisScroller.el.style.left = '0px';
            }
        }, on: function (ps, pe) {
            thisScroller.set('parentStart', unitize(ps, 'vh'));
            thisScroller.set('parentEnd', unitize(pe, 'vh'));
            return thisScroller;
        } }, optionsMixin(getThisScroller())));
});
//# sourceMappingURL=scroller.js.map