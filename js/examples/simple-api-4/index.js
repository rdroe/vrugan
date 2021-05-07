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
    return incrementVars(ps, location);
};
var createFollowers = function (followersToCreate, startVars, horizontalOffset) {
    var vars;
    var i = 0;
    while (i < followersToCreate) {
        var _a = vars || startVars, pss = _a[0], pee = _a[1], llo = _a[2];
        vars = createFollower(pss, pee, llo);
        nudgeLast(horizontalOffset + i * 5);
        i++;
    }
};
var initVars = [startPs, startPe, startLocation];
createFollowers(5, initVars, 12);
var delaySet = 300;
createFollowers(7, [startPs + delaySet, startPe + delaySet, 75], 22);
delaySet = 700;
createFollowers(12, [startPs + delaySet, startPe + delaySet, 30], 30);
delaySet = 900;
createFollowers(4, [startPs + delaySet, startPe + delaySet, 40], 8);
delaySet = 1500;
createFollowers(8, [startPs + delaySet, startPe + delaySet, 60], 15);
document.querySelector('body > .container').style.height = '3000vh';
//# sourceMappingURL=index.js.map