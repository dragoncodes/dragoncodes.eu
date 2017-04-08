var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DEBUG = process.env.NODE_ENV !== 'production';
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var combineLoaders = require('webpack-combine-loaders');
var ExtHtmlPlugin = require('script-ext-html-webpack-plugin');
var util = require('util');
var entry = {
    app: [ './app.js'/*, 'pug-html-loader!./index.pug'*/ ]
};

module.exports = {
    context: path.join(__dirname, 'app'),
    entry: entry,
    target: 'web',
    devtool: DEBUG ? 'inline-source-map' : false,
    output: {
        path: path.resolve(pkg.config.buildDir),
        publicPath: DEBUG ? "/" : "/",
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: {
            index: '/index.html'
        }
    },
    node: {
        fs: 'empty'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", query: { presets: [ 'es2015' ] } },
            { test: /\.pug$/, loader: "pug-html-loader" },
            { test: /\.html$/, exclude: /node_modules/, loader: "file-loader?name=[path][name].[ext]" },
            { test: /\.jpe?g$|\.svg$|\.png$/, exclude: /node_modules/, loader: "file-loader?name=[path][name].[ext]" },
            { test: /\.json$/, exclude: /node_modules/, loader: "json-loader" },
            { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
            { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ },

            {
                test: /\.css$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            },

            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [ 'es2015', 'react' ]
                }
            }
        ]
    },

    plugins: (DEBUG ? [] : [

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin()

    ]).concat( [

        new HtmlWebpackPlugin({
            template: './index.pug',
            hash: true
        }),

        new ExtractTextPlugin('main.css'),

        new ExtHtmlPlugin({
            defaultAttribute: 'async'
        }),

        new CopyWebpackPlugin([ { from: 'public', to: 'assets' } ])
    ])
};
