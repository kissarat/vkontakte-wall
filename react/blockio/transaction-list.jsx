import React, {Component} from 'react'
import Refresh from '../refresh.jsx'
import {jsonp} from '../utils.jsx'
import {pick} from 'lodash'
import {Table, Segment} from 'semantic-ui-react'

function blockio(method, params = {}) {
  return jsonp(`https://www.block.io/api/v2/${method}/`, params)
}

export default class TransactionList extends Component {
  state = {transactions: []}

  componentWillMount() {
    void this.load(this.props.params)
  }

  async load(params) {
    const r = await blockio('get_transactions', pick(params, 'api_key', 'type'))
    if (r.data && r.data.txs instanceof Array) {
      this.setState({
        transactions: r.data.txs
          .sort((a, b) => b.time - a.time)
          .map(function (t) {
            return {
              txid: t.txid,
              green: t.from_green_address,
              time: new Date(t.time * 1000),
              confirmations: t.confirmations,
              receiver: t.amounts_received[0].recipient,
              amount: +t.amounts_received[0].amount,
              sender: t.senders[0],
            }
          })
      })
    }
  }

  rows() {
    return this.state.transactions.map(t => <Table.Row
      key={t.txid}
      positive={t.confirmations >= 3}
      negative={t.confirmations <= 0}>
      <Table.Cell>{t.time.toLocaleString()}</Table.Cell>
      <Table.Cell>{t.amount}</Table.Cell>
      <Table.Cell className="monospace">{t.sender}</Table.Cell>
      <Table.Cell>{t.confirmations}</Table.Cell>
      <Table.Cell className="monospace">{t.receiver}</Table.Cell>
      <Table.Cell className="monospace">
        <a href={'https://chain.so/tx/BTC/' + t.txid}>{t.txid}</a>
      </Table.Cell>
    </Table.Row>)
  }

  render() {
    return <Segment className="page transaction-list">
      <Refresh refresh={() => this.load(this.props.params)}/>
      <h1>Транзакции</h1>
      <Table selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Время</Table.HeaderCell>
            <Table.HeaderCell>Сумма</Table.HeaderCell>
            <Table.HeaderCell>Отправитель</Table.HeaderCell>
            <Table.HeaderCell>Подтверждений</Table.HeaderCell>
            <Table.HeaderCell>Получатель</Table.HeaderCell>
            <Table.HeaderCell>Транзакция</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.rows()}</Table.Body>
      </Table>
    </Segment>
  }
}
