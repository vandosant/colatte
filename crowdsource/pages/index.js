import React, { Component } from 'react'
import { Button, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'
import { Link } from '../routes'
import factory from '../ethereum/factory'

export default class Index extends Component {
  static async getInitialProps () {
    const campaigns = await factory.methods.getDeployedCampaigns().call()

    return {
      campaigns
    }
  }

  render () {
    const items = this.props.campaigns.map(c => ({
      header: c,
      description: (
        <Link route={`/campaigns/${c}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true
    }))
    return (<Layout>
      <Link route='/campaigns/new'>
        <a>
          <Button icon='plus circle' content='Create Campaign' primary floated='right' />
        </a>
      </Link>
      <Card.Group items={items} />
    </Layout>)
  }
}
