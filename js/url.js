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

        const end = util(rng[sOrE === 's' ? 0 : 1]).toPx()
        const ttl = ch.getOpt('title')

        range[range.length] = [end, ttl]
    })

    return range
}
const getCurr = (range, scr) => {
    let curr = null
    range.forEach(([end, ttl]) => {
        if (scr >= end) {
            curr = ttl
        }
    })
    return curr
}

const updateConditionally = (st, scr, idx, sOrE) => {

    if (st.updated === scr) return

    const range = getRange(st.master, idx, sOrE)
    const curr = getCurr(range, scr) // look up current link name / title

    const newHash = curr === null
        ? `${scr}`
        : `${scr}/${curr}`

    const stateArg = `${st.root}#${newHash}`
    st.updated = scr
    history.replaceState({}, document.title, stateArg)
}

const updateLocation = (idx, sOrE) => {
    const scrolled = state.master.el.scrollTop
    if (state.updated !== scrolled) {
        updateConditionally(state, scrolled, idx, sOrE)
    }
}
// getScrollCoords from a comprehensive hash
const getScrollCoords = (range, hash) => {

    let ret = 0
    let num, ttl
    // hash is e.g. #321/vrug-1 or #vrug-1
    const [numOrTtl, ttlOrUndef] = hash.split('/').map(str => str.replace('#', ''))
    if (ttlOrUndef) {
        num = parseInt(numOrTtl)
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
            document.body.scrollTop = coord
        },
        listen: () => {
            setInterval(() => {
                updateLocation(state.idx, state.startOrEnd)
            }, MS_INTERVAL)
        }
    }
}
