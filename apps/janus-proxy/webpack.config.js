const { WebpackPnpExternals } = require('webpack-pnp-externals');

module.exports = function(options) {
  return {
    ...options,
    externals: [
      WebpackPnpExternals(),
    ],
  };
};
