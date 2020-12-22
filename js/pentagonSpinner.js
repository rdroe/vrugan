import { tr } from './globals.js'

const transformSide = (pos, ps, pe) => {
    const translateBase = 15
    const translateTot = 10

    const tot = pe - ps
    const progress = tr((pos - ps) / tot * 25 * 1000) / 1000

    const translateProgress = progress * translateTot

    const translate = translateBase + translateProgress * 5
    return translate
}

const pentaHelper = (pentas, translate) => {

    const suffix = window.innerWidth > window.innerHeight ? 'vh' : 'vw'
    return pentas.forEach((domEl, idx) => {
        const transProp = `translate(-50%, -50%) rotateZ(${72 * idx}deg) translateY(${translate}${suffix})`

        domEl.style.transform = transProp
    })
}

export default (pentas, pos, obj) => {

    const pe = obj.get('pixels', 'pe')
    const ps = obj.get('pixels', 'ps')
    let translate
    if (pos < ps) { // todo: here and in spinner, dont check every time.
        translate = transformSide(ps, ps, pe)
    } else if (pos > pe) {
        translate = transformSide(pe, ps, pe)
    } else {
        translate = transformSide(pos, ps, pe)
    }
    pentaHelper(pentas, translate)
}


