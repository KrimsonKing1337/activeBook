import LocalStorage from './modules/LocalStorage';

export function firstOpenCheck() {
    if (LocalStorage.read({key: 'wasOpened'}) === null) {
        Object.keys(localStorage).forEach((key) => {
            LocalStorage.remove({key});
        });

        LocalStorage.write({key: 'wasOpened', val: true});
    }
}