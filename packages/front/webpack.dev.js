const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 4000,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:5000',
      }
    }
  }
});