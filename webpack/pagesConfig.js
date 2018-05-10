const fs = require('fs');

const rootPath = require('./rootPath');

/**
 *
 * @type {string}
 */
const pagesConfig = fs.readFileSync(`${rootPath}/src/pages/pages.json`, 'utf-8');

module.exports = JSON.parse(pagesConfig).pagesInfo;

