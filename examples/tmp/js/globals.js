
export const vrugs = new Map

export const VERTICAL = 'v'
export const HORIZONTAL = 'h'
export const LESS = '<'
export const GREATER = '>'
export const IN_RANGE = 'in_range'
export const UPDATER = 'updater'
export const SCROLLER = 'scroller'
console.log('this in globals', this)

class Invariant extends Error { constructor(...a) { super(...a) } }

class InvalidScrollParam extends TypeError {
    constructor(...args) { super(...args) }
}

class CannotCloseNonexistentRange extends Error {
    constructor(...args) { super(...args) }
}

const toPxFromVw = (arg1) => {
    const parsed = parseInt(arg1, 10)
    if (`${parsed}vw` !== arg1) throw new InvalidScrollParam
    return Math.trunc(parsed / 100 * window.innerWidth)
}

const toPxFromVh = (arg1) => {
    const parsed = parseInt(arg1, 10)
    if (`${parsed}vh` !== arg1) throw new InvalidScrollParam
    return Math.trunc(parsed / 100 * window.innerHeight)
}

export const util = (arg1) => ({
    toPx: () => {
        if (arg1.includes('vw/h')) {
            // landscape
            if (window.innerWidth > window.innerHeight) {

                return util(`${parseInt(arg1)}vw`).toPx()
            } else {
                // portrait
                util(`${parseInt(arg1)}vh`).toPx()
                return util(`${parseInt(arg1)}vh`).toPx()
            }
        }
        return arg1.includes('vh') ? toPxFromVh(arg1) : toPxFromVw(arg1)
    },
    toVw: () => {
        const ret = tr(arg1 * 100 / window.innerWidth)
        return `${ret}vw`
    },
    toVh: () => {
        const ret = tr(arg1 * 100 / window.innerHeight)
        return `${ret}vh`
    }
})


export const postfixer = (outputter, unit) => {
    return (arg) => {
        const retVal = outputter(arg)
        return `${retVal}${unit}`
    }
}

export const offsetter = (offset = 0) => {

    const starts = []
    const ends = []

    return {
        starts, ends,
        startPoint: (num) => {
            const prevEnd = ends.length === 0
                ? offset
                : ends[ends.length - 1]
            const newStart = prevEnd + num
            starts[starts.length] = newStart
            return newStart

        },
        endPoint: (num) => {

            if (starts.length === 0) throw new CannotCloseNonexistentRange
            const prevStart = starts[starts.length - 1]
            const newEnd = prevStart + num
            ends[ends.length] = newEnd
            return newEnd
        },
        lastStart: () => {
            return starts[starts.length - 1]
        },
        lastEnd: () => {
            return ends[ends.length - 1]
        }
    }

}

export const tr = (num) => Math.trunc(num)

export const assert = (fn, msg) => {
    if (!fn()) throw new Invariant(msg)
}

export const qs = (sel) => {
    return document.querySelector(sel)
}

export const asVw = (n) => `${n}vw`
export const asVh = (n) => `${n}vh`

const showScrollers_ = ({ inRangeScrollers: scrs } = { inRangeScrollers: [] }) => {
    scrs.forEach(scr => {
        scr.showScroller()
    })
}

export const showScrollers = ({ scroller: s1 }, { scroller: s2 }) => {
    showScrollers_(s1)
    showScrollers_(s2)
}
