import {getIsMobile} from './getIsMobile';

export function getRootApp() {
    return getIsMobile() ? `${cordova.file.applicationDirectory}www` : '';
}