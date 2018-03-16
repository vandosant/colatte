import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'
import secrets from '../secrets.json'

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  secrets.CAMPAIGN_FACTORY_ADDRESS
)

export default instance
