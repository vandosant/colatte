import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
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
    return (<div>
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      <Card.Group items={items} />
      </div>
    )
  }
}
