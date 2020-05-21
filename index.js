const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const path = require('path')

const app = new Koa()
const staticPath = './static'

const router = new Router()
router.get('/', (ctx, next) => {
  ctx.body = 'Hello world'
})
router.get('/redirect', (ctx, next) => {
  ctx.redirect('http://www.163.com')
})
router.get('/auth',(ctx,next)=>{
  ctx.body={
    success:true
  }
})

app
  .use(bodyParser())
  .use(static(path.join(__dirname, staticPath)))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(ctx => {
    ctx.body = ctx.body || 'Hello whatever'
  })
  .listen(3000, () => {
    console.log('3000')
  })
