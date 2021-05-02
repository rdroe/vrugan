# vrugan
Magical scrolls that adjust to screen size.

#### Documentation is coming; some notes, for now:

- Run the examples with the npm script of that name (see package.json)
- Don't even bother trying to use any api aside from those demo'd in the simple-api examples
- For now, manually set the height of the container
- All sizes are treated as vh or vw
- Wherever you pass a raw number to the simple api, the functions will adapt the unit. So `.fromBelow` converts raw numbers to vh; but `.fromLeft` converts to vw behind the scenes, etc. 

A note for future docs is to mention that `simple-api.resume` can only be used on same axis. For differing axes, just attach a totally new scroller from the follower object (e.g. using `fromLeft`, `fromRight`, etc).
