import React from 'react'
import {
  Container
} from 'semantic-ui-react'
import Menu from './Menu'

export default (props) => (
  <Container>
    <Menu />
    {props.children}
  </Container>
)
