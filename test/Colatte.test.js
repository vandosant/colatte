const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider()
const web3 = new Web3(provider)
const { interface, bytecode } = require('../compile')

let accounts
let instance

beforeEach(async function () {
  accounts = await web3.eth.getAccounts()

  instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [ 'Hello Ethereum' ] })
    .send({ from: accounts[0], gas: '1000000' })

  instance.setProvider(provider)
})

describe('Colatte', function () {
  it('initializes with address', function () {
    assert.ok(instance.options.address)
  })

  it('initializes with initialMessage', async function () {
    const message = await instance.methods.message().call()
    assert.equal(message, 'Hello Ethereum')
  })
})
