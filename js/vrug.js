import { qs } from '/js/util/util.js'
import { vrugs, asVw, asVh } from './globals.js'

import follower from './follower.js'

export const vrug = (sel) => {

    const el = qs(sel)
    if (!el) throw new Error()
    if (vrugs.has(el)) return vrugs.get(el)
    const master = vrugFns(el)
    vrugs.set(el, master)
    return master
}

export const addScroller = (master, sel) => {
    return master
        .scrolls(sel)
}

const vrugFns = (el) => {

    return {
        el,
        children: new Map,
        scrolls: (chSel) => {
            const chEl = qs(chSel)
            const f = follower(chEl, el)
            const thisVrug = vrugs.get(el)
            window.removeEventListener('resize', thisVrug.resize)
            window.addEventListener('resize', thisVrug.resize)
            return f
        },
        resize: () => {
            const thisVrug = vrugs.get(el)
            const followers = [...thisVrug.children.values()]
            followers.forEach((foll) => {
                foll.reactivate()
            })
        },
        addScroller: (...args) => {
            const master = vrugs.get(el)
            return addScroller(master, ...args)
        }
    }
}

