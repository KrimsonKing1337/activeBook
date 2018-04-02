const webpack = require('webpack');
const resolve = require('path').resolve;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const pagesConfig = require('./pages.config');

const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: process.env.NODE_ENV === 'development'
});

const rootPath = resolve(__dirname, '../');

const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

const htmlWebpackPluginChunks = pagesConfig.map((obj) => {
    const {title, context, pageNumber, pagesLength} = obj;

    return new HtmlWebpackPlugin({
        title,
        context,
        pageNumber,
        pagesLength,
        template: `${rootPath}/src/htmlRoot.ejs`,
        filename: `${context}.html`,
        inject: 'body',
        rootPath,
        svgoConfig: {
            cleanupIDs: true,
            removeTitle: false,
            removeAttrs: false,
            removeViewBox: true
        }
    });
});

module.exports = {
    devtool: 'source-map',
    entry: {
        bundle: `${rootPath}/src/index.js`
    },
    output: {
        path: `${rootPath}/build/`,
        filename: '[name].js',
    },
    plugins: [
        new CleanWebpackPlugin(`${rootPath}/build/*`, {
            root: `${rootPath}/build/`,
            exclude: ['.gitkeep'],
        }),
        extractSass,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        ...htmlWebpackPluginChunks,
        new HtmlWebpackInlineSVGPlugin(),
        new CopyWebpackPlugin([{
            from: `${rootPath}/public/`,
            to: `${rootPath}/build/`
        }]),
        new OpenBrowserPlugin({
            url: 'http://localhost:3000/page-1.html'
        })
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
            use: 'file-loader?name=[name].[ext]&outputPath=./assets/'
        }, {
            test: /\.ejs$/,
            use: ['ejs-loader']
        }, {
            test: /\.(graphql|graphqls|graphqle|graphqld|gql)$/,
            use: ['graphql-tag/loader']
        }]
    },
    devServer: {
        //url: http://localhost:3000/page-1.html
        host: 'localhost',
        port: '3000',
        contentBase: resolve(__dirname, '../public'),
        publicPath: '/',
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/err-404.html' }
            ]
        },
        //hot: true
    }
};