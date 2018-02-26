const path = require('path')
const fs = require('fs')
const solc = require('solc')

module.exports = (fileName) => {
  const filePath = path.resolve(__dirname, 'contracts', `${fileName}.sol`)
  const src = fs.readFileSync(filePath, 'utf8')
  return solc.compile(src, 1).contracts[`:${fileName}`]
}
