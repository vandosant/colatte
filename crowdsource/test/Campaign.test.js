const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider()
const web3 = new Web3(provider)

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts
let campaign
let campaignAddress
let campaignFactory
let campaignFactoryAddress

beforeEach(async function () {
  accounts = await web3.eth.getAccounts()

  try {
    campaignFactory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: compiledFactory.bytecode, arguments: [] })
      .send({
        from: accounts[0],
        gas: '1000000'
      })
  } catch(err) {
    console.log(err)
  }

  try {
    await campaignFactory.methods.createCampaign('100').send({
      from: accounts[0],
      gas: '1000000'
    })
  } catch(err) {
    console.log(err)
  }

  [ campaignAddress ] = await campaignFactory.methods.getDeployedCampaigns().call()

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  )

  campaignFactory.setProvider(provider)
  campaign.setProvider(provider)
})

describe('Campaigns', () => {
  it('deploys a factory', () => {
    assert.ok(campaignFactory.options.address)
  })

  it('deploys a campaign', () => {
    assert.ok(campaign.options.address)
  })

  it('sets creator as campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(accounts[0], manager)
  })

  it('allows contributions and marks them as approvers', async () => {
    const contributor = accounts[1]

    const isApproverBefore = await campaign.methods.approvers(contributor).call()
    assert(!isApproverBefore)

    await campaign.methods.contribute().send({
      from: contributor,
      value: '200'
    })

    const isApproverAfter = await campaign.methods.approvers(contributor).call()
    assert(isApproverAfter)
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '100'
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('allows a manager to request a payment', async () => {
    await campaign.methods
      .createRequest('Buy ramen', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      })

    const request = await campaign.methods.requests(0).call()

    assert.equal('Buy ramen', request.description)
  })

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    })

    await campaign.methods
      .createRequest('Buy bubble gum', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      })

    const requestBefore = await campaign.methods.requests(0).call()
    assert.equal('Buy bubble gum', requestBefore.description)
    assert.equal(false, requestBefore.completed)

    let balance = await web3.eth.getBalance(accounts[1])
    const initialBalance = web3.utils.fromWei(balance, 'ether')

    await campaign.methods
      .approveRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      })

    await campaign.methods
      .finalizeRequest(0)
      .send({
        from: accounts[0],
        gas: '1000000'
      })

    const requestAfter = await campaign.methods.requests(0).call()
    assert.equal('Buy bubble gum', requestAfter.description)
    assert.equal(true, requestAfter.completed)

    balance = await web3.eth.getBalance(accounts[1])
    const finalBalance = web3.utils.fromWei(balance, 'ether')
    const difference = finalBalance - initialBalance
    assert(difference >= 5)
  })

  it.skip('prevents multiple request completions')
  it.skip('prevents request completion without apprrovals')
  it.skip('only allows manager to create requests')
  it.skip('only allows manager to finalize requests')
})
