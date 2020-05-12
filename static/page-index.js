// import * as dd from 'dingtalk-jsapi'

window.onload = ddGo()

async function ddGo () {
  try {
    const codeRes = await getDDCode()
    if (codeRes && codeRes.code) {
      console.log('code', codeRes)
      replaceToCas(codeRes.code)
      showFailDialog()
    }
  } catch (error) {
    console.log('get code error', error)
  }
}

async function getDDCode () {
  return new Promise((resolve, reject) => {
    dd.ready(async function () {
      // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
      dd.runtime.permission.requestAuthCode({
        corpId: 'ding188c13dcf749c6ac35c2f4657eb6378f',
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

function replaceToCas (code) {
  dd.biz.navigation.replace({
    url: `http://i.mctech.vip/cas/third/private/dingTalk/qr-login?code=${code}&from=mcdd`,
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
        ddGo()
      }
    },
    onFail (err) {
      console.log(err)
    }
  })
}
