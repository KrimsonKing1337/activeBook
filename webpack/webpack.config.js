const webpack = require('webpack');
const resolve = require('path').resolve;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const htmlWebpackPluginChunksPages = require('./htmlWebpackPluginChunksPages');
const isMobileApp = require('./isMobileApp');
const rootPath = require('./rootPath');
const rootMobileApp = require('./getRootMobileApp');
const buildDir = isMobileApp ? `${rootPath}/cordova/www` : `${rootPath}/build`;

const extractSass = new ExtractTextPlugin({
    filename: '[name].[hash].css',
    disable: process.env.NODE_ENV === 'development',
    //publicPath: '../build'
});

module.exports = {
    devtool: 'source-map',
    entry: {
        bundle: `${rootPath}/src/index.js`
    },
    output: {
        path: `${buildDir}/`,
        filename: '[name].[hash].js',
    },
    plugins: [
        new CleanWebpackPlugin(`${buildDir}/*`, {
            root: `${buildDir}/`,
            exclude: ['.gitkeep'],
        }),
        extractSass,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        ...htmlWebpackPluginChunksPages,
        new HtmlWebpackPlugin({
            template: `${rootPath}/src/index.ejs`,
            filename: 'index.html',
            inject: 'body',
            isMobileApp,
            rootMobileApp,
            svgoConfig: {
                cleanupIDs: true,
                removeTitle: false,
                removeAttrs: false,
                removeViewBox: true
            }
        }),
        new HtmlWebpackInlineSVGPlugin(),
        new CopyWebpackPlugin([
            {
                from: `${rootPath}/public/`,
                to: `${buildDir}/`
            }, {
                from: `${rootPath}/src/pages/**/*.json`,
                to: `${buildDir}/`,
                flatten: true
            }, {
                from: `${rootPath}/src/pages/pages.json`,
                to: `${buildDir}/`,
                flatten: true
            }
        ])
    ],
    context: rootPath,
    resolve: {
        extensions: ['.js', '.css', '.json', '.md'],
        modules: ['src', 'node_modules'],
        alias: {
            jQuery: 'jquery',
            'bowser': 'bowser/bowser.min.js'
        }
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: extractSass.extract({
                use: [{
                    loader: 'replace-string-loader',
                    options: {
                        search: /\/fonts\//g,
                        replace: `${rootMobileApp}/fonts/`
                    }
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        importLoaders: 0,
                        modules: false
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        plugins: [require('autoprefixer')()]
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        includePaths: [`${rootPath}/src`],
                        outputStyle: 'collapsed'
                    }
                }],
                fallback: 'style-loader'
            })
        }, {
            test: /\.css$/,
            use: 'css-loader?sourceMap=true',
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/',
                    //context: '../build/'
                }
            }
        }, {
            test: /\.ejs$/,
            use: ['ejs-loader']
        }]
    },
    devServer: {
        host: 'localhost',
        port: '3000',
        contentBase: resolve(__dirname, '../public'),
        publicPath: '/',
        historyApiFallback: {
            rewrites: [
                {from: /./, to: '/err-404.html'}
            ]
        },
        hot: true
    }
};