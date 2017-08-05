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
     * @param params.page {number};
     * @param params.fontSize {number};
     * @param params.lineHeight {number};
     * @param params.scrollTop {number};
     * @param params.theme {string};
     * @param params.vibration {bool};
     */
    static saveState(params = {}) {
        let states = {
            volume: params.volume,
            volumeSlidersPosition: params.volumeSlidersPosition,
            page: params.page,
            fontSize: params.fontSize,
            lineHeight: params.lineHeight,
            scrollTop: params.scrollTop,
            theme: params.theme,
            vibration: params.vibration
        };

        localStorage.setItem('activeBook', JSON.stringify(states)); //сериализуем объект в строку
    }

    /**
     *
     * @param params
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
     * применяем настройки
     */
    static loadState(params = {}) {
        let sliders = {};
        let fontSize;
        let lineHeight;
        let theme;
        let vibro;

    }
};