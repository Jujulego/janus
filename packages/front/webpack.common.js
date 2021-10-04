const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
  entry: {
    main: './app/index'
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve('dist/app'),
    clean: true,
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve('public/index.html'),
      filename: 'index.html',
    }),
  ],
};