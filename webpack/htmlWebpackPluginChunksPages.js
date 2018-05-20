const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootPath = require('./rootPath');
const pagesConfig = require('./pagesConfig');

function newHtmlWebpackPlugin(context, template = `${rootPath}/src/elements/text.ejs`) {
    return new HtmlWebpackPlugin({
        context,
        template,
        filename: `${context}.html`,
        inject: false,
        svgoConfig: {
            cleanupIDs: true,
            removeTitle: false,
            removeAttrs: false,
            removeViewBox: true
        }
    });
}


const htmlWebpackPluginChunksPages = [];

for (let i = 0; i <= pagesConfig.length; i++) {
    const context = `page-${i}`;

    htmlWebpackPluginChunksPages.push(newHtmlWebpackPlugin(context));
}

/**
 * add credits page
 */
htmlWebpackPluginChunksPages.push(newHtmlWebpackPlugin('page-credits'));

module.exports = htmlWebpackPluginChunksPages;