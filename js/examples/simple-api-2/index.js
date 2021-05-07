import vrug from '../../index.js';
var master = vrug('body');
var movementSpan = 100;
var ps = 100;
var pe = ps + movementSpan;
var pause = 320;
var follower = master.fromBelow(ps, pe, 20, 30);
follower.resume(pe + pause, pe + pause + movementSpan, 30);
follower.resume(pe + pause * 3, pe + pause * 3 + movementSpan, 50);
//# sourceMappingURL=index.js.map