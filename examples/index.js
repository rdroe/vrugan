const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const path = require('path')

const assets = serveStatic(path.join(__dirname, '..'))
const server = http.createServer(function onRequest(req, res, next) {
    assets(req, res, finalhandler(req, res))
})
server.listen(8080)
