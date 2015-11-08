const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './app/index.js',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: [/\.js$/, /\.jsx$/],
        loaders: [ 'babel' ],
        exclude: /node_modules/,
      },
    ],
  },

};
