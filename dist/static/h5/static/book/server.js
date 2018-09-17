const Koa = require("koa")
const app = new Koa()
const staticServer = require("koa-static")

const proxy = require('koa-proxies')

app.use(staticServer('.'))

app.use(proxy('/picApi', {
    target: 'http://test.chenyoujiu.com',
    changeOrigin: true,
    logs: true
  }))

app.listen(3000)

console.log('start at localhost@3000')

