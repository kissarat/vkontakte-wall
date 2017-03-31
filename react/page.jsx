import React, {Component} from 'react'
import {Feed, Icon} from 'semantic-ui-react'
import {pick, merge, defaults, isEqual, uniq} from 'lodash'
import {Link} from 'react-router'

const infinite = false

function jsonp(method, params = {}) {
  params.callback = 'vk' + ++jsonp.number
  params.v = '5.8'
  const querystring = []
  for (const key in params) {
    querystring.push(key + '=' + params[key])
  }
  const script = document.createElement('script')
  script.src = 'https://api.vk.com/method/wall.get?' + querystring.join('&')
  document.head.appendChild(script)
  return new Promise(function (resolve) {
    window[params.callback] = function (data) {
      resolve(data)
      script.remove()
      delete window[params.callback]
    }
  })
}

jsonp.number = 0
window.members = {}

function assignMembers(posts, property) {
  const idProperty = property + '_id'
  const need = []
  posts.forEach(function (post) {
    const id = post[idProperty]
    const user = members[id]
    if (user) {
      post[property] = user
    }
    else {
      need.push(id)
    }
  })
  return need
}

function loadMembers(posts) {
  const need = assignMembers(posts)
  const promises = []
  if (need.length > 0) {
    const users_ids = uniq(need.filter(id => id > 0)).join(',')
    if (users_ids.length > 0) {
      promises.push(jsonp('users.get', {users_ids, fields: 'domain,online,photo_50,photo_100'}))
    }
    const group_ids = uniq(need.filter(id => id < 0).map(id => -id)).join(',')
    if (users_ids.length > 0) {
      promises.push(jsonp('groups.getById', {group_ids, fields: 'cover'}))
    }
  }
  return Promise.all(promises).then(function (rs) {
    rs.forEach(function ({response}) {
      response.forEach(function (member) {
        members['number' === typeof member.online ? member.id : -member.id] = member
      })
    })
    assignMembers(posts)
  })
}

const emptyPageState = {
  count: 0,
  posts: [],
  limit: 100,
  offset: 0
}

export default class App extends Component {
  state = emptyPageState

  componentDidMount() {
    void this.load(this.props.params)
  }

  componentWillReceiveProps(props) {
    if (!isEqual(this.props.params, props.params)) {
      void this.load(props.params)
    }
  }

  async load(params) {
    params.limit = this.state.limit
    const {response, count} = await jsonp('wall.get', params)
    if (response instanceof Array) {
      this.setState({
        count,
        posts: infinite ? this.state.posts.concat(response) : response,
      })
      await loadMembers(response)
      this.setState({membersLoaded: true})
    }
  }

  attachments(files) {
    if (files instanceof Array) {
      const list = []
      files.forEach(function ({type, photo, link}) {
        switch (type) {
          case 'photo':
            list.push(<a key={photo.pid} href={photo.src_xxbig} target="_blank">
              <img src={photo.src_small}/>
            </a>)
            break
          case 'link':
            list.push(<a
              key={link.url}
              href={link.url}
              title={link.description}
              target="_blank">
              <figure>
                <img src={link.image_src}/>
                <figcaption>{link.title}</figcaption>
              </figure>
            </a>)
            break
          default:
            // console.warn(`Unknown attachment type "${type}"`, arguments[0])
            break
        }
      })
      return list
    }
  }

  posts() {
    return this.state.posts.map(post => <Feed.Event key={post.id}>
      <Feed.Label/>
      <Feed.Content>
        <Feed.Summary>
          <Feed.Date>{new Date(post.date * 1000).toLocaleString()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra>
          <div dangerouslySetInnerHTML={{__html: post.text}}/>
          <div className="attachments">
            {this.attachments(post.attachments)}
          </div>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>)
  }

  paginator() {
    const navigation = []
    const {offset, domain, limit} = this.props.params
    const {count} = this.state
    const left = +offset - limit
    const right = +offset + limit
    if (infinite && right < count) {
      navigation.push(<Icon
        key="more"
        name="arrow circle down"
        size="huge"
        onClick={() => this.load(merge(this.props.params, {offset: right}))}/>)
    }
    else {
      const leftIcon = <Icon name="arrow circle left" size="big"/>
      if (offset > 0) {
        navigation.push(<Link key="left" to={`/page/${domain}/${left}`}>{leftIcon}</Link>)
      }
      else {
        navigation.push(leftIcon)
      }
      if (count > 0) {
        const number = 1 + Math.floor(offset / limit)
        const size = 1 + Math.floor(count / limit)
        navigation.push(<span key="number" className="number">{number} из {size}</span>)
      }
      if (right < count) {
        navigation.push(<Link key="right" to={`/page/${domain}/${right}`}>
          <Icon name="arrow circle right" size="big"/>
        </Link>)
      }
    }
    return <div className="paginator">{navigation}</div>
  }

  render() {
    return <Feed className="page">
      <div className="post-list">
        {this.posts()}
      </div>
      {this.paginator()}
    </Feed>
  }
}
