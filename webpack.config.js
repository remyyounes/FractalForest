import path from 'path';

module.exports = {
  entry: {
    app: ['./app/index.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
};
