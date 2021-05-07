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
export var vrugs = new Map;
export var VERTICAL = 'v';
export var HORIZONTAL = 'h';
export var LESS = '<';
export var GREATER = '>';
export var IN_RANGE = 'in_range';
export var UPDATER = 'updater';
export var SCROLLER = 'scroller';
var Invariant = (function (_super) {
    __extends(Invariant, _super);
    function Invariant() {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return _super.apply(this, a) || this;
    }
    return Invariant;
}(Error));
var InvalidScrollParam = (function (_super) {
    __extends(InvalidScrollParam, _super);
    function InvalidScrollParam() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    return InvalidScrollParam;
}(TypeError));
var CannotCloseNonexistentRange = (function (_super) {
    __extends(CannotCloseNonexistentRange, _super);
    function CannotCloseNonexistentRange() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    return CannotCloseNonexistentRange;
}(Error));
var toPxFromVw = function (arg1) {
    var parsed = parseInt(arg1, 10);
    if (parsed + "vw" !== arg1)
        throw new InvalidScrollParam;
    return Math.trunc(parsed / 100 * window.innerWidth);
};
var toPxFromVh = function (arg1) {
    var parsed = parseInt(arg1, 10);
    if (parsed + "vh" !== arg1)
        throw new InvalidScrollParam;
    return Math.trunc(parsed / 100 * window.innerHeight);
};
export var util = function (arg1) { return ({
    toPx: function () {
        if (arg1.includes('vw/h')) {
            if (window.innerWidth > window.innerHeight) {
                return util(parseInt(arg1) + "vw").toPx();
            }
            else {
                util(parseInt(arg1) + "vh").toPx();
                return util(parseInt(arg1) + "vh").toPx();
            }
        }
        return arg1.includes('vh') ? toPxFromVh(arg1) : toPxFromVw(arg1);
    },
    toVw: function () {
        var ret = tr(arg1 * 100 / window.innerWidth);
        return ret + "vw";
    },
    toVh: function () {
        var ret = tr(arg1 * 100 / window.innerHeight);
        return ret + "vh";
    }
}); };
export var postfixer = function (outputter, unit) {
    return function (arg) {
        var retVal = outputter(arg);
        return "" + retVal + unit;
    };
};
export var offsetter = function (offset) {
    if (offset === void 0) { offset = 0; }
    var starts = [];
    var ends = [];
    return {
        starts: starts, ends: ends,
        startPoint: function (num) {
            var prevEnd = ends.length === 0
                ? offset
                : ends[ends.length - 1];
            var newStart = prevEnd + num;
            starts[starts.length] = newStart;
            return newStart;
        },
        endPoint: function (num) {
            if (starts.length === 0)
                throw new CannotCloseNonexistentRange;
            var prevStart = starts[starts.length - 1];
            var newEnd = prevStart + num;
            ends[ends.length] = newEnd;
            return newEnd;
        },
        lastStart: function () {
            return starts[starts.length - 1];
        },
        lastEnd: function () {
            return ends[ends.length - 1];
        }
    };
};
export var tr = function (num) { return Math.trunc(num); };
export var assert = function (fn, msg) {
    if (!fn())
        throw new Invariant(msg);
};
export var qs = function (sel) {
    return document.querySelector(sel);
};
export var asVw = function (n) { return n + "vw"; };
export var asVh = function (n) { return n + "vh"; };
var showScrollers_ = function (_a) {
    var _b = _a === void 0 ? { inRangeScrollers: [] } : _a, scrs = _b.inRangeScrollers;
    scrs.forEach(function (scr) {
        scr.showScroller();
    });
};
export var showScrollers = function (_a, _b) {
    var s1 = _a.scroller;
    var s2 = _b.scroller;
    showScrollers_(s1);
    showScrollers_(s2);
};
export var unitize = function (anArg, u) {
    if (!u)
        throw new InvalidUnit;
    if (typeof (anArg) === 'number') {
        return "" + anArg + u;
    }
    var parsedToInt = parseInt(anArg, 10);
    var candidateConversion = "" + parsedToInt + u;
    return candidateConversion;
};
//# sourceMappingURL=globals.js.map