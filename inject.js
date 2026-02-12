/* global alert */
;(function () {
  const html = document.documentElement.outerHTML
  const getHtml = html.replace(/invite\//g, '').replace(/%3A/g, ':').replace(/%2F/g, '/')
  const getHtml1 = html.replace(/<.*?>/g, '')
  let TelegramLink = (getHtml + getHtml1).match(/t\.me\/.*?(?=")/g)
  console.log(TelegramLink)
  TelegramLink = TelegramLink.map(url => {
    try {
      return decodeURIComponent(url).replace(/(<| |&amp;|\?fbclid).+/g, '')
    } catch {}
  }).filter(x => x !== 't.me/' && x)

  const groupLink = Array.from(new Set(TelegramLink))
  let str = ''
  for (let i = 0; i < groupLink.length; i++) {
    str += `https://${groupLink[i]}\n`
  }

  if (navigator.userAgent.indexOf('Firefox') >= 0) {
    createBox(str)
    alert(`已输出：${groupLink.length} 个 Telegram 小组链接`)
  } else {
    copy(str)
    alert(`已复制：${groupLink.length} 个 Telegram 小组链接`)
  }
})()

// 复制
function copy (str) {
  const input = document.createElement('textarea')
  document.body.appendChild(input)
  input.value = str
  input.select()
  document.execCommand('Copy')
  input.remove()
}

/**
 * @description 创建一个窗口存放链接
 * @param {string} str - 链接
 */
function createBox (str) {
  const outText = document.getElementById('outText')
  if (outText) {
    outText.value = str
  } else {
    const para = document.createElement('textarea')
    const element = document.querySelector('body')
    element.appendChild(para)
    para.setAttribute('id', 'outText')
    para.setAttribute('style', 'position:fixed;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);border:1pxsolid;padding:3px 12px;border-radius:10px;color:#fff;background-color:#99CCFF;z-index:9999;font-size:16px;width:640px;height:360px;')
    outText.value = str
  }
}
