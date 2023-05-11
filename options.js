/* global fetch */
document.getElementById('getGroupName').addEventListener('click', getGroupName)
document.getElementById('linkScraper').addEventListener('click', linkScraper)
document.getElementById('copy').addEventListener('click', copy)
document.getElementById('clean').addEventListener('click', clean)

/**
 * @description HTML实体还原
 * @param {string} str - 内容
 * @returns {string} 转换后的字符
 */
function htmlEntitiesDecode (str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec)
  })
}

/**
 * @description HTML转义还原
 * @param {string} str - 内容
 * @returns {string} 转换后的字符
 */
function htmlUnescape (str) {
  str = str.replace(/&#123;/g, '{')
  str = str.replace(/&#125;/g, '}')
  str = str.replace(/&quot;/g, '"')
  str = str.replace(/&amp;/g, '&')
  str = str.replace(/&lt;/g, '<')
  str = str.replace(/&gt;/g, '>')
  str = str.replace(/&#10;/g, '\n')
  return str
}

// 获取小组名称
async function getGroupName () {
  const input = document.getElementById('input').value.match(/.+/g)
  const output = document.getElementById('output')
  const status = document.getElementById('status')
  status.style.display = 'block'
  output.value = ''
  let index = 0
  for (const url of input) {
    index++
    status.innerText = `${index}/${input.length}`
    const text = await fetch(url).then(response => response.text())
    let title = '获取不到名称'
    let image = '', description = ''
    try {
      title = text.match(/(?<=<span dir="auto">).*?(?=<\/span>)/g)[0]
    } catch {}
    try {
      const imageUrl = text.match(/(?<=<img class="tgme_page_photo_image" src=").*?(?=">)/g)[0]
      image = `=IMAGE("${imageUrl.includes('base64') ? '' : imageUrl}")`
    } catch {}
    try {
      description = text.match(/(?<=<div class="tgme_page_extra">).*?(?=<\/div>)/g)[0].replace(/\n|^"/g, '')
    } catch {}
    output.value += `${image}\t${title}\t${description}\n`
  }
  status.innerText = '完成'
}

// 抓取链接
async function linkScraper () {
  const input = document.getElementById('input').value.match(/.+/g)
  const output = document.getElementById('output')
  const status = document.getElementById('status')
  status.style.display = 'block'
  output.value = ''
  let index = 0
  for (const url of input) {
    index++
    const text = await fetch(url).then(response => response.text())
    status.innerText = `${index}/${input.length}`
    const getHtml = text.replace(/invite\//g, '').replace(/%3A/g, ':').replace(/%2F/g, '/')
    const getHtml1 = getHtml.replace(/<.*?>/g, '')
    const TelegramLink = (getHtml + getHtml1).match(/t\.me\/.*?(?=")/g)
    const groupLink = Array.from(new Set(TelegramLink))
    let str = ''
    for (let i = 0; i < groupLink.length; i++) {
      str += `https://${groupLink[i]}\n`
    }
    output.value += str
  }
  status.innerText = '完成'
}

// 复制
function copy () {
  const status = document.getElementById('status')
  status.style.display = 'none'
  const el = document.getElementById('output')
  el.select()
  document.execCommand('copy')
}

// 清空
function clean () {
  const status = document.getElementById('status')
  status.style.display = 'none'
  document.getElementById('input').value = ''
  document.getElementById('output').value = ''
}
