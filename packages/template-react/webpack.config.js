/** @format */

const path = require("path");
const fs = require("fs");
// const zlib = require("zlib");
// const zopfli = reuire("zopfli");
// const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { program } = require("commander");

const options = program
  .option("-w", "webpack watch options.")
  .option("--progress")
  .option("--config <config>", "webpack config file.")
  .option("--env <env>", "environment variables, splited with a comma(,).")
  .parse(process.argv)
  .opts();
const envs = (options.env && options.env.split(",")) || [];
const needReport = envs.includes("report");

const ROOT_PATH = path.resolve(__dirname, "./");
const SRC_PATH = path.resolve(ROOT_PATH, "src");
const DIST_PATH = path.resolve(ROOT_PATH, "build");

module.exports = {
  // mode: "development",
  // devtool: "source-map",
  mode: "production",

  entry: {
    index: path.join(SRC_PATH, "index.tsx"),
  },

  output: {
    path: DIST_PATH,
    filename: "[name].[hash:10].js",
  },

  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    alias: {
      "@": SRC_PATH,
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: true,
                declarationMap: true,
                rootDir: SRC_PATH,
                declarationDir: DIST_PATH,
                outDir: DIST_PATH,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // 将 JS 字符串生成为 style 节点
          "css-loader", // 将 CSS 转化成 CommonJS 模块
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader", // 将 JS 字符串生成为 style 节点
          "css-loader", // 将 CSS 转化成 CommonJS 模块
          "less-loader", // 将 LESS 编译为 CSS
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(ROOT_PATH, "index.html"),
      inject: true,
    }),
    // 将 process.env 中所有环境变量迁移进来
    new webpack.DefinePlugin(
      Object.keys(process.env).reduce((env, key) => {
        const value = JSON.stringify(process.env[key]);
        console.log(`process.env.${key} = ${value}`);
        env[`process.env.${key}`] = value;
        return env;
      }, {})
    ),
    ...(needReport
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "report.esm.html",
          }),
        ]
      : []),
  ],
};
