
const connect = require('connect')
const serveStatic = require('serve-static')

const setUpDemos = (app, staticFiles) => {

    const { js, html } = staticFiles
    const htmls = serveStatic(html)
    const jss = serveStatic(js)

    app.use('/', htmls)
    app.use('/js', jss)

}

const demo = () => {
    const app = connect()
    setUpDemos(app, {
        js: 'js',
        html: 'examples'
    }
    )
    app.listen(8888, () => { console.log('Demos listening @ localhost:8888') })
}


demo()
