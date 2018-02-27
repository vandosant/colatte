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
    .send({
      from: accounts[0],
      gas: '1000000'
    })

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

  it('allows one player to enter', async () => {
    await instance.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    })

    const players = await instance.methods.getPlayers().call({
      from: accounts[0]
    })

    assert.equal(1, players.length)
    assert.equal(accounts[0], players[0])
  })

  it('allows multiple players to enter', async () => {
    await instance.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.01', 'ether')
    })
    await instance.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.01', 'ether')
    })
    await instance.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.01', 'ether')
    })

    const players = await instance.methods.getPlayers().call({
      from: accounts[0]
    })

    assert.equal(3, players.length)
    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])
  })

  it('requires a valid amount of ether to enter', async () => {
    try {
      await instance.methods.enter().send({
        from: accounts[0],
        value: 0
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('only allows manager to pick winner', async () => {
    try {
      await instance.methods.pickWinner().send({
        from: accounts[1]
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })
})

