const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    name: "main",
    entry: path.join(__dirname, "src", "index.js"),
    output: {
      path: path.resolve(__dirname, "dist")
    },
    module: {
      rules: [
        {
          test: [/\.m?js$/, /\.m?jsx$/],
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx"]
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
