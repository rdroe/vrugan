var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { vrugs, asVh, asVw } from './globals.js';
var createElem = function (parentEl, id) {
    if (id === void 0) { id = null; }
    var el = document.createElement('div');
    if (id) {
        el.setAttribute('id', id);
    }
    parentEl.appendChild(el);
    return el;
};
var createOrGetMainSurface = function (masterEl) {
    var containerEl = masterEl.querySelector('.container');
    if (containerEl)
        return containerEl;
    containerEl = createElem(masterEl);
    containerEl.setAttribute('class', 'container');
    containerEl.style.width = '100%';
    containerEl.style.position = 'relative';
    containerEl.style.height = '1900vh';
    return containerEl;
};
var createScrollerElem = function (masterEl, idx) {
    masterEl.style.width = masterEl.style.height = '100%';
    masterEl.style.position = 'fixed';
    masterEl.style.overflowY = 'scroll';
    masterEl.style.margin = 0;
    var mainSurface = createOrGetMainSurface(masterEl, 'container');
    var stageView = createElem(mainSurface, "vrug-stage-" + idx);
    var stageSurface = createElem(stageView, "vrug-surface-" + idx);
    var visible = createElem(stageSurface, "vrug-visible-" + idx);
    return [stageView, stageSurface, visible];
};
var setIfUndefined = function (ref, propName, val, elem) {
    if (elem === void 0) { elem = null; }
    if (ref[propName] === '')
        ref[propName] = val;
};
var simpleFollower = function (view, surface, follower, defaults) {
    var responds = defaults.responds, ps = defaults.ps, pe = defaults.pe, s = defaults.s, e = defaults.e, w = defaults.w, h = defaults.h, trace = defaults.trace, override = defaults.override;
    var visible = follower.getOpt('visible');
    var positionUnit = responds === 'h' ? 'vw' : 'vh';
    var _a = override.placement, propName = _a[0], val = _a[1];
    var scroller = follower.senses('v');
    if (h)
        setIfUndefined(surface.style, 'height', h);
    if (w)
        setIfUndefined(surface.style, 'width', w);
    if (override.h)
        surface.style.height = override.h;
    if (override.w)
        surface.style.width = override.w;
    surface.style[propName] = val;
    setIfUndefined(surface.style, 'position', 'absolute');
    setIfUndefined(visible.style, 'position', 'absolute');
    setIfUndefined(visible.style, 'height', '100vh');
    setIfUndefined(visible.style, 'width', '100vw');
    setIfUndefined(visible.style, 'top', 0);
    setIfUndefined(visible.style, 'left', 0);
    setIfUndefined(visible, 'innerHTML', '<div>vrugan</div>');
    setIfUndefined(visible.style, 'fontFamily', 'helvetica');
    setIfUndefined(visible.style, 'fontSize', '10vh');
    setIfUndefined(visible.style, 'position', 'absolute');
    visible.style[propName] = "100" + positionUnit;
    setIfUndefined(view.style, 'position', 'fixed');
    setIfUndefined(view.style, 'width', '100vw');
    setIfUndefined(view.style, 'height', '100vh');
    setIfUndefined(view.style, 'pointerEvents', 'none');
    scroller.responds(responds);
    scroller.set('start', s);
    scroller.set('end', e);
    scroller.set('parentStart', ps + "vh");
    scroller.set('parentEnd', pe + "vh");
    scroller.listen();
    if (trace) {
        surface.style.borderStyle = 'dashed';
    }
    follower.init();
    return follower;
};
var createFollower = function (el, existing) {
    if (existing) {
        var surface_1 = existing.getOpt('surface');
        var view_1 = existing.getOpt('view');
        return { surface: surface_1, view: view_1, follower: existing };
    }
    var thisVrug = vrugs.get(el);
    var idx = thisVrug.children.size;
    var _a = createScrollerElem(thisVrug.el, idx), view = _a[0], surface = _a[1], visible = _a[2];
    var follower = thisVrug.scrolls(view);
    follower.setOpt('master', thisVrug);
    follower.setOpt('view', view);
    follower.setOpt('surface', surface);
    follower.setOpt('visible', visible);
    return {
        thisVrug: thisVrug,
        idx: idx,
        view: view,
        surface: surface,
        follower: follower
    };
};
var offElementStopAt = function (distanceOut, stopAt) {
    var num = (100 - stopAt) / ((100 + distanceOut) / 100);
    var rounded = Math.round(num);
    return rounded;
};
var signature = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 4) {
        return signatureFour.apply(void 0, args);
    }
    else if (args.length === 5) {
        return signatureFive.apply(void 0, args);
    }
    return {};
};
var signatureFour = function (ps, pe, distanceOut, stopAt) { return ({ ps: ps, pe: pe, distanceOut: distanceOut, stopAt: stopAt }); };
var signatureFive = function (follower, ps, pe, distanceOut, stopAt) { return ({ follower: follower, ps: ps, pe: pe, distanceOut: distanceOut, stopAt: stopAt }); };
var getCtxFromArgs = function (el, args) {
    var _a = signature.apply(void 0, args), existingFollower = _a.follower, ps = _a.ps, pe = _a.pe, distanceOut = _a.distanceOut, stopAt = _a.stopAt;
    var _b = createFollower(el, existingFollower), view = _b.view, surface = _b.surface, follower = _b.follower;
    return { ps: ps, pe: pe, distanceOut: distanceOut, stopAt: stopAt, view: view, surface: surface, follower: follower };
};
export default (function (el) {
    var thisVrug;
    var getThisVrug = function () {
        if (thisVrug)
            return thisVrug;
        return vrugs.get(el);
    };
    return {
        fromBelow: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = getCtxFromArgs(el, args), ps = _a.ps, pe = _a.pe, distanceOut = _a.distanceOut, stopAt = _a.stopAt, view = _a.view, surface = _a.surface, follower = _a.follower;
            var computedStopAt = offElementStopAt(distanceOut, stopAt);
            return simpleFollower(view, surface, follower, {
                caller: 'b',
                responds: 'v',
                ps: ps,
                pe: pe,
                s: asVh(0),
                e: asVh(100 + distanceOut - computedStopAt),
                w: '100vw',
                override: {
                    h: '300vh',
                    placement: ['top', asVh(distanceOut)]
                },
                placement: ['top', asVh(distanceOut)]
            });
        },
        fromTop: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = getCtxFromArgs(el, args), ps = _a.ps, pe = _a.pe, distanceOut = _a.distanceOut, stopAt = _a.stopAt, view = _a.view, surface = _a.surface, follower = _a.follower;
            return simpleFollower(view, surface, follower, {
                caller: 't',
                responds: 'v',
                ps: ps,
                pe: pe,
                s: asVh(100 + distanceOut),
                e: asVh(100 - stopAt),
                w: '100vw',
                override: {
                    h: '300vh',
                    placement: ['top', '0vh']
                }
            });
        },
        fromLeft: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = getCtxFromArgs(el, args), ps = _a.ps, pe = _a.pe, distanceOut = _a.distanceOut, stopAt = _a.stopAt, view = _a.view, surface = _a.surface, follower = _a.follower;
            return simpleFollower(view, surface, follower, {
                caller: 'l',
                responds: 'h',
                ps: ps,
                pe: pe,
                s: asVw(100 + distanceOut),
                e: asVw(100 - stopAt),
                h: '100vh',
                override: {
                    w: '300vw',
                    placement: ['left', '0vw']
                }
            });
        },
        fromRight: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = getCtxFromArgs(el, args), ps = _a.ps, pe = _a.pe, distanceOut = _a.distanceOut, stopAt = _a.stopAt, view = _a.view, surface = _a.surface, follower = _a.follower;
            var computedStopAt = offElementStopAt(distanceOut, stopAt);
            return simpleFollower(view, surface, follower, {
                caller: 'r',
                responds: 'h',
                ps: ps,
                pe: pe,
                s: asVw(0),
                e: asVw(100 + distanceOut - computedStopAt),
                h: '100vh',
                override: {
                    w: '300vw',
                    placement: ['left', asVw(distanceOut)]
                }
            });
        }
    };
});
export var follower = function () {
    return {
        lastScrollerAdded: function () {
            var keys = Array.from(this.scrollers.keys());
            keys.sort(function (a, b) {
                var aN = parseInt(a.split('--')[1]);
                var bN = parseInt(b.split('--')[1]);
                if (aN === bN)
                    return 0;
                if (aN > bN)
                    return 1;
                if (bN > aN)
                    return -1;
            });
            var lastScrollerKey = keys[keys.length - 1];
            var lastScrollerAdded = this.scrollers.get(lastScrollerKey);
            return lastScrollerAdded;
        },
        resume: function (ps, pe, howFar) {
            var lastScrollerAdded = this.lastScrollerAdded();
            var s = parseInt(lastScrollerAdded.get('end'));
            var prevPe = lastScrollerAdded.get('parentEnd');
            if (ps < parseInt(prevPe)) {
                throw new Error('You can only resume with a master start point greater than the last scroller endpoint');
            }
            var dir = lastScrollerAdded.get('responds');
            var unit = dir === 'h' ? asVw : asVh;
            var scr = this.senses('v');
            scr.responds(dir);
            scr.set('start', unit(s));
            scr.set('end', unit(s + howFar));
            scr.set('parentStart', ps + "vh");
            scr.set('parentEnd', pe + "vh");
            scr.listen();
            return this;
        },
        fromLeft: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var master = this.getOpt('master');
            return master.fromLeft.apply(master, __spreadArray([this], args));
        },
        fromRight: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var master = this.getOpt('master');
            return master.fromRight.apply(master, __spreadArray([this], args));
        },
        fromTop: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var master = this.getOpt('master');
            return master.fromTop.apply(master, __spreadArray([this], args));
        },
        fromBelow: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var master = this.getOpt('master');
            return master.fromBelow.apply(master, __spreadArray([this], args));
        }
    };
};
//# sourceMappingURL=simple-api.js.map