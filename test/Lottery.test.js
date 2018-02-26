const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider()
const web3 = new Web3(provider)
const { interface, bytecode } = require('../compile')('Lottery')

let accounts
let instance

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  instance = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' })

  instance.setProvider(provider)
})

describe('Lottery', () => {
  it('initializes with address', () => {
    assert.ok(instance.options.address)
  })

  it('initializes with manager address', async () => {
    const manager = await instance.methods.manager().call()
    assert.ok(manager == accounts[0])
  })
})

