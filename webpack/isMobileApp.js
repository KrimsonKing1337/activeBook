function isMobileApp() {
    return process.env.mobile === 'true';
}

module.exports = isMobileApp();