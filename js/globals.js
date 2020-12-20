

export const vrugs = new Map

export const VERTICAL = 'v'
export const HORIZONTAL = 'h'
export const LESS = '<'
export const GREATER = '>'
export const IN_RANGE = 'in_range'
export const UPDATER = 'updater'
class Invariant extends Error { constructor(...a) { super(...a) } }

class InvalidViewUnit extends TypeError {
    constructor(...args) { super(...args) }
}


export const util = (arg1) => ({
    toPx: () => {
        const parsed = parseInt(arg1, 10)
        if (`${parsed}vw` !== arg1) throw new InvalidViewUnit
        return Math.trunc(parsed / 100 * window.innerWidth)
    },
    toVw: () => {
        const ret = tr(arg1 * 100 / window.innerWidth)

        return `${ret}vw`
    }
})

export const tr = (num) => Math.trunc(num)

export const assert = (fn, msg) => { if (!fn()) throw new Invariant(msg) }
