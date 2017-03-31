import React, {Component} from 'react'
import {Icon} from 'semantic-ui-react'

export default class Refresh extends Component {
  state = {}

  componentWillMount() {
    addEventListener('keyup', this.refresh)
  }

  componentWillUnmount() {
    removeEventListener('keyup', this.refresh)
  }

  refresh = async e => {
    if ('keyup' !== e.type || 'Backquote' === e.code) {
      this.setState({busy: true})
      await this.props.refresh()
      this.setState({busy: false})
    }
  }

  render() {
    return <Icon
      size="big"
      name="refresh"
      loading={this.state.busy}
      onClick={this.refresh}/>
  }
}
