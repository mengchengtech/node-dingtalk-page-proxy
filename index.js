const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const path = require('path')
const axios = require('axios')

const app = new Koa()
const staticPath = './static'

const router = new Router()

router.get('/auth', async (ctx, next) => {
  if (!ctx.query.accessToken) {
    ctx.state = 400
    ctx.body = {
      code: 'empty_param',
      desc: 'accessToken为空'
    }
    return
  }
  if (!ctx.query.code) {
    ctx.state = 400
    ctx.body = {
      code: 'empty_param',
      desc: 'code为空'
    }
    return
  }
  const accessToken = ctx.query.accessToken
  const code = ctx.query.code
  const url = `https://oapi.dingtalk.com/user/getuserinfo?access_token=${accessToken}&code=${code}`
  const response = await axios.get(url)
  console.log(response.data)
  ctx.body = response.data
})

app
  .use(bodyParser())
  .use(static(path.join(__dirname, staticPath)))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000, () => {
    console.log('3000')
  })
