import React, { Component } from 'react'
import { Button, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'
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
      description: <a>View Campaign</a>,
      fluid: true
    }))
    return (<Layout>
      <Button icon='plus circle' content='Create Campaign' primary floated='right' />
      <Card.Group items={items} />
    </Layout>)
  }
}
