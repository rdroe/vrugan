import { invariant, qs, tr } from '/js/util/util.js'

const dirs = ['l', 'r', 'u', 'd']
const [LEFT, RIGHT, UP, DOWN] = dirs

export default { LEFT, RIGHT, UP, DOWN }

export const vrug = (sel) => {
    const el = qs(sel)
    if (!el) throw new Error()
    return lookUpOrMake(vrugs, el, vrugFns)
}

class InvalidViewUnit extends TypeError {
    constructor(...args) { super(...args) }
}

class DontResetImmutable extends Error {
    constructor(...args) { super(...args) }
}
class NamespaceIsMissing extends Error {
    constructor(...args) { super(...args) }
}
class UndefinedProperty extends Error {
    constructor(...args) { super(...args) }
}
class MissingArgument extends Error {
    constructor(...args) { super(...args) }
}

const vrugs = new Map // set, has, get

const lookUpOrMake = (map, obj, wrapperFn) => {
    if (map.has(obj)) return map.get(obj) // returns previously found element.
    const wrapped = wrapperFn ? wrapperFn(obj) : new Map
    map.set(obj, wrapped) // wraps and sets it
    return wrapped
}

const scroll = (direction, scrollee, anchorElement, ev) => {
    invariant(() => { return anchorElement === ev.target })
}


const scrollMaker = (dir, id, childEl, el) => {

    const top = vrugs.get(el)
    const child = top.children.get(childEl)
    const sibScrollers = child.scrollers
    const ownOptions = sibScrollers.has(dir) ? sibScrollers.get(dir).opts : new Map
    let thisScroller

    const getThisScroller = () => {
        if (!thisScroller) { thisScroller = sibScrollers.get(dir) }
        return thisScroller
    }

    const setOpt = (key, val) => {
        ownOptions.set(key, val)
        return val
    }

    const getOpt = (key) => {
        return ownOptions.get(key)
    }

    setOpt('start', '0vw')
    setOpt('end', '0vw')
    setOpt('parentStart', '0vw')
    setOpt('parentEnd', '0vw')

    const proportion = (nume, divi) => {
        return tr(nume / divi)
    }

    return {
        listen: () => {
            console.log('listening')
            const s = vrug.util(getOpt('start')).toPx()
            child.setOptOnce(id, '_start', s)
            const e = vrug.util(getOpt('end')).toPx()
            child.setOptOnce(id, '_end', e)
            const ps = vrug.util(getOpt('parentStart')).toPx()
            setOpt('_parentStart', ps)
            const pe = vrug.util(getOpt('parentEnd')).toPx()
            setOpt('_parentEnd', pe)

            const traversable = e - s
            const ratio = proportion(traversable, (pe - ps))
            console.log('first ratio', traversable, pe, ps, ratio)
            setOpt('ratio', ratio)

            el.addEventListener(
                'scroll',
                (ev) => {
                    // Take the scrolled distance relative to the sensitive range.
                    // We only move child if scrolled is in the sensitive range.
                    if (el.scrollTop > ps && el.scrollTop < pe) {
                        console.log(['s,e,ps,pe', s, e, ps, pe])
                        console.log(['scrollTop', el.scrollTop, 'ratio', getOpt('ratio')])
                        const traversed = el.scrollTop - ps
                        const scaledTraversal = tr(traversed * getOpt('ratio'))
                        childEl.scrollLeft = scaledTraversal
                        console.log('scaledTraversal', scaledTraversal)
                    }
                },
                false
            ) // addEventListner
            return getThisScroller()
        },
        set: (arg1, arg2) => {
            if (arg2 === undefined) {
                setOpt(arg1, null)
            } else {
                setOpt(arg1, arg2)
            }
            return getThisScroller()
        },
        get: (prop) => getOpt(prop)
    }
}

const childMaker = (childEl, el) => {

    const top = vrugs.get(el)
    let thisChild
    const getThisChild = () => {
        thisChild = thisChild ? thisChild : top.children.get(childEl)
        return thisChild
    }

    return ({
        scrollers: new Map,
        doers: new Map,
        opts: new Map,
        scrollWrapper: (dir, id) => scrollMaker(dir, id, childEl, el),
        scroller: (dir) => {
            invariant(() => dirs.includes(dir))
            const thisChild = getThisChild()
            const identifier = thisChild.getIdentifier(dir)
            return lookUpOrMake(
                thisChild.scrollers,
                identifier,
                (ch1) => thisChild.scrollWrapper(ch1, identifier)
            )
        },
        getIdentifier(dir) {
            // placeholder; we will want to do more than one scroller per element per direction.
            return dir
        },
        setOptOnce: (...args) => {
            return getThisChild()._setOpt(args, true)
        },
        setOpt: (...args) => {
            return getThisChild()._setOpt(args, false)
        },
        _setOpt: ([arg1, arg2, arg3], requireMatch = false) => {

            if (!arg2) throw new MissingArgument()
            const ch = getThisChild()
            const opts = ch.opts

            if (arg3 === undefined) {
                const [key, val] = [arg1, arg2]
                if (opts.has(key)) {
                    if (requireMatch && opts.get(key) !== val) throw new DontResetImmutable()
                }
                opts.set(key, val)
                return ch
            } else {

                const [namespace, key, val] = [arg1, arg2, arg3]
                if (!opts.has(namespace)) {
                    opts.set(namespace, new Map)
                }

                const nsMap = opts.get(namespace)
                if (nsMap.has(key)) {
                    if (requireMatch && nsMap.get(key) !== val) throw new DontResetImmutable()
                }
                nsMap.set(key, val)
                return ch
            }
        },
        getOpt: (arg1, arg2) => {
            const ch = getThisChild()
            const opts = ch.opts
            if (arg2 === undefined) return opts.get(arg1)
            if (!opts.has(arg1)) {
                throw new NamespaceIsMissing()
            }
            const ns = opts.get(arg1)
            if (!ns.has(arg2)) {
                throw new UndefinedProperty()
            }
            return ns.get(arg2)
        },
        doerWrapper: () => ({}),
        doer: () => ({})
    })
}


const vrugFns = (el) => {
    return {
        el,
        children: new Map,
        childWrapper: (childEl) => childMaker(childEl, el),
        child: (chSel) => {
            const top = lookUpOrMake(vrugs, el, vrugFns)
            const chEl = qs(chSel)
            return lookUpOrMake(top.children, chEl, top.childWrapper)
        }
    }
}

vrug.util = (arg1) => ({
    toPx: () => {
        const parsed = parseInt(arg1, 10)
        if (`${parsed}vw` !== arg1) throw new InvalidViewUnit
        return Math.trunc(parsed / 100 * window.innerWidth)
    },
    toVw: (arg1) => {
        const ret = tr(arg1 * 100 / window.innerWidth)
        return `${ret}vw`
    }
})
