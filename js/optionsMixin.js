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
var DontResetImmutable = (function (_super) {
    __extends(DontResetImmutable, _super);
    function DontResetImmutable() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    return DontResetImmutable;
}(Error));
var MissingArgument = (function (_super) {
    __extends(MissingArgument, _super);
    function MissingArgument() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    return MissingArgument;
}(Error));
var NamespaceIsMissing = (function (_super) {
    __extends(NamespaceIsMissing, _super);
    function NamespaceIsMissing() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    return NamespaceIsMissing;
}(Error));
var UndefinedProperty = (function (_super) {
    __extends(UndefinedProperty, _super);
    function UndefinedProperty() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    return UndefinedProperty;
}(Error));
export default (function (thisChild) { return ({
    setOptOnce: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return thisChild._setOpt(args, true);
    },
    setOpt: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return thisChild._setOpt(args, false);
    },
    _setOpt: function (_a, requireMatch) {
        var arg1 = _a[0], arg2 = _a[1], arg3 = _a[2];
        if (requireMatch === void 0) { requireMatch = false; }
        if (arg2 === undefined)
            throw new MissingArgument();
        var ch = thisChild;
        var opts = ch.opts;
        if (arg3 === undefined) {
            var _b = [arg1, arg2], key = _b[0], val = _b[1];
            if (opts.has(key)) {
                if (requireMatch && opts.get(key) !== val)
                    throw new DontResetImmutable();
            }
            opts.set(key, val);
            return ch;
        }
        else {
            var _c = [arg1, arg2, arg3], namespace = _c[0], key = _c[1], val = _c[2];
            if (!opts.has(namespace)) {
                opts.set(namespace, new Map);
            }
            var nsMap = opts.get(namespace);
            if (nsMap.has(key)) {
                if (requireMatch && nsMap.get(key) !== val)
                    throw new DontResetImmutable();
            }
            nsMap.set(key, val);
            return ch;
        }
    },
    getOpt: function (arg1, arg2) {
        var ch = thisChild;
        var opts = ch.opts;
        if (arg2 === undefined)
            return opts.get(arg1);
        if (!opts.has(arg1)) {
            throw new NamespaceIsMissing();
        }
        var ns = opts.get(arg1);
        if (!ns.has(arg2)) {
            throw new UndefinedProperty();
        }
        return ns.get(arg2);
    }
}); });
//# sourceMappingURL=optionsMixin.js.map