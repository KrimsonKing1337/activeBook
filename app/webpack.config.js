const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    context: __dirname,
    devtool: "source-map",
    entry: {
        bundle: "./new_view/js/custom/js.js",
        styles: "./new_view/styles/css/css.scss"
    },
    output: {
        path: __dirname + "/new_view/dist",
        filename: "[name].js"
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }],
                // use style-loader in development
                fallback: "style-loader"
            })
        }]
    },
    plugins: [
        extractSass
    ]
};