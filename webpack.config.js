/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const PUBLIC_PATH = path.resolve(__dirname, "public/");

module.exports = [
  {
    name: "main",
    entry: path.join(__dirname, "src", "index.tsx"),
    output: {
      path: path.join(PUBLIC_PATH, "dist/"),
      publicPath: "/vendor/",
      filename: "main.js"
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
    }
  },
  {
    name: "dev",
    mode: "development",
    devtool: "eval-source-map"
  },
  {
    name: "prod",
    mode: "production",
    output: {
      path: path.resolve(__dirname, "public/vendor")
    },
    devtool: false
  }
];
