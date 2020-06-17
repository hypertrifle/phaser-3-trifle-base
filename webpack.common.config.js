"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const phaserModule = path.join(__dirname, "/node_modules/phaser/");
const phaser = path.join(phaserModule, "src/phaser.js");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const pkg = require("./package.json");

module.exports = {
  // mode: 'production',
  entry: ["@babel/polyfill", "./src/typescript/client/index.ts"],
  devtool: "source-map",

  optimization:
    process.env.NODE_ENV !== "production"
      ? {
          minimizer: [
            new TerserPlugin({
              extractComments: true,
              sourceMap: true,
              terserOptions: {
                compress: {
                  booleans_as_integers: true,
                },
              },
            }),
          ],
        }
      : {},

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "",
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
  },

  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      phaser: phaser,
    },
  },

  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ["raw-loader", "glslify-loader"],
      },
      {
        test: /\.ts?$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml|aac|mp3|wav|ogg|m4a|ttf|woff2|woff|otf|mp4|webm)$/i,
        use: "file-loader",
      },
      {
        test: /\.json$/,
        loader: "file-loader",
        type: "javascript/auto",
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "typeof CANVAS_RENDERER": JSON.stringify(true),
      "typeof WEBGL_RENDERER": JSON.stringify(true),
      "typeof EXPERIMENTAL": JSON.stringify(false),
      "typeof PLUGIN_CAMERA3D": JSON.stringify(false),
      "typeof PLUGIN_FBINSTANT": JSON.stringify(false),
      "typeof DEBUG": JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: "src/html/index.ejs",
      filename: "./index.html",
    }),
    new HtmlWebpackPlugin({
      template: "src/html/manifest.ejs",
      filename: "./manifest.json",
      inject: false,
      organisation: pkg.organisation, //"sponge",
      pkgname: pkg.package, //"com.wearesponge.testpackage",
      title: pkg.title, // "Phaser 3 Compatability Test",
    }),
  ],
};
