export function jsonp(url, params) {
  params.callback = '_' + ++jsonp.i
  const querystring = []
  for (const key in params) {
    querystring.push(key + '=' + params[key])
  }
  const script = document.createElement('script')
  script.src = url + '?' + querystring.join('&')
  document.head.appendChild(script)
  return new Promise(function (resolve) {
    window[params.callback] = function (r) {
      resolve(r)
      script.remove()
      window[params.callback] = null
    }
  })
}

jsonp.i = 0
