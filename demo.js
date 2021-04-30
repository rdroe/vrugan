
const connect = require('connect')
const serveStatic = require('serve-static')

const setUpDemos = (app, staticFiles, onError) => {

    const { js, html } = staticFiles
    const htmls = serveStatic(html)
    const jss = serveStatic(js)

    app.use('/', htmls)
    app.use('/js', jss)

    app.use(onError)
}

const demo = () => {
    const app = connect()
    setUpDemos(app, {
        js: 'js',
        html: 'examples'
    },
        (err) => { throw err })
    app.listen(8888, () => { console.log('Demos listening @ localhost:8888') })
}


demo()
