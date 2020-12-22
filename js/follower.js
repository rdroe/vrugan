
import { vrugs, UPDATER, SCROLLER, VERTICAL, HORIZONTAL, assert } from './globals.js'
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
        activate: (dir, parent, type) => {
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
        ...optionsMixin(thisChild)
    })
}
