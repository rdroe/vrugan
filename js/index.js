import core from './core.js';
import { util, tr as trProxy, offsetter as offsetterProxy, postfixer as postfixerProxy } from './globals.js';
import nav, { scrollToCoord, scrollToTitle } from './url.js';
export default core;
export var tr = trProxy;
export var offsetter = offsetterProxy;
export var postfixer = postfixerProxy;
export var converter = util;
export var url = {
    nav: nav,
    scrollToCoord: scrollToCoord,
    scrollToTitle: scrollToTitle
};
//# sourceMappingURL=index.js.map