import { invariant, qs, tr } from '/js/util/util.js'
export const vrugan = (f) => {
  const lib = {
    updateChild(par, chVrug) {

      const chParams = par.getChild(chVrug)
      const ch = chVrug.elem

      return (ev) => {

        par.elem.dataset.scrollTop = par.scrollTop
        invariant( () => ev.type === 'scroll' )
        const { range, factor, direction } = chParams
        if (par.scrollTop > range[0] && par.scrollTop < range[1]) {
          const diff = par.scrollTop - range[0]
          if (direction === 1) {

            ch.dataset.scrollTop = tr(diff * factor)
            ch.scrollLeft = tr(diff * factor)
          }
        } else if (par.scrollTop <= range[0]) {
            ch.dataset.scrollTop = 0
            ch.scrollLeft = 0
        } else if (par.scrollTop >= range[1]) {
            ch.dataset.scrollTop = tr((range[1] - range[0]) * factor)
            ch.scrollLeft = tr((range[1] - range[0])  * factor)
        }
      }
    },
  }
  const elem = qs(f)
  const scroll = Object.create({
    getChild(chElem) {
      return this.children.get(chElem)
    },
    children: new Map,
    elem,
    get scrollTop () {
      return elem.scrollTop
    },
    add(chSel, {range, factor }) {
      const ch = vrugan(chSel)
      if (this.children.has(ch)) return
      this.children.set(ch, { range, factor, direction: 1 })
      this.elem.addEventListener('scroll', lib.updateChild(this, ch))

    },
    updateToParent(parentEvent) {
      const { deltaX, deltaY } = parentEvent
      lib.react(ch, deltaX, deltaY)
    }
  })
  return scroll
}




