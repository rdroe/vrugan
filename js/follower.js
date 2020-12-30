
import { vrugs, UPDATER, SCROLLER, VERTICAL, HORIZONTAL, assert, asVw, asVh } from './globals.js'
import scroller from './scroller.js'
import optionsMixin from './optionsMixin.js'
import getEffectiveScrollers, { applicableScrollResult, fireApplicableUpdaters, getEffectiveUpdaters } from './getEffectiveScrollers.js'

let cntr = 0

const lookUpOrMake = (map, obj, wrapperFn) => {
    if (map.has(obj)) return map.get(obj) // returns previously found element.
    const wrapped = wrapperFn ? wrapperFn(obj) : new Map
    map.set(obj, wrapped) // wraps and sets it
    return wrapped
}

export const addDirection = (follower, dir, s, e, ps, pe) => {
    const ownUnits = dir === 'h' ? asVw : asVh
    follower
        .senses('v')
        .responds(dir)
        .set('start', ownUnits(s))
        .set('end', ownUnits(e))
        .set('parentStart', asVw(ps))
        .set('parentEnd', asVw(pe))
        .listen()
    return follower
}

export default (childEl, el) => {
    // Initialize
    const top = vrugs.get(el)

    if (!top.children.has(childEl)) {
        top.children.set(childEl, {})
    }

    const thisChild = top.children.get(childEl)

    // Functions to evaluate all listening scrollers to focus on the applicable ones; functions to obtain position.
    const fireScrollers = (pos) => {

        const verticalScrollingData = getEffectiveScrollers(thisChild.scrollers, VERTICAL, pos)
        const horizontalScrollingData = getEffectiveScrollers(thisChild.scrollers, HORIZONTAL, pos)

        const vertResults = applicableScrollResult(pos, verticalScrollingData[SCROLLER])

        const horizResults = applicableScrollResult(pos, horizontalScrollingData[SCROLLER])
        const final = { scrollLeft: horizResults.scrollLeft, scrollTop: vertResults.scrollTop }
        if (final.scrollTop === undefined && final.scrollLeft === undefined) {
            throw new Error('No scroll results for ' + pos)
        }
        return final
    }

    // Functions to evaluate all listening scrollers to focus on the applicable ones; functions to obtain position.
    const fireUpdaters = (pos) => {

        const activeScrollerData = getEffectiveUpdaters(thisChild.scrollers, pos)

        fireApplicableUpdaters(pos, activeScrollerData[UPDATER])
    }

    const handlers = {

        [SCROLLER]: () => {

            const pos = el.scrollTop

            const { scrollTop, scrollLeft } = fireScrollers(pos)

            childEl.scrollTop = typeof scrollTop === 'number' ? scrollTop : childEl.scrollTop
            childEl.scrollLeft = typeof scrollLeft === 'number' ? scrollLeft : childEl.scrollLeft


        },
        [UPDATER]: () => {

            fireUpdaters(el.scrollTop)
        }
    }

    return Object.assign(thisChild, {
        scrollers: new Map,
        doers: new Map,
        opts: new Map,

        reactivate: () => {
            thisChild.scrollers.forEach((scr) => {
                const type = scr.get('isUpdater') ? UPDATER : SCROLLER
                if (type === UPDATER) {
                    const fn = scr.get('fn')
                    scr.listen(fn)
                } else {
                    scr.listen()
                }

            })
            thisChild.init()
        },
        activate: (parent, type) => {
            if (type === UPDATER) {

                parent.el.removeEventListener('scroll', handlers[UPDATER])
                parent.el.addEventListener('scroll', handlers[UPDATER])
                return
            }

            parent.el.removeEventListener('scroll', handlers[SCROLLER])
            parent.el.addEventListener('scroll', handlers[SCROLLER])
        },
        scrollWrapper: (senses, id) => scroller(id, senses, childEl, el),
        senses: (dir) => {
            assert(() => [VERTICAL, HORIZONTAL].includes(dir))
            const identifier = thisChild.getIdentifier(dir)

            const scroller = lookUpOrMake(
                thisChild.scrollers,
                identifier,
                (ident) => thisChild.scrollWrapper(dir, ident)
            )
            return scroller
        },
        init: () => {
            handlers[SCROLLER]()
            handlers[UPDATER]()
        },
        getIdentifier(dir) {

            const id = `${dir}-${cntr}`
            cntr += 1

            return id
        },
        doerWrapper: () => ({}),
        doer: () => ({}),
        addDirection: (...args) => {
            return addDirection(thisChild, ...args)
        },
        ...optionsMixin(thisChild)
    })
}
