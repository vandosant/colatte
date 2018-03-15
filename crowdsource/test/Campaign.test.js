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
    } catch(err) {
      assert(err)
    }
  })
})
