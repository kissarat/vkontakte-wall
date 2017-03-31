module.exports = {
  entry: __dirname + '/entry.jsx',
  devtool: 'source-map',
  output: {
    path: __dirname + '/../public',
    filename: 'gay.js'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015',
            'react',
            'stage-1',
          ],
          plugins: [
            'transform-class-properties'
          ]
        }
      }
    ]
  },
  resolve: {},
  plugins: []
}