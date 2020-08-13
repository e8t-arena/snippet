// got https://github.com/sindresorhus/got
// jsdom https://www.npmjs.com/package/jsdom
// tunnel (http proxy)
//   https://github.com/koichik/node-tunnel
// cheerio https://github.com/cheeriojs/cheerio
// mongodb https://www.npmjs.com/package/mongodb
// mongooes https://mongoosejs.com/

const got = require('got')
const {JSDOM} = require('jsdom')
const {randomUA} = require('./uas')

let current_ua = randomUA()
console.log(current_ua)

let auto = 'https://dict.youdao.com/suggest?type=DESKDICT&num=4&q=thumbnail&ver=2.0&le=eng'
let auto_return = `<suggest>    <type>eng</type>    <items>        <item>            <title><![CDATA[thumbnail]]></title>            <explain><![CDATA[n. 拇指指甲；极小的东西；短文; adj. 极小的，极短的]]></explain>            <result_num>0</result_num>        </item>        <item>            <title><![CDATA[thumbnails]]></title>            <explain><![CDATA[n. 拇指甲（thumbnail的复数形式）]]></explain>            <result_num>0</result_num>        </item>        <item>            <title><![CDATA[thumbnail sketch]]></title>            <explain><![CDATA[简略的勾画；不屑一顾]]></explain>            <result_num>0</result_num>        </item>        <item>            <title><![CDATA[thumbnail image]]></title>            <explain><![CDATA[缩略图]]></explain>            <result_num>0</result_num>        </item>    </items></suggest>`

// youdao / iciba / baidu / 海词

const start = keyword => {
  let url = `https://m.youdao.com/dict?le=eng&q=${keyword}`
  got(url, {
    headers: {
      'User-Agent': current_ua,
    },
    agent: {
      // https: tunnel.httpsOverHttp({
      //   proxy: {
      //     host: 'localhost'
      //     port: 3128
      //   }
      // })
    }
  }).then(res => {
    // console.log(res.body)
    // const dom = new JSDOM(res.body)
    // console.log(dom.window.document.querySelector('title').textContent)
    console.log(parseResult(res.body))
  }).catch(console.error)
}

// word ukPhonetic ukAudio usPhonetic usAudio meaning [] note

const select = (root, query) => root.querySelector(query)

const selectAll = (root, query) => root.querySelectorAll(query)

const parseResult = content => {
  let result = (new JSDOM(content)).window.document.querySelector('#ec')
  console.log(result)
  let word = select(result, 'h2 > span')
  word = word && word.textContent.trim()

  let phonetic = select(result, 'h2 > div > span > span')
  phonetic = phonetic && phonetic.textContent
  let ukPhonetic = select(result, 'h2 > div > span:nth-child(1) > span')
  ukPhonetic = ukPhonetic && ukPhonetic.textContent.trim()
  let ukAudio = select(result, 'h2 > div > span:nth-child(1) > a')
  ukAudio = ukAudio && ukAudio.getAttribute('data-rel')
  // console.log(ukAudio.getAttribute('data-rel'))
  let usPhonetic = select(result, 'h2 > div > span:nth-child(2) > span')
  usPhonetic = usPhonetic && usPhonetic.textContent.trim()
  let usAudio = select(result, 'h2 > div > span:nth-child(2) > a')
  usAudio = usAudio && usAudio.getAttribute('data-rel')
  let meanings = Array.from(selectAll(result, 'ul > li')).map(li => li.textContent.trim())
  let note = selectAll(result, '.sub > p')
  note = note && Array.from(note).map(p => p.textContent.trim()).join(',')
  return {
    word,
    phonetic,
    ukPhonetic,
    ukAudio,
    usPhonetic,
    usAudio,
    meanings,
    note,
  }
}

let keywords = ['thumbnail']

let args = process.argv
if(args.length > 2)
  keywords = args.slice(2, args.length)

console.log(keywords)
keywords.forEach(keyword => start(keyword))
