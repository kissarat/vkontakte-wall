import 'babel-polyfill'
import 'whatwg-fetch'
import App from './app.jsx'
import Wall from './vkontakte/wall.jsx'
import React from 'react'
import TransactionList from './blockio/transaction-list.jsx'
import Welcome from './welcome.jsx'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

const router = <Router history={hashHistory}>
  <Route path='/' component={App}>
    <IndexRoute component={Welcome}/>
    <Route path="page/:domain/:offset" component={Wall} />
    <Route path="block.io/:api_key/transactions/:type" component={TransactionList} />
  </Route>
</Router>

document.addEventListener('DOMContentLoaded', function () {
  render(router, document.getElementById('app'))
})
