module.exports = sassToCss = () => {
    let appRoot = require('app-root-path');
    let SassToCss = require('./SassToCss');

    let cssDir = appRoot + '/styles/css/';

    SassToCss.render(cssDir);
};