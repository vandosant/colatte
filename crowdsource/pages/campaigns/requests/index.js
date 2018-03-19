import React, { Component } from 'react'
import {
  Button,
  Table
} from 'semantic-ui-react'
import Layout from '../../../components/Layout'
import { Link } from '../../../routes'
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

    return {
      address: props.query.address,
      requests,
      requestCount
    }
  }

  render () {
    return (
      <Layout>
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
            {this.props.requests.map((request, index) => <Table.Row key={index}>
                <Table.Cell>{index}</Table.Cell>
                <Table.Cell>{request.description}</Table.Cell>
                <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
                <Table.Cell>{request.recipient}</Table.Cell>
                <Table.Cell>{request.approvalCount}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
      </Layout>
    )
  }
}
