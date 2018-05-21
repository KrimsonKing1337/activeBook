function isMobile() {
    return process.env.mobile === 'true';
}

module.exports = isMobile;