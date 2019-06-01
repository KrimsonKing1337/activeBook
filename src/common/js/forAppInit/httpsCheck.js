export function httpsCheck() {
  if (ENV === 'development') return true;

  if (window.location.protocol !== 'https:') {
    window.location.protocol = 'https:';

    return false;
  }

  return true;
}
