import { qs } from '/js/util/util.js'
import { vrugs } from './globals.js'

import follower from './follower.js'

export const vrug = (sel) => {
    const el = qs(sel)
    if (!el) throw new Error()
    if (vrugs.has(el)) return vrugs.get(el)
    const master = vrugFns(el)
    vrugs.set(el, master)
    return master
}



const vrugFns = (el) => {

    return {
        el,
        children: new Map,
        scrolls: (chSel) => {
            const chEl = qs(chSel)
            return follower(chEl, el)
        }
    }
}


