
import { vrugs } from './globals.js'
import optionsMixin from './optionsMixin.js'
import follower from './follower.js'

const qs = (arg) => {
    return document.querySelector(arg)
}

class BadScrollerSelector extends Error {
    constructor(...args) {
        super(...args)
    }
}

const vrugFns = (el) => {

    return Object.assign({
        el,
        children: new Map,
        scrolls: (chSel) => {
            const chEl = qs(chSel)
            if (!chEl) {
                throw new BadScrollerSelector(chSel)
            }
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

            if (window.masterResizer) window.masterResizer()

        },
        addScroller: (...args) => {
            const master = vrugs.get(el)
            return addScroller(master, ...args)
        }
    }, { ...optionsMixin(vrugs.get(el)) })
}

export default (sel) => {
    const el = qs(sel)
    if (!el) throw new BadScrollerSelector(`Main element not found: ${sel}`)
    if (vrugs.has(el)) return vrugs.get(el)
    const master = vrugFns(el)
    vrugs.set(el, master)
    return master
}

const addScroller = (master, sel) => {
    return master
        .scrolls(sel)
}

