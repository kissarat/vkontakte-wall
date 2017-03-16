module.exports = {
  entry: __dirname + '/entry.jsx',
  devtool: 'source-map',
  output: {
    path: __dirname + '/../public',
    filename: 'gay.js',
    comments: false
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
        loader: 'babel',
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
  resolve: {
    modulesDirectories: [__dirname + '/../node_modules']
  },
  plugins: []
}