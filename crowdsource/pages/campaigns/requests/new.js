import React, { Component } from 'react'
import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Message
} from 'semantic-ui-react'
import Layout from '../../../components/Layout'
import {
  Link,
  Router
} from '../../../routes'
import getCampaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'

export default class RequestNew extends Component {
  state = {
    isLoading: false,
    errorMessage: '',
    description: '',
    value: '',
    recipientAddress: ''
  }

  static async getInitialProps (props) {
    return {
      address: props.query.address
    }
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name]: value })
  }

  handleSubmit = async () => {
    this.setState({
      isLoading: true,
      errorMessage: ''
    })

    const {
      description,
      value,
      recipientAddress
    } = this.state

    try {
      const campaign = getCampaign(this.props.address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.createRequest(
        description,
        web3.utils.toWei(value, 'ether'),
        recipientAddress
      ).send({
        from: accounts[0]
      })
      Router.pushRoute(`/campaigns/${this.props.address}/requests`)
    } catch (err) {
      this.setState({
        errorMessage: err.message
      })
    }

    this.setState({
      isLoading: false
    })
  }

  render () {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
            <a>Back</a>
        </Link>
        <h3>Create A Request</h3>
        <Form
          onSubmit={this.handleSubmit}
          loading={this.state.isLoading}
          error={!!this.state.errorMessage}
        >
          <Form.Field>
            <label>Description</label>
            <Input
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              name="value"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient Address</label>
            <Input
              name="recipientAddress"
              value={this.state.recipientAddress}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Message
            error
            header={'Something went wrong!'}
            content={this.state.errorMessage}
          />
          <Button primary>
            Create Request
          </Button>
        </Form>
      </Layout>
    )
  }
}
