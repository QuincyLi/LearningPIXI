var path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack'); // 新增

module.exports = {
  mode: 'development',
  entry: {
    'index': [
      './src/index.js'
    ]
  },
  output: {
    path: path.resolve('./dist/src'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  resolve: {
    alias: {
      root: path.resolve('./src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif)$/,
        loader: [{
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[hash:8].[ext]',
            // 字体的相对路径
            publicPath: '/'
          }
        }]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new CopyPlugin([
      { from: 'src/images', to: 'assets/images' },
    ]),
    new webpack.NamedModulesPlugin(), // 新增
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(), //新增
    new webpack.NoEmitOnErrorsPlugin()
  ]
};