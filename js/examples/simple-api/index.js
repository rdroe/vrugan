import vrug from '../../index.js';
var master = vrug('body');
master.fromBelow(100, 200, 20, 100);
master.fromLeft(201, 300, 50, 90);
master.fromTop(301, 400, 20, 90);
master.fromRight(401, 500, 20, 100)
    .fromBelow(401, 500, 0, 70);
//# sourceMappingURL=index.js.map