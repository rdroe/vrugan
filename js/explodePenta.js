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
