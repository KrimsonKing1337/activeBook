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
     * @param params.page {number};
     * @param params.fontSize {number};
     * @param params.lineHeight {number};
     * @param params.scrollTop {number};
     * @param params.theme {string};
     * @param params.vibro {bool};
     */
    static saveState(params = {}) {
        let states = {
            volume: params.volume,
            page: params.page,
            fontSize: params.fontSize,
            scrollTop: params.scrollTop,
            theme: params.theme,
            vibro: params.vibro
        };

        localStorage.setItem('activeBook', JSON.stringify(states)); //сериализуем объект в строку
    }

    static loadState(params = {}) {
        //загружаем настройки из LocalStorage
        if (!localStorage.getItem('activeBook')) return false;

        return JSON.parse(localStorage.getItem('activeBook')); //получаем значение и десериализируем его в объект
    }
};