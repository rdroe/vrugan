
import { vrugs, UPDATER, SCROLLER, VERTICAL, HORIZONTAL, assert, asVw, asVh, showScrollers, unitize } from './globals.js'
import scroller from './scroller.js'
import optionsMixin from './optionsMixin.js'
import getEffectiveScrollers, { applicableScrollResult, fireApplicableUpdaters, getEffectiveUpdaters } from './getEffectiveScrollers.js'
import { follower as apiMixin } from './simple-api.js'
import { scrollToTitle } from './url.js'

let cntr = 0
class InvalidUnit extends Error { constructor(...a) { super(...a) } }

const lookUpOrMake = (map, obj, wrapperFn) => {

    if (map.has(obj)) return map.get(obj) // returns previously found element.
    const wrapped = wrapperFn ? wrapperFn(obj) : new Map
    map.set(obj, wrapped) // wraps and sets it
    return wrapped
}

// is this export needed?
export const addDirection = (follower, dir, s, e, ps, pe, senseUnit = 'vw') => {

    const toOwnUnits = dir === 'h' ? asVw : asVh

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

    const parentStart = unitize(ps, overrideSenseUnits)
    const parentEnd = unitize(pe, overrideSenseUnits)

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
        showScrollers(verticalScrollingData, horizontalScrollingData)
        const vertResults = applicableScrollResult(pos, verticalScrollingData[SCROLLER])

        const horizResults = applicableScrollResult(pos, horizontalScrollingData[SCROLLER])

        const final = { scrollLeft: horizResults.scrollLeft, scrollTop: vertResults.scrollTop }

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
            if (childEl) {

                childEl.scrollTop = typeof scrollTop === 'number' ? scrollTop : childEl.scrollTop
                childEl.scrollLeft = typeof scrollLeft === 'number' ? scrollLeft : childEl.scrollLeft
            }

        },
        [UPDATER]: () => {

            fireUpdaters(el.scrollTop)
        }
    }

    return Object.assign(thisChild, {
        scrollers: new Map,
        doers: new Map,
        opts: new Map,
        _limit: (eOrS) => {
            assert(() => ['e', 's'].includes(eOrS), 'arg for limit most be "e" or "s" (for end or start) ')
            const pes = [...thisChild.scrollers.values()].map(scr => {
                const propName = eOrS === 'e' ? 'parentEnd' : 'parentStart'
                return parseInt(scr.get(propName), 10)
            })

            return eOrS === 'e' ? Math.max(...pes) : Math.min(...pes)

        },
        end: () => {
            return thisChild._limit('e')
        },
        start: () => {
            return thisChild._limit('s')
        },
        asLinkableRange: () => {
            const linkFn = thisChild.getOpt('linkFn')

            if (linkFn) return linkFn.call(null, thisChild)
            return null
        },
        nthStage: (n) => {
            const all = [...thisChild.scrollers.values()]
            const pes = all.reduce((accum, scr, idx) => {
                const strtWithUnits = scr.get('parentStart')
                const endWithUnits = scr.get('parentEnd')
                const strt = parseInt(scr.get('parentStart'), 10)
                return { ...accum, [strt]: [strtWithUnits, endWithUnits, scr] }

            }, {})
            const nth = Object.values(pes)[n]
            if (!nth) throw new Error('Could not get an nth stage for a scroller; ' + `index: ${n}`)
            return nth
        },
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

            const id = `${dir}--${cntr} `
            cntr += 1

            return id
        },
        doerWrapper: () => ({}),
        doer: () => ({}),
        addDirection: (...args) => {
            return addDirection(thisChild, ...args)
        },
        addUpdater: (...args) => {

            return addUpdater(thisChild, ...args)
        },
        makeFocusable: (title, tabIndex = 0) => {
            if (!title) return;

            thisChild.setOpt('title', title)
            const parElem = childEl.parentElement
            if (parElem.tagName !== 'MAIN') return
            const a = document.createElement('div')
            a.setAttribute('name', title)
            a.setAttribute('id', title)
            a.setAttribute('aria-label', title)
            a.setAttribute('aria-role', 'region')

            parElem.insertBefore(a, childEl)
            a.appendChild(childEl)

            a.setAttribute('tabindex', tabIndex)
            const setHash = (ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                a.setAttribute('id', '')
                scrollToTitle(title)
                const newUrl = `#${title}`
                history.replaceState({}, document.title, newUrl)

                a.setAttribute('id', title)
            }

            a.onfocus = (...argz) => {
                argz[0].preventDefault()
                setHash.call(null, ...argz)
            }
        },
        ...optionsMixin(thisChild),
        ...apiMixin()
    })
}
