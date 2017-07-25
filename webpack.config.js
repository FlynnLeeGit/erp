const path = require('path')
const webpack = require('webpack')
const API_SERVER = require('./config').API_SERVER
const HtmlWeppackPlugin = require('html-webpack-plugin')
const AutoWebpackPlugin = require('autodll-webpack-plugin')
const pkg = require('./package.json')

console.log('API_SERVER', API_SERVER)
const isProd = process.env.NODE_ENV === 'production'

const config = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'build.[hash:5].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash:5]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',

      '@': path.resolve('src')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      '/_api': {
        target: API_SERVER,
        secure: false,
        changeOrigin: true
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new HtmlWeppackPlugin({
      inject: true,
      template: 'template/index.html'
    })
    // new AutoWebpackPlugin({
    //   debug: true,
    //   inject: true,
    //   context: __dirname,
    //   filename: '[name]_[hash:5].js',
    //   entry: {
    //     vender: Object.keys(pkg.dependencies)
    //   }
    // })
  ]
}

if (isProd) {
  config.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

module.exports = config
