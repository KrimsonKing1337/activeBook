export function isMobileInit() {
    const isMobile = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    const rootApp = isMobile ? `${cordova.file.applicationDirectory}www` : '';

    return {
        isMobile,
        rootApp
    }
}