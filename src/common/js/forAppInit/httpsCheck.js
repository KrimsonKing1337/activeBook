import {getIsMobile} from '../helpers/getIsMobile.js';

export function httpsCheck() {
  if (ENV === 'development' || getIsMobile()) return true;

  if (window.location.protocol !== 'https:') {
    window.location.protocol = 'https:';

    return false;
  }

  return true;
}
