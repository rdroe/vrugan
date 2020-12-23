
export const vrugs = new Map

export const VERTICAL = 'v'
export const HORIZONTAL = 'h'
export const LESS = '<'
export const GREATER = '>'
export const IN_RANGE = 'in_range'
export const UPDATER = 'updater'
export const SCROLLER = 'scroller'

class Invariant extends Error { constructor(...a) { super(...a) } }

class InvalidScrollParam extends TypeError {
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
})


export const tr = (num) => Math.trunc(num)

export const assert = (fn, msg) => { if (!fn()) throw new Invariant(msg) }
