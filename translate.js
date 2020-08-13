/*

请求模块
  Bing
    网页请求
    API 请求
 */



const got = require('got'),
  { randomUA } = require('./uas'),
  path = require('path'),
  readline = require('readline'),
  fs = require('fs');

ONE_TIME_COUNT = 2000
SLEEP_TIME = () => (Math.random() + 0.5) * 1.5 * 1000
BING_URL = 'https://cn.bing.com/Translator'
API_URL = 'https://cn.bing.com/ttranslatev3'
NEWLINE = '#$%#$%'

const mkSleepArray = length => {
  let time = 0;
  let timeArray = [];
  [...Array(length).keys()].forEach(async (key, index) => {
    if (index > 0)
      time += await SLEEP_TIME()
    timeArray[index] = time
  })
  return timeArray
}

const getIID = async (url) => {
  const response = await got(url);
  let pattern = /data-iid="(?<iid>.*?)"/
  let match = pattern.exec(response.body)
  console.log()
  if (match && match.groups && match.groups.iid) {
    return match.groups.iid
  }
}


const parseBing = data => {
  // console.log(data)
  data = JSON.parse(data)
  let translation;
  if (data.length > 0) {
    translation = data[0]['translations'][0]['text']
  }
  return translation;
}

const post = async (url, content) => {
  let iid = getIID(BING_URL)
  let payload = {
    fromLang: "en",
    text: content,
    to: "zh-Hans"
  }
  const response = await got.post(url, {
    // body: JSON.stringify(payload),
    form: payload,
    headers: {
      'User-Agent': randomUA(),
      isVertical: 1,
      IG: 'IG',
      IID: `${iid}.1`
    }
  })
  let result = parseBing(response.body)
  // console.log(result);
  return result
}

const run = ({ pathArray, output }) => {
  pathArray.forEach(
    path => translate({ path, output })
  )
}

const translate = ({ path, output }) => {

}

const translateDir = ({ path, output }) => {

}

const tranlateFile = ({ path, output }) => {

}

const pipe = (data, ...arguments) => {
  console.log(arguments)
}

// pipe(5, 1,2,3)


const getOutput = (filePath, outDir) => {
  let outPath;
  let srcDir = path.dirname(filePath)
  let srcBase = path.basename(filePath)

  console.log([srcDir, outDir].map(item=>path.resolve(item)))

  if (typeof (outDir) === 'string' && outDir.trim() !== '' && path.resolve(outDir) !== path.resolve(srcDir)) {
    outPath = path.join(outDir, srcBase)
  } else {
    // 原始位置
    outPath = path.join(srcDir, srcBase + '-tranlate')
  }
  console.log([srcDir, outPath].map(item=>path.resolve(item)))
  return path.resolve(outPath)
}

// testPath = '~/Workspace/peterlau/forks/Recoil/docs/docs/guides/asynchronous-data-queries.md'
const sleep = timeout => new Promise(resolve => {
  setTimeout(() => {
    resolve()
  }, timeout);
})

let codeTest = 0
const isCode = line => {
  let test = line.trim().startsWith('```')
  // if (test)
  //   console.log(codeTest, test, line)
  // codeTest++
  return test
}

const splitFile = async (filePath, outDir) => {
  // read by line
  // count words (>= 3000)
  // request list (n = 10)
  // await all requests
  let dest = getOutput(filePath, outDir)
  const writeStream = fs.createWriteStream(dest)

  const readStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  })
  let charCount = 0;
  let charPart = '';
  let partArray = [];
  let inCode = false;
  for await (let line of rl) {
    // TODO: split out code parts
    line += '\n'
    let codeTest = isCode(line)
    if (codeTest && inCode === false) {
      // console.log('in code ... ' + charCount)
      partArray.push([charPart, inCode])
      inCode = true
      charCount = line.length
      charPart = line
    } else if (codeTest && inCode === true) {
      charCount += line.length
      charPart += line
      // console.log('out code ... ' + charCount)
      // console.log(charPart)
      partArray.push([charPart, inCode])
      inCode = false
      charCount = 0
      charPart = ''
    } else {
      if (charCount >= ONE_TIME_COUNT) {
        console.log('reach max count ... ' + charCount)
        partArray.push([charPart, inCode])
        charCount = 0
        charPart = ''
      }
      charCount += line.length
      charPart += line
    }
  }
  console.log('reach end ... ' + charCount)
  if (charCount !== 0)
    partArray.push([charPart, inCode])

  sleepArray = mkSleepArray(partArray.length)
  let results = await Promise.all(
    partArray.map(
      async (part, index) => {
        let [chars, inCode] = part
        if (inCode) {
          return chars
        } else {
          await sleep(sleepArray[index])
          return await post(API_URL, chars)
          // return chars
        }
      }
    )
  )
  result = results.join('\n')
  // console.log(result)
  writeStream.write(result)

  writeStream.on('finish', async () => {
    console.log('All writes are now complete.');
  });
  return dest
}

const main = async () => {
  let [, , srcPath, outDir = '.'] = process.argv || []
  console.log(srcPath, outDir)
  if (srcPath === undefined) {
    throw new Error('Please type in target file')
  }
  let outDirStat = await fs.promises.stat(outDir)
  if (!outDirStat.isDirectory()) {
    await fs.promises.mkdir(outDir)
  }
  let dest = await splitFile(srcPath, outDir)
  console.log(dest)
}

main().catch(console.error)

// post(API_URL, "Stack Overflow Public#\$%\#\$% questions and answers")
