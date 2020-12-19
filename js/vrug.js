import { invariant, qs, tr } from '/js/util/util.js'

const dirs = ['l', 'r', 'u', 'd']
const axes = ['v', 'h']

const [LEFT, RIGHT, UP, DOWN] = dirs
const [VERTICAL, HORIZONTAL] = axes

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


const scrollMaker = (id, senses, childEl, el) => {

    const dir = id
    const top = vrugs.get(el)

    let thisScroller
    let opts

    const getOpts = () => {
        opts = opts ? opts : new Map
        return opts
    }

    const getThisScroller = () => {
        const child = top.children.get(childEl)
        const sibScrollers = child.scrollers
        if (!thisScroller) { thisScroller = sibScrollers.get(dir) }
        return thisScroller
    }


    const proportion = (nume, divi) => {
        return tr(nume / divi)
    }
    getOpts().set('senses', senses)
    return {
        opts: getOpts(),
        listen: () => {
            const thisScoller = getThisScroller()
            const s = vrug.util(thisScoller.get('start')).toPx()
            const e = vrug.util(thisScoller.get('end')).toPx()
            const ps = vrug.util(thisScoller.get('parentStart')).toPx()
            const pe = vrug.util(thisScoller.get('parentEnd')).toPx()

            const senses = thisScroller.get('senses')
            const responds = thisScroller.get('responds')
            thisScoller.set('_parentEnd', pe)

            const traversable = e - s
            const ratio = proportion(traversable, (pe - ps))

            thisScoller.set('ratio', ratio)

            const senseProp = senses === VERTICAL ? 'scrollTop' : 'scrollLeft'
            const respondProp = responds === HORIZONTAL ? 'scrollLeft' : 'scrollTop'
            console.log('props', senses, responds, e, s, pe, ps, 'respProp', respondProp)
            el.addEventListener(
                'scroll',
                (ev) => {
                    // Take the scrolled distance relative to the sensitive range.
                    // We only move child if scrolled is in the sensitive range.
                    if (el[senseProp] > ps && el[senseProp] < pe) {
                        console.log(['s,e,ps,pe', s, e, ps, pe])
                        console.log(['scrollTop', el[senseProp], 'ratio', ratio])
                        const traversed = el[senseProp] - ps
                        const scaledTraversal = tr(traversed * ratio)
                        childEl[respondProp] = scaledTraversal
                        console.log('scaledTraversal', scaledTraversal)
                    } else if (el[senseProp] <= ps) {
                        childEl[respondProp] = s

                    } else if (el[senseProp] >= pe) {
                        childEl[respondProp] = e
                    }
                },
                false
            ) // addEventListner
            return getThisScroller()
        },
        responds: (dir) => {
            console.log('respond to', dir)
            return getThisScroller().set('responds', dir)
        },
        set: (arg1, arg2) => {
            const thisScroller = getThisScroller()
            if (arg2 === undefined) {
                getOpts().set(arg1, null)
            } else {
                getOpts().set(arg1, arg2)
            }
            return thisScroller
        },
        get: (prop) => getOpts().get(prop)
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
        scrollWrapper: (senses, id) => scrollMaker(id, senses, childEl, el),
        senses: (dir) => {
            console.log('dir', dir)
            invariant(() => axes.includes(dir))
            const thisChild = getThisChild()
            const identifier = thisChild.getIdentifier(dir)

            const scroller = lookUpOrMake(
                thisChild.scrollers,
                identifier,
                (ident) => thisChild.scrollWrapper(dir, ident)
            )
            console.log('scroller', scroller)
            return scroller
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
        scrolls: (chSel) => {
            const top = lookUpOrMake(vrugs, el, vrugFns)
            const chEl = qs(chSel)
            const chWrapped = lookUpOrMake(top.children, chEl, top.childWrapper)
            console.log('returning', chWrapped)
            return chWrapped
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
