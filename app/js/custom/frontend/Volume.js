/**
 * Created by K on 11.06.2017.
 */

export default class Volume {
    constructor () {

    }

    /**
     * @param params {object}
     * @param params.format {string}
     * @returns {number}
     */
    static getGlobal (params = {}) {
        let format = params.format;
        let volume = 75;

        if (format === 'int') {
            return volume;
        } else if (format === 'float') {
            return volume / 100;
        }
    }

    //todo: get подсказки, фоновый звук
}