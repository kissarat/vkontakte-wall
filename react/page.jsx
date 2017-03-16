import React, {Component} from 'react'
import {List, Icon} from 'semantic-ui-react'
import {pick, merge, defaults, isEqual} from 'lodash'
import {Link} from 'react-router'

const infinite = false

function jsonp(method, params = {}, callback) {
  params.callback = 'jsonp' + Date.now()
  const querystring = []
  for (const key in params) {
    querystring.push(key + '=' + params[key])
  }
  const script = document.createElement('script')
  script.src = 'https://api.vk.com/method/wall.get?' + querystring.join('&')
  document.head.appendChild(script)
  window[params.callback] = function () {
    callback.apply(this, arguments)
    script.remove()
  }
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

  load(params) {
    params.limit = this.state.limit
    jsonp('wall.get', params, ({response}) => {
      if (response instanceof Array) {
        const posts = response.slice(1)
        this.setState({
          count: response[0],
          posts: infinite ? this.state.posts.concat(posts) : posts,
        })
      }
    })
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
    return this.state.posts.map(post => <List.Item key={post.id}>
      <List.Content>
        <div>
          <div dangerouslySetInnerHTML={{__html: post.text}}/>
          {this.attachments(post.attachments)}
        </div>
      </List.Content>
    </List.Item>)
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
    return <List className="page">
      <div className="post-list">
        {this.posts()}
      </div>
      {this.paginator()}
    </List>
  }
}
