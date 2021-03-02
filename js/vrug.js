
import { vrugs } from './globals.js'
import optionsMixin from './optionsMixin.js'
const qs = (arg) => {
    return document.querySelector(arg)
}
import follower from './follower.js'

class BadScrollerSelector extends Error {
    constructor(...args) {
        super(...args)
    }
}

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
        setMasterResizer: (fn) => {
            const thisVrug = vrugs.get(el)
            thisVrug.setOpt('master-resizer', fn)
        },
        resize: () => {
            const thisVrug = vrugs.get(el)
            const followers = [...thisVrug.children.values()]

            followers.forEach((foll) => {
                foll.reactivate()
            })

            window.masterResizer.call()

        },
        addScroller: (...args) => {
            const master = vrugs.get(el)
            return addScroller(master, ...args)
        }
    }, { ...optionsMixin(vrugs.get(el)) })
}

