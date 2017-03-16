import React, {Component} from 'react'
import {List} from 'semantic-ui-react'

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

export default class App extends Component {
  state = {
    count: 0,
    posts: []
  }

  componentDidMount() {
    void this.load(this.props.params)
  }

  componentWillReceiveProps(props) {
    if (this.props.params.domain != props.params.domain) {
      void this.load(props.params)
    }
  }

  load(params) {
    jsonp('wall.get', params, ({response}) => {
      if (response instanceof Array) {
        this.setState({
          count: response[0],
          posts: response.slice(1),
        })
      }
    })
  }

  attachments(photos) {
    if (photos instanceof Array) {
      const images = []
      photos.forEach(function ({type, photo}) {
        if ('photo' === type) {
          images.push(<a key={photo.pid} href={photo.src_xxbig} target="_blank">
            <img src={photo.src_small}/>
          </a>)
        }
      })
      return images
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

  render() {
    return <List className="page">
      {this.posts()}
    </List>
  }
}
