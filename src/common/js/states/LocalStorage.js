//сохраняем/загружаем состояния. не забываем, что всё хранится в строках
export default class LocalStorage {
    /**
     *
     * @param [params] {object};
     */
    constructor(params = {}) {

    }

    /**
     *
     * @param params {object};
     * @param params.volume {object};
     * @param params.volume.global {number};
     * @param params.volume.oneShots {number};
     * @param params.volume.loops {number};
     * @param params.volumeSlidersPosition {object};
     * @param params.volumeSlidersPosition.global {number};
     * @param params.volumeSlidersPosition.hints {number};
     * @param params.volumeSlidersPosition.bg {number};
     * @param params.currentPage {number};
     * @param params.fontSize {number};
     * @param params.lineHeight {number};
     * @param params.scrollTop {number};
     * @param params.theme {string};
     * @param params.vibration {boolean};
     * @param params.flashlight {boolean};
     * @param params.bookmarks[] {object};
     */
    static saveState(params = {}) {
        const states = {
            volume: params.volume,
            volumeSlidersPosition: params.volumeSlidersPosition,
            currentPage: params.currentPage,
            fontSize: params.fontSize,
            lineHeight: params.lineHeight,
            scrollTop: params.scrollTop,
            theme: params.theme,
            vibration: params.vibration,
            flashlight: params.flashlight,
            bookmarks: params.bookmarks
        };

        localStorage.setItem('activeBook', JSON.stringify(states)); //сериализуем объект в строку
    }

    /**
     *
     * получаем настройки из LocalStorage
     */
    static getStates() {
        return {
            volume: LocalStorage.read({key: 'volume'}),
            volumeSlidersPosition: LocalStorage.read({key: 'volumeSlidersPosition'}),
            currentPage: LocalStorage.read({key: 'currentPage'}),
            fontSize: LocalStorage.read({key: 'fontSize'}),
            lineHeight: LocalStorage.read({key: 'lineHeight'}),
            scrollTop: LocalStorage.read({key: 'scrollTop'}),
            theme: LocalStorage.read({key: 'theme'}),
            vibration: LocalStorage.read({key: 'vibration'}),
            flashlight: LocalStorage.read({key: 'flashlight'}),
            bookmarks: LocalStorage.read({key: 'bookmarks'}),
            modalObjectFit: LocalStorage.read({key: 'modalObjectFit'}),
            filterInvert: LocalStorage.read({key: 'filterInvert'})
        };
    }

    /**
     *
     * @param key {string}
     * @param val {*}
     */
    static write({key, val} = {}) {
        if (typeof val === 'undefined') return new Error('value for write is undefined!');

        localStorage.setItem(key, JSON.stringify(val)); //сериализуем объект в строку
    }

    /**
     *
     * @param key {string}
     */
    static read({key} = {}) {
        if (!localStorage.getItem(key)) return null;

        return JSON.parse(localStorage.getItem(key)); //получаем значение и десериализируем его в объект
    }

    /**
     *
     * @param key {string}
     */
    static remove({key} = {}) {
        localStorage.removeItem(key);
    }

    static removeAll() {
        Object.keys(localStorage).forEach((key) => {
            LocalStorage.remove({key});
        });
    }
};