const webpack = require("webpack");
const { CheckerPlugin } = require("awesome-typescript-loader");
const { join } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");

const DEV_MODE = process.env.NODE_ENV === "development";

module.exports = {
  devtool: DEV_MODE ? "eval" : "source-map",
  entry: {
    main: ["./src/index.ts"]
  },
  output: {
    path: join(__dirname, "public"),
    filename: "[name]-[hash:8].js",
    chunkFilename: "[name]-[chunkhash:8].js",
    publicPath: "/"
  },
  resolve: {
    modules: [join(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".js", ".json"]
  },
  devServer: {
    contentBase: join(__dirname, "public"),
    compress: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]__[local]--[hash:base64:5]",
              sourceMap: true,
              importLoaders: 1
            }
          },
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin("NODE_ENV"),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      title: "Gobang",
      filename: "index.html",
      template: "templates/index.html"
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
