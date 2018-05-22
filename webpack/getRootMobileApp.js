const isMobile = require('./isMobileApp');
const platform = require('./getPlatform');

function getRootMobileApp() {
    if (!isMobile) return '';

    if (platform === 'android') return 'file:///android_asset/www';
    if (platform === 'ios') return 'activeBook.app';
}

module.exports = getRootMobileApp();