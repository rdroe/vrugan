
import {
    VERTICAL, LESS, GREATER, IN_RANGE,
    UPDATER,
    vrugs, util, tr
} from './globals.js'

import optionsMixin from './optionsMixin.js'

export default (id, senses, childEl, el) => {

    const top = vrugs.get(el)

    let wrappedEl

    const getWrappedEl = () => {
        wrappedEl = wrappedEl || top.children.get(childEl)
        return wrappedEl
    }

    const sibScrollers = () => {
        const wrappedEl = getWrappedEl()
        return wrappedEl.scrollers
    }

    const getThisScroller = () => {
        const ss = sibScrollers()
        if (!ss.has(id)) {
            ss.set(id, {})
        }
        return ss.get(id)
    }


    const proportion = (nume, divi) => {
        return tr(nume / divi * 100) / 100
    }

    const thisScroller = getThisScroller()
    return Object.assign(thisScroller, {
        id,
        el: childEl,
        opts: new Map,
        listen: (fn) => {

            const ps = util(thisScroller.get('parentStart')).toPx()
            const pe = util(thisScroller.get('parentEnd')).toPx()

            thisScroller.set('pixels', 'ps', ps)
            thisScroller.set('pixels', 'pe', pe)

            const senseProp = senses === VERTICAL ? 'scrollTop' : 'scrollLeft'

            thisScroller.set('senseProp', senseProp)


            thisScroller.set('isActive', true)
            if (fn !== undefined) thisScroller.responds('n/a')
            if (fn !== undefined) return thisScroller.funcListen(fn)
            getWrappedEl().activate(senses, top)
            thisScroller.set('senses', senses)
            const s = util(thisScroller.get('start')).toPx()
            const e = util(thisScroller.get('end')).toPx()

            thisScroller.set('pixels', 's', s)
            thisScroller.set('pixels', 'e', e)


            const traversable = e - s // for fn, use parent 
            const ratio = proportion(traversable, (pe - ps))

            thisScroller.set('ratio', ratio)
            const startGreaterThanEnd = s > e

            if (thisScroller.get('responds') === VERTICAL) {
                if (startGreaterThanEnd) thisScroller.set('doInvertSensor', true)
            } else {
                if (startGreaterThanEnd === false) {
                    thisScroller.set('doInvertSensor', true)
                }
            }

            return getThisScroller()
        },
        funcListen(fn) {
            thisScroller.set('isUpdater', true)
            thisScroller.set('fn', fn)
            getWrappedEl().activate(senses, top, UPDATER)
        },
        getScrollResult(pos) {

            const doInvert = thisScroller.get('doInvertSensor')
            const pe = thisScroller.get('pixels', 'pe')
            const ps = thisScroller.get('pixels', 'ps')
            const ratio = thisScroller.get('ratio')
            const s = thisScroller.get('pixels', 's')
            const e = thisScroller.get('pixels', 'e')

            if (pos > ps && pos < pe) {

                const traversed = (pos - ps)
                const scaledTraversal = tr(traversed * ratio)

                if (!doInvert) {
                    return s + scaledTraversal
                }

                return scaledTraversal
            } else if (pos <= ps) {
                return s
            } else {
                return e
            }
        },
        getRelativePosition(pos) {
            const pe = thisScroller.get('pixels', 'pe')
            const ps = thisScroller.get('pixels', 'ps')

            if (pos >= ps && pos <= pe) {
                return IN_RANGE
            } else if (pos > ps) {
                return LESS
            } else if (pos < ps) {

                return GREATER
            }
        },
        update: (pos) => {

            thisScroller.get('fn').call(thisScroller, pos, thisScroller)
        },
        responds: (dir) => {
            return thisScroller.set('responds', dir)
        },
        set: (arg1, arg2, arg3) => {
            return thisScroller.setOpt(arg1, arg2, arg3)
        },
        get: (nsOrProp, prop) => {
            return thisScroller.getOpt(nsOrProp, prop)
        },
        ...optionsMixin(getThisScroller())
    })
}
