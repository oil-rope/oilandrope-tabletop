/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const BASE_PATH = path.resolve(__dirname, '../../');
const SOURCE_PATH = path.join(BASE_PATH, 'src/');
const PUBLIC_PATH = path.join(BASE_PATH, 'public/');
const DOTENV_PATH = path.join(BASE_PATH, '.env');

// We check if the file exists in order to load environment variables
if (fs.existsSync(DOTENV_PATH)) {
  require('dotenv').config({
    path: path.join(BASE_PATH, '.env'),
  });
} else {
  console.warn(`File '.env' not found (${DOTENV_PATH})`);
}

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

/** @type { import('webpack-cli').WebpackDevServerOptions } */
const webpackConf = {
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: {
    oar_tabletop: path.join(SOURCE_PATH, 'index.tsx'),
  },
  // https://webpack.js.org/configuration/output/
  output: {
    chunkFilename: '[id].js',
    clean: true,
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(BASE_PATH, 'dist'),
  },
  mode: process.env.NODE_ENV || 'production',
  // https://webpack.js.org/configuration/plugins/
  plugins: [
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      favicon: path.join(PUBLIC_PATH, 'favicon.ico'),
      publicPath: '/',
      title: 'Oil &amp; Rope: Tabletop',
      template: path.join(PUBLIC_PATH, 'index.html'),
    }),
    new webpack.EnvironmentPlugin({
      API_URL: 'https://oilandrope-project.com',
      WS_URL: 'wss://live.oilandrope-project.com',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // NOTE: Exclude, source-map and others are tackled by `webpack.tsconfig.json`
        use: 'ts-loader?configFile=tsconfig.webpack.json',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': SOURCE_PATH,
      '@Components': path.join(SOURCE_PATH, 'components/'),
      '@Constants': path.join(SOURCE_PATH, 'const/globalConst'),
      '@Contexts': path.join(SOURCE_PATH, 'contexts'),
      '@Utils': path.join(SOURCE_PATH, 'utils/'),
      '@Interfaces': path.join(SOURCE_PATH, 'interfaces'),
    },
  },
  performance: {
    hints: 'error',
  },
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    webpackConf.devtool = 'eval-source-map';
    webpackConf.output.filename = '[name].js';
    webpackConf.output.chunkFilename = '[name].js';
    webpackConf.performance.hints = false;
    webpackConf.devServer = {
      client: {
        overlay: true,
      },
      historyApiFallback: true,
      host: '127.0.0.1',
      open: true,
      port: 8080,
      proxy: {
        '/oarapi': {
          target: process.env.API_URL || 'http://127.0.0.1:8000',
          pathRewrite: { '^/oarapi': '/api' },
        },
      },
      static: {
        directory: PUBLIC_PATH,
        publicPath: PUBLIC_PATH,
      },
    };
  }
  return webpackConf;
};
