import 'babel-polyfill'
import 'whatwg-fetch'
import React from 'react'
import {render} from 'react-dom'
import Welcome from './welcome.jsx'
import Page from './page.jsx'
import App from './app.jsx'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

const router = <Router history={hashHistory}>
  <Route path='/' component={App}>
    <IndexRoute component={Welcome}/>
    <Route path="page/:domain" component={Page} />
  </Route>
</Router>

document.addEventListener('DOMContentLoaded', function () {
  render(router, document.getElementById('app'))
})
