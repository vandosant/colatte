import React, { Component } from 'react'
import {
  Button,
  Form,
  Input,
  Message
} from 'semantic-ui-react'
import { Router } from '../routes'
import getCampaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'

export default class ContributeForm extends Component {
  state = {
    isLoading: false,
    errorMessage: '',
    successMessage: '',
    value: ''
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({
      isLoading: true,
      errorMessage: '',
      successMessage: ''
    })

    try {
      const campaign = getCampaign(this.props.address)
      const accounts = await web3.eth.getAccounts()

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      })
      this.setState({
        successMessage: 'You are now authorized to approve spending requests for this campaign',
        value: ''
      })
      Router.replaceRoute(`/campaigns/${this.props.address}`)
    } catch (err) {
      this.setState({
        errorMessage: err.message
      })
    }

    this.setState({
      isLoading: false,
      value: ''
    })
  }

  render () {
    return (
      <Form
        onSubmit={this.handleSubmit}
        loading={this.state.isLoading}
        error={!!this.state.errorMessage}
        success={!!this.state.successMessage}
      >
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            onChange={this.handleChange}
            value={this.state.value}
            label='ether'
            labelPosition='right'
            placeholder='Amount to contribute'
          />
        </Form.Field>
        <Message
          error
          header='Something went wrong!'
          content={this.state.errorMessage}
          style={{
            overflowWrap: 'break-word'
          }}
        />
        <Message
          success
          header='Contribution received'
          content={this.state.successMessage}
        />
        <Button primary>
          Contribute
        </Button>
      </Form>
    )
  }
}
