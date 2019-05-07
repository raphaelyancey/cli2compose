const path = require('path');
const webpack = require('webpack');

const baseConfig = {
  entry: path.resolve(__dirname, 'src/index.js')
};

const binConfig = Object.assign({
  entry: path.resolve(__dirname, 'src/cli.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli2compose.bin.js'
  },
  plugins: [
      new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ]
});

const serverConfig = Object.assign({
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli2compose.node.js'
  }
}, baseConfig);

const clientConfig = Object.assign({
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cli2compose.js'
  }
}, baseConfig);

module.exports = [ serverConfig, clientConfig, binConfig ];