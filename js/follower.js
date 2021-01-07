
import { vrugs, UPDATER, SCROLLER, VERTICAL, HORIZONTAL, assert, asVw, asVh } from './globals.js'
import scroller from './scroller.js'
import optionsMixin from './optionsMixin.js'
import getEffectiveScrollers, { applicableScrollResult, fireApplicableUpdaters, getEffectiveUpdaters } from './getEffectiveScrollers.js'

let cntr = 0
class InvalidUnit extends Error { constructor(...a) { super(...a) } }

const lookUpOrMake = (map, obj, wrapperFn) => {

    if (map.has(obj)) return map.get(obj) // returns previously found element.
    const wrapped = wrapperFn ? wrapperFn(obj) : new Map
    map.set(obj, wrapped) // wraps and sets it
    return wrapped
}

const unitize = (anArg, u) => {

    if (!u) throw new InvalidUnit

    if (typeof (anArg) === 'number') {
        return `${anArg}${u}`
    }

    const parsedToInt = parseInt(anArg, 10)
    const candidateConversion = `${parsedToInt}${u}`

    return candidateConversion
}

export const addDirection = (follower, dir, s, e, ps, pe, senseUnit = 'vw') => {

    const toOwnUnits = dir === 'h' ? asVw : asVh

    const parentStart = unitize(ps, senseUnit)
    const parentEnd = unitize(pe, senseUnit)
    console.log('directional', parentStart, parentEnd)
    follower
        .senses('v')
        .responds(dir)
        .set('start', toOwnUnits(s))
        .set('end', toOwnUnits(e))
        .set('parentStart', unitize(ps, senseUnit))
        .set('parentEnd', unitize(pe, senseUnit))
        .listen()
    return follower
}

export const addUpdater = (follower, fn, ps, pe, overrideSenseUnits = 'vw') => {

    console.log('ps, pe, override', ps, pe, overrideSenseUnits)

    const parentStart = unitize(ps, overrideSenseUnits)
    const parentEnd = unitize(pe, overrideSenseUnits)

    console.log('updater', parentStart, parentEnd)
    follower
        .senses('v')
        .set('parentStart', parentStart)
        .set('parentEnd', parentEnd)
        .listen(fn)

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
                    console.log('reactivate updater')
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

            const id = `${dir} -${cntr} `
            cntr += 1

            return id
        },
        doerWrapper: () => ({}),
        doer: () => ({}),
        addDirection: (...args) => {
            return addDirection(thisChild, ...args)
        },
        addUpdater: (...args) => {
            console.log('args', args)
            return addUpdater(thisChild, ...args)
        },
        ...optionsMixin(thisChild)
    })
}
