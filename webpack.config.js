const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const binConfig = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/cli.js'),
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli2compose.bin.js'
  },
  plugins: [
      new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ]
};

const nodeConfig = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli2compose.node.js',
    libraryTarget: 'commonjs2',
  }
};

const browserConfig = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/browser.js'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli2compose.browser.js'
  }
};

module.exports = [ nodeConfig, browserConfig, binConfig ];