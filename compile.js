const path = require('path')
const fs = require('fs')
const solc = require('solc')

const filePath = path.resolve(__dirname, 'contracts', 'Colatte.sol')
const src = fs.readFileSync(filePath, 'utf8')

module.exports = solc.compile(src, 1).contracts[':Colatte']
