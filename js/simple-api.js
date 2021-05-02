
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
    const visible = createElem(stageSurface, `vrug-visible-${idx}`)

    return [stageView, stageSurface, visible]
}

const setIfUndefined = (ref, propName, val, elem = null) => {
    if (ref[propName]) {
        console.log(propName, 'pre-existing value', ref[propName], 'challenger:', val, elem)
    }
    if (ref[propName] === '') ref[propName] = val
}

const simpleFollower = (view, surface, follower, defaults) => {

    const {
        responds,
        ps, pe,
        s, e,
        w, h,
        trace,
        override
    } = defaults

    const visible = follower.getOpt('visible')
    const positionUnit = responds === 'h' ? 'vw' : 'vh'

    const [propName, val] = override.placement

    const scroller = follower.senses('v')

    if (h) setIfUndefined(surface.style, 'height', h)
    if (w) setIfUndefined(surface.style, 'width', w)

    if (override.h) surface.style.height = override.h
    if (override.w) surface.style.width = override.w

    surface.style[propName] = val
    setIfUndefined(surface.style, 'position', 'absolute')

    setIfUndefined(visible.style, 'position', 'absolute')
    setIfUndefined(visible.style, 'height', '100vh')

    setIfUndefined(visible.style, 'width', '100vw')
    setIfUndefined(visible.style, 'top', 0)
    setIfUndefined(visible.style, 'left', 0)
    setIfUndefined(visible, 'innerHTML', '<div>vrugan</div>')
    setIfUndefined(visible.style, 'fontFamily', 'helvetica')
    setIfUndefined(visible.style, 'fontSize', '10vh')
    setIfUndefined(visible.style, 'position', 'absolute')
    visible.style[propName] = `100${positionUnit}`
    setIfUndefined(view.style, 'position', 'fixed')
    setIfUndefined(view.style, 'width', '100vw')
    setIfUndefined(view.style, 'height', '100vh')
    setIfUndefined(view.style, 'pointerEvents', 'none')

    scroller.responds(responds)
    scroller.set('start', s)
    scroller.set('end', e)
    scroller.set('parentStart', `${ps}vh`)
    scroller.set('parentEnd', `${pe}vh`)

    scroller.listen()

    if (trace) {
        surface.style.borderStyle = 'dashed'

    }

    follower.init()

    return follower
}


const createFollower = (el, existing) => {
    if (existing) {
        const surface = existing.getOpt('surface')
        const view = existing.getOpt('view')
        return { surface, view, follower: existing }
    }
    const thisVrug = vrugs.get(el)
    const idx = thisVrug.children.size
    const [view, surface, visible] = createScrollerElem(thisVrug.el, idx)
    const follower = thisVrug.scrolls(view)
    follower.setOpt('master', thisVrug)
    follower.setOpt('view', view)
    follower.setOpt('surface', surface)
    follower.setOpt('visible', visible)
    return {
        thisVrug,
        idx,
        view,
        surface,
        follower
    }
}

const offElementStopAt = (distanceOut, stopAt) => {

    const num = (100 - stopAt) / ((100 + distanceOut) / 100)
    const rounded = Math.round(num)
    return rounded
}

const signature = (...args) => {
    if (args.length === 4) {
        return signatureFour(...args)
    } else if (args.length === 5) {
        return signatureFive(...args)
    }
    return {}
}

const signatureFour = (ps, pe, distanceOut, stopAt) => ({ ps, pe, distanceOut, stopAt })

const signatureFive = (follower, ps, pe, distanceOut, stopAt) => ({ follower, ps, pe, distanceOut, stopAt })
export default (el) => {
    let thisVrug

    const getThisVrug = () => {
        if (thisVrug) return thisVrug
        return vrugs.get(el)
    }

    return {
        // make a new follower
        fromBelow: (ps, pe, distanceOut, stopAt) => {

            const { view, surface, follower
            } = createFollower(el)

            const computedStopAt = offElementStopAt(distanceOut, stopAt)

            return simpleFollower(
                view,
                surface,
                follower,
                {
                    caller: 'b',
                    responds: 'v',
                    ps,
                    pe,
                    s: asVh(0),
                    e: asVh(100 + distanceOut - computedStopAt),

                    w: '100vw',
                    override: {
                        h: '300vh',
                        placement: ['top', asVh(distanceOut)],
                    },
                    placement: ['top', asVh(distanceOut)]
                }
            )
        },

        // make a new follower
        fromTop: (ps, pe, distanceOut, stopAt) => {
            const { view, surface, follower } = createFollower(el)

            return simpleFollower(
                view,
                surface,
                follower,
                {
                    caller: 't',
                    responds: 'v',
                    ps,
                    pe,

                    s: asVh(100 + distanceOut),
                    e: asVh(100 - stopAt),
                    w: '100vw',
                    override: {
                        h: '300vh',
                        placement: ['top', '0vh'],
                    }
                }
            )
        },
        fromLeft: (...args) => {

            const { follower: existingFollower, ps, pe, distanceOut, stopAt } = signature(...args)

            if (existingFollower) {
                console.log(existingFollower)
            }
            const { view, surface, follower } = createFollower(el, existingFollower)

            return simpleFollower(
                view,
                surface,
                follower,
                {
                    caller: 'l',
                    responds: 'h',
                    ps,
                    pe,
                    s: asVw(100 + distanceOut),
                    e: asVw(100 - stopAt),
                    h: '100vh',
                    override: {
                        w: '300vw',
                        placement: ['left', '0vw']
                    }
                }
            )
        },
        fromRight: (ps, pe, distanceOut, stopAt) => {
            const { view, surface, follower } = createFollower(el)
            const computedStopAt = offElementStopAt(distanceOut, stopAt)
            return simpleFollower(
                view,
                surface,
                follower,
                {
                    caller: 'r',
                    responds: 'h',
                    ps,
                    pe,
                    s: asVw(0),
                    e: asVw(100 + distanceOut - computedStopAt),
                    h: '100vh',
                    override: {
                        w: '300vw',
                        placement: ['left', asVw(distanceOut)]
                    }
                }
            )
        },
    }
}


export const follower = () => {
    return {
        fromLeft: function(...args) {
            const master = this.getOpt('master')
            return master.fromLeft(this, ...args)
        },
        fromRight: function(...args) {
            const master = this.getOpt('master')
            return master.fromRight(this, ...args)
        },
        fromTop: function(...args) {
            const master = this.getOpt('master')
            return master.fromTop(this, ...args)
        },
        fromBelow: function(...args) {
            const master = this.getOpt('master')
            return master.fromBelow(this, ...args)
        }

    }
}
