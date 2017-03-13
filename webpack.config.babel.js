import path              from 'path';
import webpack           from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer      from 'autoprefixer';
import * as parts        from './webpack.parts.js';
import yargs             from 'yargs';
import WebpackShellPlugin from 'webpack-shell-plugin';

const __dirname = path.resolve(); // builtin node.js variable

const PATH = {
  app: path.join(__dirname,     'client/app'),
  assets: path.join(__dirname,  'client/assets'),
  build: path.join(__dirname,   'dist/public'),
  uploads: path.join(__dirname, 'uploads'),
  server: path.join(__dirname, 'server'),
  build_server: path.join(__dirname, 'dist/server'),
  root: __dirname,
  dist: path.join(__dirname, 'dist')
};

const VERSION = new Date().toISOString();

/**
 * Env
 * identify the environment: webpack --env=dev -> dev
 */
const { ENV } = yargs.alias('env', 'ENV').argv;

var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

export default {
  entry: [ path.join(PATH.app, 'app.js') ],
  output: {
    path: PATH.build,
    // Output path from the view of the page
    publicPath: isProd ? '/' : 'http://localhost:9000/',
    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.less$/,
        // use: "style!css!less"
        use: ExtractTextPlugin.extract({ fallback: "style-loader",
                                         use: "css-loader!less-loader"}) //"css-loader?minimize!less-loader"
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: "style-loader",
                                         use: "css-loader"}) // "css-loader?minimize"
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader?name=../bower_components/bootstrap/fonts/[name].[ext]'
      },
      {
        test: /\.(png|jpg)$/,
        use: 'file-loader?name=[path][name].[ext]'
      },
      {
        // HTML LOADER
        // Reference: https://github.com/webpack/raw-loader
        // Allow loading html through js
        test: /\.html$/,
        use: 'html-loader?exportAsEs6Default'
      }
    ],
  },
  plugins: [
   new WebpackShellPlugin({ safe: true,
     onBuildStart:[ 'pwd; mkdir -p ' + PATH.build + '; echo "{version: \\"`git rev-list HEAD -1`\\", \\n builddate:  \\"'+ VERSION + '\\"}" > ' + path.join(PATH.build, '..', 'version.txt') ]
   }),
   new ExtractTextPlugin( "bundle.css" ),
   new CopyWebpackPlugin([
     {from: path.join(PATH.app, 'index.html'), to: PATH.build }
   ]), // index.html, the app entry point
   new CopyWebpackPlugin([
     {from: path.join(PATH.root, 'package.json'), to: PATH.dist }
   ]), // package.json file to the dist directory
   new CopyWebpackPlugin([
     {from: PATH.server, to: PATH.build_server }
   ]) // the whole server side
  ]

};
