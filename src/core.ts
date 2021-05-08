import { vrugs } from './globals.js'
import optionsMixin from './optionsMixin.js'
import follower from './follower.js'
import simpleApi from './simple-api.js'

declare type Vrugan = {
    scrolls: (s: string) => any
}

declare global {
    interface Window {
        masterResizer: () => void
    }
}

const qs = (arg: string): HTMLElement => {

    const element: HTMLElement | null = document.querySelector(arg)
    if (element === null) {
        throw new BadScrollerSelector(arg)
    }
    return element
}

class BadScrollerSelector extends Error {
    constructor(message: string) {
        super(message)
    }
}

const vrugFns = (el: HTMLElement) => {

    return Object.assign({
        el,
        children: new Map,
        scrolls: (chSel: string | HTMLElement) => {
            const chEl: HTMLElement = typeof chSel === 'string' ? qs(chSel) : chSel

            const f = follower(chEl, el)
            const thisVrug = vrugs.get(el)
            window.removeEventListener('resize', thisVrug.resize)
            window.addEventListener('resize', thisVrug.resize)
            return f
        },
        resize: () => {
            const thisVrug = vrugs.get(el)
            thisVrug.children.forEach((foll: any) => {
                foll.reactivate()
            })
            if (window.masterResizer) window.masterResizer()
        },

        addScroller: (sel: string) => {
            const master = vrugs.get(el)
            return addScroller(master, sel)
        }
    },
        { ...simpleApi(el) },
        { ...optionsMixin(vrugs.get(el)) }
    )
}

export default (sel: string) => {
    const el = qs(sel)
    if (!el) throw new BadScrollerSelector(`Main element not found: ${sel}`)
    if (vrugs.has(el)) return vrugs.get(el)
    const master = vrugFns(el)
    vrugs.set(el, master)
    return master
}

const addScroller = (master: Vrugan, sel: string) => {
    return master
        .scrolls(sel)
}
