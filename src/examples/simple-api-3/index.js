

import vrug from '../../index.js'

// You can pause and resume
const master = vrug('body')
const movementSpan = 150
const pause = 200 // pause in a single follower's path
const delay = 50 // delay between starting various followers

const startPs = 100
const startPe = startPs + movementSpan
const startLocation = 20

let nudge = 0

const incrementVars = (previousPs, previousLocation) => {
    const nextPs = previousPs + delay
    const nextPe = nextPs + movementSpan
    const nextLoc = previousLocation + 12
    return [nextPs, nextPe, nextLoc]
}

const nudgeLast = (nudgeBy) => {
    const lastAdded = document.querySelector('body > .container > div:last-child')
    lastAdded.style.marginLeft = `${nudgeBy}vw`
}

const createFollower = (ps, pe, location) => {
    master.fromBelow(ps, pe, location, 30)
        .resume(pe + pause, pe + pause + movementSpan, 30)
        .resume(pe + pause * 3, pe + pause * 3 + movementSpan, 50)

    nudge += 5
}

createFollower(startPs, startPe, startLocation)
nudgeLast(nudge)
const [ps2, pe2, loc2] = incrementVars(startPs, startLocation)

createFollower(ps2, pe2, loc2)
nudgeLast(nudge)
const [ps3, pe3, loc3] = incrementVars(ps2, loc2)

createFollower(ps3, pe3, loc3)
nudgeLast(nudge)
const [ps4, pe4, loc4] = incrementVars(ps3, loc3)

createFollower(ps4, pe4, loc4)
nudgeLast(nudge)
const [ps5, pe5, loc5] = incrementVars(ps4, loc4)

createFollower(ps5, pe5, loc5)
nudgeLast(nudge)
const [ps6, pe6, loc6] = incrementVars(ps5, loc5)

createFollower(ps6, pe6, loc6)
nudgeLast(nudge)
