const isMobile = require('./isMobileApp');
const platform = require('./getPlatform');

function getRootMobileApp() {
    if (!isMobile) return '';

    if (platform === 'android') return 'file:///android_asset/www';
    if (platform === 'ios') return 'file:///ios_asset/www';
}

module.exports = getRootMobileApp();