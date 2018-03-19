import React, { Component } from 'react'
import {
  Card,
  Button,
  Grid
} from 'semantic-ui-react'
import Layout from '../../components/Layout'
import ContributeForm from '../../components/ContributeForm'
import { Link } from '../../routes'
import getCampaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3'

export default class CampaignShow extends Component {
  static async getInitialProps (props) {
    const campaign = getCampaign(props.query.address)
    const summary = await campaign.methods.getSummary().call()
    return {
      address: props.query.address,
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
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Card.Group items={items} />
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>
                    View Requests
                  </Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}
