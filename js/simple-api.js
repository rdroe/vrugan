
import { vrugs, asVh, asVw, util as converter } from './globals.js'

const createElem = (parentEl, id = null) => {
    const el = document.createElement('div')
    if (id) { el.setAttribute('id', id) }
    parentEl.appendChild(el)
    return el
}


const createOrGetMainSurface = (masterEl) => {
    let containerEl = masterEl.querySelector('.container')
    if (containerEl) return containerEl
    containerEl = createElem(masterEl)
    containerEl.setAttribute('class', 'container')
    containerEl.style.width = '100%'
    containerEl.style.position = 'relative'
    containerEl.style.height = '1900vh'
    return containerEl
}

const createScrollerElem = (masterEl, idx) => {
    masterEl.style.width = masterEl.style.height = '100%'
    masterEl.style.position = 'fixed'
    masterEl.style.overflowY = 'scroll'
    masterEl.style.margin = 0
    const mainSurface = createOrGetMainSurface(masterEl, 'container')
    const stageView = createElem(mainSurface, `vrug-stage-${idx}`)

    const stageSurface = createElem(stageView, `vrug-surface-${idx}`)

    return [stageView, stageSurface]
}


const simpleContext = (view, surface, follower, master, defaults) => {
    const scrollersToAdd = []

    const addDefaultScroller = () => {
        const {
            responds,
            ps, pe,
            s, e,
            w, h,
            placement,
            out,
            trace,
        } = defaults

        const [propName, val] = placement

        const scroller = follower.senses('v')

        surface.style.height = h
        surface.style.width = w
        surface.style[propName] = val

        surface.style.position = 'absolute'
        surface.style.display = 'flex'
        surface.innerHTML = '<h4>vrugan</h4>'
        surface.style.textAlign = 'vertical'
        surface.style.alignItems = 'center'
        surface.style.justifyContent = 'center'

        view.style.position = 'fixed'
        view.style.width = '100vw'
        view.style.height = '100vh'
        view.style.pointerEvents = 'none'


        scroller.responds(responds)
        scroller.set('start', s)
        scroller.set('end', e)
        scroller.set('parentStart', `${ps}vh`)
        scroller.set('parentEnd', `${pe}vh`)

        scroller.listen()
        if (trace) {
            surface.style.borderStyle = 'dashed'
        }

        if (out === true) {
            const s2 = follower.senses('v')
            s2.responds(responds)
            s2.set('start', e)
            s2.set('end', s)
            s2.set('parentStart', `${pe + 1}vh`)
            s2.set('parentEnd', `${pe + 100}vh`)
            s2.listen()

        }
        follower.init()
    }

    return {
        addScroller: (params) => {
            scrollersToAdd.push(params)
        },
        master,
        view,
        surface,
        height: (w) => {
        },
        width: (h) => {
        },
        start: (s) => {
        },
        end: (e) => {
        },
        init: () => {
            if (scrollersToAdd.length === 0) {
                addDefaultScroller()
            }
        }
    }

}
const createFollower = (el) => {
    const thisVrug = vrugs.get(el)
    const idx = thisVrug.children.size
    const [view, surface] = createScrollerElem(thisVrug.el, idx)
    const follower = thisVrug.scrolls(view)
    return {
        thisVrug,
        idx,
        view,
        surface,
        follower
    }
}

export default (el) => {

    return {
        // make a new follower
        fromBelow: (ps, pe) => {
            const { view, surface, thisVrug, follower } = createFollower(el)

            return simpleContext(
                view,
                surface,
                follower,
                thisVrug,
                {
                    caller: 'b',
                    responds: 'v',
                    ps,
                    pe,
                    s: asVh(0),
                    e: asVh(100),
                    h: '300vh',
                    w: '100vw',
                    placement: ['top', '0vh'],
                    out: true
                }
            )
        },
        fromLeft: (ps, pe) => {
            const { view, surface, thisVrug, follower } = createFollower(el)
            return simpleContext(
                view,
                surface,
                follower,
                thisVrug,
                {
                    caller: 'l',
                    responds: 'h',
                    ps,
                    pe,
                    s: asVw(200),
                    e: asVw(0),
                    h: '100vh',
                    w: '300vw',
                    placement: ['left', '0']

                }
            )
        },
        // make a new follower
        fromTop: (ps, pe) => {
            const { view, surface, thisVrug, follower } = createFollower(el)

            return simpleContext(
                view,
                surface,
                follower,
                thisVrug,
                {
                    caller: 't',
                    responds: 'v',
                    ps,
                    pe,
                    s: asVh(200),
                    e: asVh(100),
                    h: '300vh',
                    w: '100vw',
                    placement: ['top', '0vh'],
                    out: true
                }
            )
        },
        fromLeft: (ps, pe) => {
            const { view, surface, thisVrug, follower } = createFollower(el)
            return simpleContext(
                view,
                surface,
                follower,
                thisVrug,
                {
                    caller: 'l',
                    responds: 'h',
                    ps,
                    pe,
                    s: asVw(200),
                    e: asVw(0),
                    h: '100vh',
                    w: '300vw',
                    placement: ['left', '0']

                }
            )
        },
        fromRight: (ps, pe) => {
            const { view, surface, thisVrug, follower } = createFollower(el)
            return simpleContext(
                view,
                surface,
                follower,
                thisVrug,
                {
                    caller: 'r',
                    responds: 'h',
                    ps,
                    pe,
                    s: asVw(0),
                    e: asVw(200),
                    h: '100vh',
                    w: '300vw',
                    placement: ['left', '0'],
                    out: true,
                }
            )
        },
    }
}
