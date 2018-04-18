import LocalStorage from './modules/LocalStorage';

export function firstOpenCheck() {
    if (LocalStorage.read({key: 'wasOpened'}) === false) {
        LocalStorage.remove({key: 'activeBook'});
        LocalStorage.remove({key: 'lastOpenedPage'});
        LocalStorage.write({key: 'wasOpened', val: true});
    }
}