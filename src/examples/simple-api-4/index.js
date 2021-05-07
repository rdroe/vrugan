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
    return incrementVars(ps, location)
}

const createFollowers = (followersToCreate, startVars, horizontalOffset) => {
    let vars

    let i = 0
    while (i < followersToCreate) {
        const [pss, pee, llo] = vars || startVars
        vars = createFollower(pss, pee, llo)
        nudgeLast(horizontalOffset + i * 5)
        i++
    }
}

const initVars = [startPs, startPe, startLocation]

createFollowers(5, initVars, 12)


let delaySet = 300

createFollowers(
    7,
    [startPs + delaySet, startPe + delaySet, 75],
    22)

delaySet = 700

createFollowers(
    12,
    [startPs + delaySet, startPe + delaySet, 30],
    30)
delaySet = 900

createFollowers(
    4,
    [startPs + delaySet, startPe + delaySet, 40],
    8)

delaySet = 1500

createFollowers(
    8,
    [startPs + delaySet, startPe + delaySet, 60],
    15)
document.querySelector('body > .container').style.height = '3000vh'
