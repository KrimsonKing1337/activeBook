import LocalStorage from './LocalStorage';

export function firstOpenCheck() {
    if (LocalStorage.read({key: 'wasOpened'}) === null) {
        LocalStorage.removeAll();

        LocalStorage.write({key: 'wasOpened', val: true});
    }
}