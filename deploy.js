const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./compile')('Lottery')
const secrets = require('./secrets.json')

const provider = new HDWalletProvider(secrets.MNEMONIC, secrets.PROVIDER_URL)
const web3 = new Web3(provider)

const deploy = async ({ arguments = [] } = {}) => {
  const accounts = await web3.eth.getAccounts()
  console.log('ATTEMPTING DEPLOY FROM ACCOUNT: ', accounts[0])

  _log()
  const timeout = setInterval(_log, 1000)

  const instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments })
    .send({ from: accounts[0], gas: '1000000' })

  clearInterval(timeout)
  process.stdout.write('\n')
  instance.setProvider(provider)

  console.log('INTERFACE: ', interface)
  console.log('DEPLOYED TO ADDRESS: ', instance.options.address)
}

const _log = () => process.stdout.write(['\033[', 36, 'm', '.', '\033[0m'].join(''))

deploy()
