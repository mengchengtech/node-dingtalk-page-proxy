// import * as dd from 'dingtalk-jsapi'

window.onload = checkTarget()

function checkTarget () {
  const url = new URL(window.location.href)
  const searchParams = new URLSearchParams(url.search)
  ddGo(searchParams.get('agentId'), searchParams.get('type'))
}

async function ddGo (agentId, type) {
  console.log('config', globalConfig)
  try {
    const codeRes = await getDDCode()
    if (codeRes && codeRes.code) {
      console.log('code', codeRes)
      replaceToTarget(type, agentId, codeRes.code)
      return
    }
    showFailDialog()
  } catch (error) {
    console.log('get code error', error)
  }
}

async function getDDCode () {
  return new Promise((resolve, reject) => {
    dd.ready(async function () {
      // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
      dd.runtime.permission.requestAuthCode({
        corpId: globalConfig.cropId,
        onSuccess: function (result) {
          console.log('res', result)
          resolve(result)
        },
        onFail: function (err) {
          reject(err)
        }
      })
    })
  })
}

function replaceToTarget (type, agentId, code) {
  const url =
    (type && type === 'invoker'
      ? globalConfig.invokerTarget
      : globalConfig.casTarget) + `?agentId=${agentId}&code=${code}`
  dd.biz.navigation.replace({
    url,
    onSuccess: () => {
      console.log('replaced')
    },
    onFail: err => {
      showFailDialog()
    }
  })
}

function showFailDialog () {
  dd.device.notification.confirm({
    message: '登录失败,请重试',
    title: '登录失败',
    buttonLabels: ['退出', '重试'],
    onSuccess (res) {
      const index = res.buttonIndex
      console.log(index)
      if (index === 0) {
        dd.biz.navigation.close()
      }
      if (index === 1) {
        checkTarget()
      }
    },
    onFail (err) {
      console.log(err)
    }
  })
}
