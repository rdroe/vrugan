// this is a work in progress: a staging ground for the simpler api.
import vrug from '../../index.js'

/*
  The functions fromBelow, fromLeft, fromRight, and fromTop take four arguments:
  arg 1: in the master timeline, when this follower should begin moving.
  arg 2: in the master timeline, when this follower should complete moving
  arg 3: in the relevant offscreen direction, how far out should the element begin? e.g., 20 as an argument for fromBelow will start it out 20 vh down below the screen. (vh here is like a percentage of the screen's width)
  arg4: what percentage of the screen should be traversed, in the relevant direction.
 */
const master = vrug('body')

// The first stage of the first scroller starts from 20 vh offscreen. since this is a "fromBelow" call, that is 20 vh from beneath the screen's edge.
// the last arg, "100" means it moves 100vh: all the way offscreen.
master.fromBelow(100, 200, 20, 100)

master.fromLeft(201, 300, 50, 90)

master.fromTop(301, 400, 20, 90)

// you can combine scrollers from different axes for diagonality.
// 401- 500 is the same time range in both, producting an angle of scroll. this one comes in from the bottom right corner.
// Do not combine same-axis, eg fromTop with fromBelow
master.fromRight(401, 500, 20, 100)
    .fromBelow(401, 500, 0, 70)
