
import core from './js/core.js'

import { util as utilProxy, tr as trProxy, offsetter as offsetterProxy, postfixer as postfixerProxy } from './js/globals.js'

import nav, { scrollToCoord, scrollToTitle } from './js/url.js'

export default core
export const util = utilProxy
export const tr = trProxy
export const offsetter = offsetterProxy
export const postfixer = postfixerProxy
export const url = {
    nav,
    scrollToCoord,
    scrollToTitle
}
