import { IN_RANGE, UPDATER, SCROLLER, LESS, VERTICAL } from './globals.js';
var GREATEST_LESS_THAN = 'greatestLessThan';
var LEAST_GREATER_THAN = 'leastGreaterThan';
var gltCompare = function (_a, _b) {
    var cham = _a[0];
    var chal = _b[0];
    if (!cham) {
        return true;
    }
    if (!chal) {
        return false;
    }
    var champScore = cham.getOpt('pixels', 'pe');
    var chalScore = chal.getOpt('pixels', 'pe');
    return chalScore > champScore;
};
var lgtCompare = function (_a, _b) {
    var cham = _a[0];
    var chal = _b[0];
    if (!cham) {
        return true;
    }
    if (!chal) {
        return false;
    }
    var champScore = cham.getOpt('pixels', 'ps');
    var chalScore = chal.getOpt('pixels', 'ps');
    return chalScore < champScore;
};
var conditionallySupplantScroller = function (comparFn, pos, champ, challenger) {
    var challengerPair = [challenger];
    var result = comparFn(champ, challengerPair);
    if (result) {
        return challengerPair;
    }
    return champ;
};
export var getEffectiveUpdaters = function (allElementScrollers) {
    var _a;
    var listsByType = {};
    var typedList = (_a = {},
        _a[GREATEST_LESS_THAN] = [],
        _a[LEAST_GREATER_THAN] = [],
        _a.inRangeScrollers = [],
        _a);
    allElementScrollers.forEach(function (scr) {
        if (scr.get('isActive') !== true) {
            return;
        }
        if (scr.get('responds') !== 'n/a')
            return;
        var type = scr.get('isUpdater') ? UPDATER : SCROLLER;
        listsByType[type] = listsByType[type] ? listsByType[type] : typedList;
        listsByType[type].inRangeScrollers.push(scr);
    });
    return listsByType;
};
export default (function (allElementScrollers, responseDir, position) {
    var _a;
    var listsByType = {};
    var typedList = (_a = {},
        _a[GREATEST_LESS_THAN] = [null, -Infinity],
        _a[LEAST_GREATER_THAN] = [null, Infinity],
        _a.inRangeScrollers = [],
        _a);
    allElementScrollers.forEach(function (scr) {
        if (scr.get('isActive') !== true) {
            return;
        }
        if (scr.get('responds') !== responseDir)
            return;
        if (scr.get('isUpdater'))
            return;
        var type = scr.get('isUpdater') ? UPDATER : SCROLLER;
        listsByType[type] = listsByType[type] ? listsByType[type] : typedList;
        var scrollerRelationResult = scr.getRelativePosition(position);
        if (scrollerRelationResult === IN_RANGE) {
            listsByType[type].inRangeScrollers.push(scr);
            return;
        }
        var scrollerRelationProperty = scrollerRelationResult ===
            LESS
            ? GREATEST_LESS_THAN
            : LEAST_GREATER_THAN;
        var champ = listsByType[type][scrollerRelationProperty];
        var compareFn = scrollerRelationProperty === GREATEST_LESS_THAN
            ? gltCompare
            : lgtCompare;
        listsByType[type][scrollerRelationProperty] = conditionallySupplantScroller(compareFn, position, champ, scr);
    });
    return listsByType;
});
export var fireApplicableUpdaters = function (pos, data) {
    if (!data)
        return;
    data.inRangeScrollers.forEach(function (scr) { return scr.update(pos); });
};
var augmentScrollResult = function (pos, res, _a) {
    var scroller = _a[0];
    if (!scroller)
        return;
    if (scroller.get('responds') === VERTICAL) {
        if (res.scrollTop === undefined) {
            res.scrollTop = scroller.getScrollResult(pos);
        }
    }
    else {
        if (res.scrollLeft === undefined) {
            res.scrollLeft = scroller.getScrollResult(pos);
        }
    }
    return res;
};
export var applicableScrollResult = function (pos, data) {
    var results = {};
    if (!data)
        return results;
    if (data.inRangeScrollers !== undefined) {
        data.inRangeScrollers.forEach(function (scr) {
            var res = scr.getScrollResult(pos);
            if (res !== undefined) {
                results[scr.get('responds') === VERTICAL ? 'scrollTop' : 'scrollLeft'] = res;
            }
        });
    }
    if (results.scrollTop !== undefined && results.scrollLeft !== undefined) {
        return results;
    }
    augmentScrollResult(pos, results, data[GREATEST_LESS_THAN]);
    augmentScrollResult(pos, results, data[LEAST_GREATER_THAN]);
    return results;
};
//# sourceMappingURL=getEffectiveScrollers.js.map