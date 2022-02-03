// noinspection JSUnusedGlobalSymbols
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BASE_PATH = path.resolve(__dirname, '../');
const PUBLIC_PATH = path.join(BASE_PATH, 'public/');
const SOURCE_PATH = path.join(BASE_PATH, 'src/');

const HtmlWebpackPluginConf = new HtmlWebpackPlugin({
  template: path.join(PUBLIC_PATH, 'index.html'),
  title: 'Oil &amp; Rope Tabletop',
});

module.exports = {
  entry: {
    oar_tabletop: path.join(SOURCE_PATH, 'index.tsx'),
  },
  output: {
    path: path.join(PUBLIC_PATH, 'vendor/'),
    clean: true,
    filename: '[name].[contenthash].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  performance: {
    assetFilter: function (assetFilename) {
      return !/\.(map)$/.test(assetFilename);
    },
    hints: 'error',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': SOURCE_PATH,
      '@Components': path.join(SOURCE_PATH, 'components/'),
    },
  },
  plugins: [HtmlWebpackPluginConf],
};
