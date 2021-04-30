

make a stage-view (a follower) that starts below the screen:

import core from core.js

const { fromBelow } = core 

const follower = fromBelow(100, 300)
follower.className('classname')
follower.initScrollers()

the default "below" follower will have an entire screen of scrolling. it comes onto the main screen, then passes from it. this will happen between 100 and 300 of the master scroller.

className is for styling.

the same works for above, left, and right.

### diagonality

before running initScrollers, we could have done this:

   fromLeft(follower, 150, 250)
   
now, the upward scroll remains in effect--but at the same time for the subrange, it will also move from left to right. 

the ranges need not entirely overlap. in calls to functions like fromBelow and fromLeft, passing a first argument that is already a follower just says "attach to the same html element that was already created." otherwise , such calls will create a new element.


