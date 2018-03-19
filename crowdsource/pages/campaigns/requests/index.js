import React, { Component } from 'react'
import {
  Button,
  Table
} from 'semantic-ui-react'
import Layout from '../../../components/Layout'
import { Link, Router } from '../../../routes'
import getCampaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'

export default class RequestIndex extends Component {
  static async getInitialProps (props) {
    const campaign = getCampaign(props.query.address)
    let requestCount = await campaign.methods.getRequestsCount().call()
    requestCount = parseInt(requestCount)
    const requests = await Promise.all(
      Array(requestCount)
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call()
      })
    )
    const summary = await campaign.methods.getSummary().call()

    return {
      address: props.query.address,
      approversCount: summary[3],
      requests,
      requestCount
    }
  }

  async handleApprove (id) {
    try {
      const campaign = getCampaign(this.props.address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.approveRequest(id).send({
        from: accounts[0]
      })
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      console.error(err)
    }
  }

  async handleFinalize (id) {
    try {
      const campaign = getCampaign(this.props.address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0]
      })
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated='right' style={{ marginBottom: '1em' }}>Add Request</Button>
          </a>
        </Link>
        <h3>Request List</h3>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Approval Count</Table.HeaderCell>
              <Table.HeaderCell>Approve</Table.HeaderCell>
              <Table.HeaderCell>Finalize</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.requests.map((request, index) => {
              const isApproved = request.approvalCount > this.props.approversCount / 2
              return (
                <Table.Row
                  key={index}
                  disabled={request.completed}
                  positive={isApproved && !request.completed}
                >
                  <Table.Cell>{index}</Table.Cell>
                  <Table.Cell>{request.description}</Table.Cell>
                  <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
                  <Table.Cell>{request.recipient}</Table.Cell>
                  <Table.Cell>{request.approvalCount} / {this.props.approversCount}</Table.Cell>
                  <Table.Cell>
                    {request.completed ? null : (
                      <Button
                        onClick={() => this.handleApprove(index)}
                        basic
                        color='green'
                      >Approve</Button>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {request.completed ? null : (
                      <Button
                        onClick={() => this.handleFinalize(index)}
                        basic
                        color='teal'
                      >Finalize</Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    )
  }
}
