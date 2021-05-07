

import vrug from '../../index.js'

// You can pause and resume
const master = vrug('body')
const movementSpan = 100

let ps = 100
let pe = ps + movementSpan

const pause = 320 // pause in a single follower's path

// in a call to the resume function, the first two arguments are the usually ps and pe. The last is simply how much further to go.

const follower = master.fromBelow(ps, pe, 20, 30)
// In "resume(...)" to create a delay, simply give a ps variable (first arg) that is greater than the prior pe.

follower.resume(pe + pause, pe + pause + movementSpan, 30)

// pause multiply.
// you'll always pick up from the last-created scroll effect. 
follower.resume(pe + pause * 3, pe + pause * 3 + movementSpan, 50)
