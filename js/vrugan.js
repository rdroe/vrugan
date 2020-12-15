import { invariant, qs, tr } from '/js/util/util.js'
const PERP = 1
const PARA = 0
export const vrugan = (f) => {
  const lib = {
    verticalMove(par, chVrug) {

      const chParams = par.getChild(chVrug)
      const ch = chVrug.elem
      return (ev) => {
          console.log('ev',ev)	    
	// for logging, assign new scroll position to data element
        par.elem.dataset.scrollTop = par.scrollTop

        invariant( () => ev.type === 'scroll' )
        const { range, factor, direction } = chParams

	  if (direction === PERP) {
        if (par.scrollTop > range[0] && par.scrollTop < range[1]) {
          const diff = par.scrollTop - range[0]
            ch.dataset.scrollLeft = tr(diff * factor)
            ch.scrollLeft = ch.dataset.scrollLeft
         } else if (par.scrollTop <= range[0]) {
            ch.dataset.scrollTop = 0
            ch.scrollLeft = 0
        } else if (par.scrollTop >= range[1]) {
            ch.dataset.scrollLeft = tr((range[1] - range[0]) * factor)
            ch.scrollLeft =  ch.dataset.scrollLeft
        }
	  } else if (direction === PARA) {
          const diff = par.scrollTop - range[0]
            ch.dataset.scrollTop = tr(diff * factor)
            ch.scrollTop = ch.dataset.scrollTop
         } else if (par.scrollTop <= range[0]) {
            ch.dataset.scrollTop = 0
            ch.scrollTop = 0
        } else if (par.scrollTop >= range[1]) {
            ch.dataset.scrollTop = tr((range[1] - range[0]) * factor)
            ch.scrollTop = ch.dataset.scrollTop 
        }


	  }
    },
  
    horizontalMove(par, chVrug){

      const chParams = par.getChild(chVrug)
      const ch = chVrug.elem
      return (ev) => {
          console.log('ev',ev)	    
	// for logging, assign new scroll position to data element
        par.elem.dataset.scrollLeft = par.scrollLeft

        invariant( () => ev.type === 'scroll' )
        const { range, factor, direction } = chParams
        if (par.scrollLeft > range[0] && par.scrollLeft < range[1]) {
          const diff = par.scrollLeft - range[0]
          if (direction === PERP) {

            ch.dataset.scrollLeft = tr(diff * factor)
            ch.scrollTop = tr(diff * factor)
          } else {
            
	  }
        } else if (par.scrollLeft <= range[0]) {
            ch.dataset.scrollLeft = 0
            ch.scrollTop = 0
        } else if (par.scrollLeft >= range[1]) {
            ch.dataset.scrollLeft = tr((range[1] - range[0]) * factor)
            ch.scrollTop = tr((range[1] - range[0])  * factor)
        }
      }
    
    }
  
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
      add(chSel, { range, factor, direction = PERP, sensitiveTo = 'v' }) {
          const ch = vrugan(chSel)
	  if (this.children.has(ch)) return
	  // track this child by placing it in parent's set.  
          this.children.set(ch, { range, factor, direction })
	  // add the listener	  
          if (sensitiveTo === 'v') {
	    this.elem.addEventListener('scroll', lib.verticalMove(this, ch))
	  } else if (sensitiveTo === 'h') {
 	    this.elem.addEventListener('scroll', lib.horizontalMove(this, ch))           
	  } else throw new TypeError('The argument must be "h" or "v".')

    },
    updateToParent(parentEvent) {
      const { deltaX, deltaY } = parentEvent
      lib.react(ch, deltaX, deltaY)
    }
  })
  return scroll
}




