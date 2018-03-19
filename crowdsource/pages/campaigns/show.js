import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import getCampaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3'

export default class CampaignShow extends Component {
  static async getInitialProps (props) {
    const campaign = getCampaign(props.query.address)
    const summary = await campaign.methods.getSummary().call()
    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      managerAddress: summary[4]
    }
  }

  render () {
    const items = [
      {
        header: this.props.managerAddress,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: {
          overflowWrap: 'break-word'
        }
      },
      {
        header: this.props.minimumContribution,
        meta: 'Minimum contribution (wei)',
        description: 'You must contribute this much to become an approver'
      },
      {
        header: this.props.requestsCount,
        meta: 'Requests count',
        description: 'The number of spending requests that have been made by the manager'
      },
      {
        header: this.props.approversCount,
        meta: 'Approvers count',
        description: 'The number of addresses allowed to approve a spending request'
      },
      {
        header: web3.utils.fromWei(this.props.balance, 'ether'),
        meta: 'Campaign balance (ether)',
        description: 'The amount of ether that this campaign has available to spend'
      }
    ]
    return (
      <Layout>
        <Card.Group items={items} />
      </Layout>
    )
  }
}
