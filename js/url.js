import { util } from './globals.js'
const MS_INTERVAL = 400
const state = {
    idx: 0,
    startOrEnd: 'e',
    root: null,
    master: null,
    updated: null
}


const getRange = (master, whichStage, sOrE) => {

    const arr = [...master.children.values()]

    const range = []
    arr.forEach((ch) => {
        const asCustomRange = ch.asLinkableRange()
        if (asCustomRange) {

            range[range.length] = asCustomRange
            return
        }

        const rng = ch.nthStage(whichStage)
        const end = rng[sOrE === 's' ? 0 : 1]
        const ttl = ch.getOpt('title')

        range[range.length] = [end, ttl]
    })

    return range
}

const getCurr = (range, scr) => {
    let curr = null
    range.forEach(([end, ttl]) => {

        if (parseInt(scr, 10) >= parseInt(end)) {
            curr = ttl
        }
    })
    return curr
}

const updateConditionally = (st, scrVh, idx, sOrE) => {

    const scr = parseInt(scrVh, 10)
    const range = getRange(st.master, idx, sOrE)
    const curr = getCurr(range, scr) // look up current link name / title
    const newHash = curr === null
        ? `${scrVh}`
        : `${scrVh}/${curr}`

    const stateArg = `${st.root}#${newHash}`
    st.updated = scrVh
    history.replaceState({}, document.title, stateArg)

}

const updateLocation = (idx, sOrE) => {
    const scrolled = util(state.master.el.scrollTop).toVh()
    if (state.updated !== scrolled) {
        updateConditionally(state, scrolled, idx, sOrE)
    }
}
// getScrollCoords from a comprehensive hash
const getScrollCoords = (range, hash) => {

    let ret = 0
    let num, ttl
    // hash is e.g. #321vh/vrug-1 or #vrug-1
    const [numOrTtl, ttlOrUndef] = hash.split('/').map(str => str.replace('#', ''))
    if (ttlOrUndef) {
        num = util(numOrTtl).toPx()
        ttl = ttlOrUndef
    } else {
        ttl = numOrTtl
    }

    if (num || num === 0) return num

    range.forEach(([num, itmTtl]) => {
        if (range > 0) return
        if (itmTtl === ttl) {
            ret = num
        }
    })
    return ret
}
const scrollTo = (num) => {
    const animScroll = () => {

        const diff = document.body.scrollTop - num
        document.body.scrollTop -= 400 * Math.sign(diff)

        if (Math.abs(document.body.scrollTop - num) >= 200) {
            window.requestAnimationFrame(animScroll)
        } else { window.requestAnimationFrame(() => { document.body.scrollTop = num }) }
    }
    window.requestAnimationFrame(animScroll)
}
export default (mstr, root) => {

    state.root = `/${root}`
    state.master = mstr

    return {
        init: (hash, idx = state.idx, sOrE = state.startOrEnd) => {

            state.idx = idx
            state.startOrEnd = sOrE

            if (!hash) return

            const range = getRange(state.master, state.idx, state.startOrEnd)

            const coord = getScrollCoords(range, hash)
            scrollTo(coord)
        },
        listen: () => {
            setInterval(() => {
                updateLocation(state.idx, state.startOrEnd)
            }, MS_INTERVAL)
        }
    }
}
