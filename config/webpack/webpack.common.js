/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin } = require('webpack');
require('dotenv').config();

const BASE_PATH = path.resolve(__dirname, '../../');
const SOURCE_PATH = path.join(BASE_PATH, 'src/');
const PUBLIC_PATH = path.join(BASE_PATH, 'public/');

const HtmlWebpackPluginConf = new HtmlWebpackPlugin({
  template: path.join(SOURCE_PATH, 'index.html'),
  title: 'Oil &amp; Rope Tabletop',
  filename: path.join(PUBLIC_PATH, 'index.html'),
});
const MiniCssExtractPluginConf = new MiniCssExtractPlugin({
  filename: 'css/oar_tabletop.css',
});
const EnvironmentPluginConf = new EnvironmentPlugin(['API_URL']);

module.exports = {
  entry: {
    oilandrope_tabletop: path.join(SOURCE_PATH, 'index.tsx'),
  },
  output: {
    path: path.join(PUBLIC_PATH, 'vendor/'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[contenthash:8].bundle.js',
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext][query]',
        },
      },
    ],
  },
  performance: {
    assetFilter: (assetFilename) =>
      !/\.(map|png|scss|css)$/.test(assetFilename),
    hints: 'error',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': SOURCE_PATH,
      '@Components': path.join(SOURCE_PATH, 'components/'),
      '@Constants': path.join(SOURCE_PATH, 'const/globalConst'),
      '@Contexts': path.join(SOURCE_PATH, 'contexts'),
      '@Utils': path.join(SOURCE_PATH, 'utils/'),
    },
  },
  plugins: [
    HtmlWebpackPluginConf,
    MiniCssExtractPluginConf,
    EnvironmentPluginConf,
  ],
};
