const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./compile')
const secrets = require('./secrets.json')

const provider = new HDWalletProvider(secrets.MNEMONIC, secrets.PROVIDER_URL)
const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()
  console.log('ATTEMPTING DEPLOY FROM ACCOUNT: ', accounts[0])

  const instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [ 'Hello Rinkeby!' ] })
    .send({ from: accounts[0], gas: '1000000' })

  instance.setProvider(provider)
  console.log('DEPLOYED TO ADDRESS: ', instance.options.address)
}
deploy()
