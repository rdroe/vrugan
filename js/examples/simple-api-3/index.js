import vrug from '../../index.js';
var master = vrug('body');
var movementSpan = 150;
var pause = 200;
var delay = 50;
var startPs = 100;
var startPe = startPs + movementSpan;
var startLocation = 20;
var nudge = 0;
var incrementVars = function (previousPs, previousLocation) {
    var nextPs = previousPs + delay;
    var nextPe = nextPs + movementSpan;
    var nextLoc = previousLocation + 12;
    return [nextPs, nextPe, nextLoc];
};
var nudgeLast = function (nudgeBy) {
    var lastAdded = document.querySelector('body > .container > div:last-child');
    lastAdded.style.marginLeft = nudgeBy + "vw";
};
var createFollower = function (ps, pe, location) {
    master.fromBelow(ps, pe, location, 30)
        .resume(pe + pause, pe + pause + movementSpan, 30)
        .resume(pe + pause * 3, pe + pause * 3 + movementSpan, 50);
    nudge += 5;
};
createFollower(startPs, startPe, startLocation);
nudgeLast(nudge);
var _a = incrementVars(startPs, startLocation), ps2 = _a[0], pe2 = _a[1], loc2 = _a[2];
createFollower(ps2, pe2, loc2);
nudgeLast(nudge);
var _b = incrementVars(ps2, loc2), ps3 = _b[0], pe3 = _b[1], loc3 = _b[2];
createFollower(ps3, pe3, loc3);
nudgeLast(nudge);
var _c = incrementVars(ps3, loc3), ps4 = _c[0], pe4 = _c[1], loc4 = _c[2];
createFollower(ps4, pe4, loc4);
nudgeLast(nudge);
var _d = incrementVars(ps4, loc4), ps5 = _d[0], pe5 = _d[1], loc5 = _d[2];
createFollower(ps5, pe5, loc5);
nudgeLast(nudge);
var _e = incrementVars(ps5, loc5), ps6 = _e[0], pe6 = _e[1], loc6 = _e[2];
createFollower(ps6, pe6, loc6);
nudgeLast(nudge);
//# sourceMappingURL=index.js.map