import { IN_RANGE, UPDATER, SCROLLER, LESS, VERTICAL } from './globals.js'
const GREATEST_LESS_THAN = 'greatestLessThan'
const LEAST_GREATER_THAN = 'leastGreaterThan'

class MismatchedScrollResults extends Error { }

const conditionallySupplantScroller = (comparFn, pos, champ, challenger) => {

    const challengerPair = [challenger, challenger.getScrollResult(pos)]


    const result = comparFn(champ, challengerPair)

    if (result) {

        return challengerPair
    }

    return champ
}


export const getEffectiveUpdaters = (allElementScrollers, pos) => {
    const listsByType = {}

    const typedList = {
        [GREATEST_LESS_THAN]: [],
        [LEAST_GREATER_THAN]: [],
        inRangeScrollers: [],
    }

    allElementScrollers.forEach(scr => {

        if (scr.get('isActive') !== true) {
            return
        }

        if (scr.get('responds') !== 'n/a') return

        const type = scr.get('isUpdater') ? UPDATER : SCROLLER
        listsByType[type] = listsByType[type] ? listsByType[type] : typedList
        listsByType[type].inRangeScrollers.push(scr)



    })

    return listsByType
}

export default (allElementScrollers, responseDir, position) => {
    const listsByType = {}

    const typedList = {
        [GREATEST_LESS_THAN]: [null, -Infinity],
        [LEAST_GREATER_THAN]: [null, Infinity],
        inRangeScrollers: [],
    }

    allElementScrollers.forEach(scr => {
        if (scr.get('isActive') !== true) {
            return
        }

        if (scr.get('responds') !== responseDir) return
        if (scr.get('isUpdater')) return

        const type = scr.get('isUpdater') ? UPDATER : SCROLLER
        listsByType[type] = listsByType[type] ? listsByType[type] : typedList

        const scrollerRelationResult = scr.getRelativePosition(position)

        if (scrollerRelationResult === IN_RANGE) {
            listsByType[type].inRangeScrollers.push(scr)
            return
        }
        // Is the top of the range LESS than or GREATER than the position?
        const scrollerRelationProperty = scrollerRelationResult ===
            LESS
            ? GREATEST_LESS_THAN
            : LEAST_GREATER_THAN

        const champ = listsByType[type][scrollerRelationProperty]


        const compareFn =
            scrollerRelationProperty === GREATEST_LESS_THAN
                ? ([, champRange], [, challRange]) => challRange > champRange
                : ([, champRange], [, challRange]) => challRange < champRange

        listsByType[type][scrollerRelationProperty] = conditionallySupplantScroller(compareFn, position, champ, scr)

    })
    return listsByType
}

export const fireApplicableUpdaters = (pos, data) => {

    if (!data) return
    data.inRangeScrollers.forEach(scr => scr.update(pos))

}

const augmentScrollResult = (pos, res, [scroller, scrollResult]) => {
    if (!scroller) return res
    if (typeof scrollResult !== 'number' || [Infinity, -Infinity].includes(scrollResult)) return res
    if (scroller.get('responds') == VERTICAL) {
        // vertical case; overwrite the undefined scrollTop.
        if (res.scrollTop === undefined) res.scrollTop = scrollResult
    } else {
        // horz case; overwrite the undefined scrollLeft 
        if (res.scrollLeft === undefined) res.scrollLeft = scrollResult
    }
    return res
}

export const applicableScrollResult = (pos, data /*, prevScrollData */) => {

    const results = {};
    if (!data) return results

    if (data.inRangeScrollers !== undefined) {
        data.inRangeScrollers.forEach(scr => {

            const res = scr.getScrollResult(pos)
            if (res !== undefined) {
                results[scr.get('responds') === VERTICAL ? 'scrollTop' : 'scrollLeft'] = res
            }
        })
    }

    if (results.scrollTop !== undefined && results.scrollLeft !== undefined) return results

    augmentScrollResult(pos, results, data[GREATEST_LESS_THAN])
    augmentScrollResult(pos, results, data[LEAST_GREATER_THAN])

    return results
}
