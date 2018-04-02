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
     * @param params.volume.hints {number};
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
     * @param params.vibration {bool};
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
            bookmarks: params.bookmarks
        };

        localStorage.setItem('activeBook', JSON.stringify(states)); //сериализуем объект в строку
    }

    /**
     *
     * @param params {object}
     * @param params.key {string}
     * @param params.val {string}
     */
    static write(params = {}) {
        const key = params.key;
        const val = params.val;

        localStorage.setItem(key, JSON.stringify(val)); //сериализуем объект в строку
    }

    /**
     *
     * @param params {object}
     * @param params.key {string}
     */
    static read(params = {}) {
        const key = params.key;

        if (!localStorage.getItem(key)) return false;

        return JSON.parse(localStorage.getItem(key)); //получаем значение и десериализируем его в объект
    }

    /**
     *
     * @param params {object}
     * получаем настройки из LocalStorage
     */
    static getState(params = {}) {
        //получаем настройки из LocalStorage
        if (!localStorage.getItem('activeBook')) return false;

        return JSON.parse(localStorage.getItem('activeBook')); //получаем значение и десериализируем его в объект
    }

    /**
     *
     * @param params
     */
    static beforeUnload(params = {}) {

    }
};