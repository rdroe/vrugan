import vrug, { url } from '../../index.js';
var master = vrug('body');
var nav = url.nav(master, 'linkable/index.html');
var follower = master
    .addScroller('.stage-view.from-right')
    .addDirection('h', 0, 100, 0, 100)
    .addDirection('v', 0, 45, 25, 50)
    .addDirection('v', 45, 195, 125, 375);
follower.setOpt('title', 'vrug-1');
var offset = 250;
var follower1 = master
    .addScroller('.stage-view.from-left')
    .addDirection('h', 100, 0, offset, offset + 100)
    .addDirection('v', 0, 45, offset + 25, offset + 50)
    .addDirection('v', 45, 195, offset + 125, offset + 375);
follower1.setOpt('title', 'vrug-2');
follower.init();
follower1.init();
nav.init(document.location.hash, 1, 'e');
nav.listen();
//# sourceMappingURL=index.js.map