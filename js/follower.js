
import { vrugs, UPDATER, VERTICAL, HORIZONTAL, LESS, GREATER, IN_RANGE, assert } from './globals.js'

import scroller from './scroller.js'
import optionsMixin from './optionsMixin.js'


class DifferingScrollResults extends Error {
    constructor(...args) { super(...args) }
}

class InvalidResponseAxis extends TypeError {
    constructor(...args) { super(...args) }
}

let cntr = 0

const lookUpOrMake = (map, obj, wrapperFn) => {
    if (map.has(obj)) return map.get(obj) // returns previously found element.
    const wrapped = wrapperFn ? wrapperFn(obj) : new Map
    map.set(obj, wrapped) // wraps and sets it
    return wrapped
}

const directionallyResponsiveScrollers = (scrollers, responseAxis) => {
    return [...scrollers.values()].filter(scr => {
        return scr.get('responds') === responseAxis
            && scr.get('isActive') === true
            && scr.get('isUpdater') !== true
    })
}

const updaters = (scrollers) => {
    return [...scrollers.values()].filter(scr => {
        return scr.get('isUpdater') === true
    })
}

/**
For the specified response axis, v or h (vertical or horizontal) find the first scroller that has the point in range. If none has the point in range, find those with the applicable boundaries that should specify a resting point. 

**/
const effectiveScrollers = (pos, scrollersOrUpdaters) => {

    const candidates = scrollersOrUpdaters.reduce((accum, scr) => {

        const relativePosition = scr.getRelativePosition(pos)

        switch (relativePosition) {
            case LESS:
                if (!accum.less || scr.get('parentStart') < accum.less.get('parentStart')) {
                    return { ...accum, less: scr }
                }
                return accum

            case GREATER:
                if (!accum.greater || scr.get('parentEnd') > accum.greater.get('parentEnd')) {
                    return { ...accum, greater: scr }
                }
                return accum
            case IN_RANGE: return { ...accum, inRange: scr };
            default: throw new InvalidResponseAxis
        }

    }, {})

    return Object.values(candidates)
}

const effectiveUpdaters = (pos, updaters) => {

    // sort updaters into less, greater, and in range relative to scroll point.
    const candidates = updaters.reduce((accum, scr) => {
        const relativePosition = scr.getRelativePosition(pos)
        let ret = accum

        switch (relativePosition) {
            case LESS:
                ret = { ...accum, less: [...(accum.less || []), scr] }
                break;
            case GREATER:
                ret = { ...accum, greater: [...(accum.greater || []), scr] }
                break;
            case IN_RANGE:
                ret = { ...accum, inRange: [...(accum.inRange || []), scr] };
                break;
            default: throw new InvalidResponseAxis
        }

        return ret
    }, {})

    return Object.values(candidates).flatMap(_ => _)

}

export default (childEl, el) => {
    // Initialize
    const top = vrugs.get(el)

    if (!top.children.has(childEl)) {
        top.children.set(childEl, {})
    }

    const thisChild = top.children.get(childEl)

    // Functions to evaluate all listening scrollers to focus on the applicable ones; functions to obtain position.
    const getScrolledPosition = (pos, movementAxis) => {

        const directionalScrollers = directionallyResponsiveScrollers(thisChild.scrollers, movementAxis)
        const scrollers = effectiveScrollers(pos, directionalScrollers, movementAxis)

        const result = scrollers.reduce((accum, curr) => {
            const scrollRes = curr.getScrollResult(pos)
            if (accum !== null && accum !== scrollRes) throw new Error(DifferingScrollResults)
            return scrollRes
        }, null)

        return result
    }

    const horizontalScrolledPosition = (pos) => {
        return getScrolledPosition(pos, HORIZONTAL)
    }

    const verticalScrolledPosition = (pos) => {
        return getScrolledPosition(pos, VERTICAL)
    }

    const callUpdaters = (pos) => {

        const activeUpdaters = updaters(thisChild.scrollers)

        const callableUpdaters = effectiveUpdaters(pos, activeUpdaters)

        callableUpdaters.forEach(upd => upd.update(pos))
    }

    const handlers = {

        [VERTICAL]: (ev) => {

            assert(() => ev.type === 'scroll')
            const pos = el.scrollTop

            childEl.scrollLeft = horizontalScrolledPosition(pos)
            childEl.scrollTop = verticalScrolledPosition(pos)

        },
        [UPDATER]: (ev) => {

            assert(() => ev.type === 'scroll')
            const pos = el.scrollTop

            callUpdaters(pos)
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
            parent.el.removeEventListener('scroll', handlers[dir])
            parent.el.addEventListener('scroll', handlers[dir])
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
            console.log('added a scroller for', childEl, identifier, ' is an ')
            console.log(thisChild.scrollers)
            return scroller
        },
        init: () => {

            const vInit = verticalScrolledPosition(el.scrollTop)
            const hInit = horizontalScrolledPosition(el.scrollTop)

            if (typeof vInit === 'number') {
                childEl.scrollTop = vInit
            }

            if (typeof hInit === 'number') {
                childEl.scrollLeft = hInit
            }
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
