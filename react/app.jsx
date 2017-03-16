import React, {Component} from 'react'
import {Segment, Menu} from 'semantic-ui-react'
import {Link} from 'react-router'
// import {map} from 'lodash'

export default class App extends Component {
  state = {
    decaying_europe: 'Загнивающий Запад',
    tnull: '/dev/null',
    sysodmins: 'Типичный Сисадмин',
    unian: 'УНІАН',
  }

  items() {
    const items = []
    for(const id in this.state) {
      const name = this.state[id]
      items.push(<Menu.Item
        as={Link}
        name={name}
        key={id}
        to={'/page/' + id}/>)
    }
    return items
  }

  render() {
    return <div className="app">
      <Menu attached="top">
        {this.items()}
      </Menu>
      <Segment attached="bottom">
        {this.props.children}
      </Segment>
    </div>
  }
}
