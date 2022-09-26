/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const BASE_PATH = path.resolve(__dirname, '../../');
const SOURCE_PATH = path.join(BASE_PATH, 'src/');

module.exports = {
  entry: {
    oilandrope_tabletop: path.join(SOURCE_PATH, 'index.tsx'),
  },
  devtool: 'inline-source-map',
  mode: 'development',
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
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
