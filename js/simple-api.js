
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
    containerEl.height = '500vh'
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

const positionSurface = (surfaceEl, startPos, endPos, dir = 'v') => {
    let top = 0
    let left = 0
    if (dir === 'v') {
        const travelDir = (startPos > endPos) ? 'd' : 'u'
        if (travelDir === 'u') {

        }
    } else throw new Error('no horiz position yet')
}

const simpleContext = (view, surface, follower, master, defaults) => {
    const scrollersToAdd = []

    const addDefaultScroller = () => {
        const {
            ps, pe,
            s, e,
            w, h,
            placement
        } = defaults
        const [propName, val] = placement

        const scroller = follower.senses('v')

        surface.style.height = h
        surface.style.width = w
        surface.style[propName] = val
        surface.style.backgroundColor = 'aliceblue'
        surface.style.position = 'absolute'
        surface.style.display = 'flex'
        surface.innerHTML = '<div>my thing</div>'
        surface.style.textAlign = 'vertical'
        surface.style.alignItems = 'center'
        surface.style.justifyContent = 'center'

        view.style.position = 'fixed'
        view.style.width = '100vw'
        view.style.height = '100vh'
        view.style.pointerEvents = 'none'

        scroller.responds('v')
        scroller.set('start', s)
        scroller.set('end', e)
        scroller.set('parentStart', `${ps}vh`)
        scroller.set('parentEnd', `${pe}vh`)
        scroller.listen()
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

export default (el) => {
    return {
        // make a new follower
        fromBelow: (ps = -100, pe = -100) => {
            const thisVrug = vrugs.get(el)
            const idx = thisVrug.children.size
            const [view, surface] = createScrollerElem(thisVrug.el, idx)

            /*
            const surfaceHeight = 50

            surface.style.borderStyle = 'solid'
            surface.style.width = '100px'
            surface.style.backgroundColor = 'aliceblue'
            surface.style.position = 'absolute'
            surface.style.height = `${surfaceHeight}vh`

            view.style.width = '100vw'

            const h1 = 100 // above 
            const h2 = 100 // below
            const h3 = (0 - s) + surfaceHeight
            const height = h1 + h3 + h2

            const top = h1 + s
            surface.style.top = `${top}vh`

            view.style.position = 'fixed'
            view.style.height = `${height}vh`
            */

            const follower = thisVrug.scrolls(view)

            return simpleContext(view, surface, follower, thisVrug, { ps, pe, s: asVh(0), e: asVh(100), h: '300vh', w: '100vw', placement: ['top', '0vh'] })
        },
        vertical: (s, e) => {

            const thisVrug = vrugs.get(el)
            const idx = thisVrug.children.size
            const [view, surface] = createScrollerElem(thisVrug.el, idx)

            const surfaceHeight = 50

            surface.style.borderStyle = 'solid'
            surface.style.width = '100px'
            surface.style.backgroundColor = 'aliceblue'
            surface.style.position = 'absolute'
            surface.style.height = `${surfaceHeight}vh`

            view.style.width = '100vw'

            const h1 = 100 // above 
            const h2 = 100 // below
            const h3 = (0 - s) + surfaceHeight
            const height = h1 + h3 + h2

            const top = h1 + s
            surface.style.top = `${top}vh`

            view.style.position = 'fixed'
            view.style.height = `${height}vh`
            const follower = thisVrug.scrolls(view)
            const scroller = follower.senses('v')

            scroller.responds('v')
            scroller.set('start', asVh(s))
            scroller.set('end', asVh(e))

            return scroller
        }
    }
}
