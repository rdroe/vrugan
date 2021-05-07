import vrug from '../../index.js'

const master = vrug('body')

const follower = master
    .addScroller('.stage-view.from-right')
    .addDirection('h', 0, 100, 0, 100)
    .addDirection('v', 0, 45, 25, 50)
    .addDirection('v', 45, 195, 125, 375)

const offset = 250

const follower1 = master
    .addScroller('.stage-view.from-left')
    .addDirection('h', 100, 0, offset, offset + 100)
    .addDirection('v', 0, 45, offset + 25, offset + 50)
    .addDirection('v', 45, 195, offset + 125, offset + 375)

follower.init()
follower1.init()

