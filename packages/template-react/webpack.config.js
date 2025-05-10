/** @format */

const path = require("path");
const fs = require("fs");
// const zlib = require("zlib");
// const zopfli = reuire("zopfli");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
const isDev = envs.includes("development");
const needReport = envs.includes("report");

const ROOT_PATH = path.resolve(__dirname, "./");
const SRC_PATH = path.resolve(ROOT_PATH, "src");
const DIST_PATH = path.resolve(ROOT_PATH, "build");
const STATIC_PATH = path.resolve(ROOT_PATH, "public");

module.exports = {
  ...(isDev
    ? {
        mode: "development",
        devtool: "source-map",
      }
    : {
        mode: "production",
      }),

  entry: {
    index: path.join(SRC_PATH, "index.tsx"),
  },

  output: {
    path: DIST_PATH,
    publicPath: process.env.PUBLIC_URL,
    filename: "[name].[fullhash:10].js",
    chunkFilename: "bundle-[name].[chunkhash:10].js",
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
                declaration: false,
              },
            },
          },
        ],
      },
      {
        test: /\.html?$/i,
        loader: "html-loader",
      },
      {
        test: /\.(sass|scss|less|css)$/,
        use: [
          {
            loader: isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/i,
        use: [
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 80 * 1024,
          },
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              disable: process.env.NODE_ENV === "development",
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.75, 0.9],
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.(mp3|mp4)(\?.*)?$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 80 * 1024,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: "asset",
        parser: {
          dataUrlCondtion: {
            maxSize: 80 * 1024,
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[fullhash:10].css",
    }),
    ...(() => {
      return isDev
        ? []
        : [
            new CompressionPlugin({
              algorithm: "gzip",
              filename: "[path][base].gz[query]",
              minRatio: 0.8,
              threshold: 10240,
              deleteOriginalAssets: false,
            }),
            new BrotliPlugin({
              asset: "[path].br[query]",
              minRatio: 0.7,
              threshold: 10240,
              deleteOriginalAssets: false,
              quality: 11,
            }),
          ];
    })(),
    ...(() => {
      return fs.existsSync(STATIC_PATH) &&
        fs.readdirSync(STATIC_PATH).length > 0
        ? [
            new CopyWebpackPlugin({
              patterns: [
                {
                  from: STATIC_PATH,
                  to: DIST_PATH,
                },
              ],
            }),
          ]
        : [];
    })(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(ROOT_PATH, "index.build.html"),
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
            reportFilename: "report.html",
          }),
        ]
      : []),
  ],
};
