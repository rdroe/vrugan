import { tr } from './globals.js'

const transform = (pos, ps, pe, min, max) => {

    const traversed = tr((pos - ps) / (pe - ps) * 1000) / 1000
    const traversedProportion = tr((max - min) * traversed)
    return min + traversedProportion
}

const pentaHelper = (pentas, translate) => {

    const translation = `${translate}px`
    return pentas.forEach((domEl, idx) => {
        const transProp = `translate(-50%, -50%) rotateZ(${72 * idx}deg) translateY(${translation})`

        domEl.style.transform = transProp
    })
}

export default (pentas, pos, obj, start, max = 100000) => {
    const transFn = transform
    const pe = obj.get('pixels', 'pe')
    const ps = obj.get('pixels', 'ps')
    let translate
    if (pos < ps) { // todo: here and in spinner, dont check every time.
        translate = transFn(ps, ps, pe, start, max)
    } else if (pos > pe) {
        translate = transFn(pe, ps, pe, start, max)
    } else {
        translate = transFn(pos, ps, pe, start, max)
    }
    pentaHelper(pentas, translate, start, max)
}

const updatePentaDom = (el, deg, colorOpac) => {
    el.style.transform = `rotateZ(${deg}deg)`
}

const spinHelper = (pos, ps, pe) => {
    const modPos1 = pos % (360 * 150)
    const multiplier = tr(modPos1 / (360 * 10) * 360 * 100) / 100
    return multiplier
}

export const rotatePenta = (pos, obj) => {

    const el = obj.el

    const ps = obj.get('pixels', 'ps')
    const pe = obj.get('pixels', 'pe')
    let spinParams

    if (pos < ps) {
        spinParams = spinHelper(ps, ps, pe)
    } else if (pos > pe) {
        spinParams = spinHelper(pe, ps, pe)
    } else {
        spinParams = spinHelper(pos, ps, pe)
    }

    // rotate only
    updatePentaDom(el, spinParams)
}
