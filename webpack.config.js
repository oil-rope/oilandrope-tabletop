/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    name: "main",
    entry: path.join(__dirname, "src", "index.tsx"),
    output: {
      path: path.resolve(__dirname, "dist")
    },
    module: {
      rules: [
        {
          test: /\.tsx$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          use: "babel-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "index.html")
      })
    ]
  },
  {
    name: "dev",
    mode: "development",
    devtool: "eval-source-map"
  },
  {
    name: "prod",
    mode: "production",
    devtool: false
  }
];
