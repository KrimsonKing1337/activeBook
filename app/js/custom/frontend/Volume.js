/**
 * Created by K on 11.06.2017.
 */
export default class Volume {

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     * @param params.$audios {object} jquery
     * @param params.$videos {object} jquery
     * @param params.loops[] {object} Howler
     */
    constructor (params = {}) {
        this.volume = params.volume;
        this.$audios = params.$audios;
        this.$videos = params.$videos;
        this.loops = params.loops;
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

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setGlobal (params = {}) {
        let self = this;
        let loops = self.loops;
        let newVolume = Volume._toInt({volume: params.volume});

        self.volume = newVolume;

        self.$audios.each(function () {
           this.volume = newVolume / 100;
        });

        self.$videos.each(function () {
            this.volume = newVolume / 100;
        });

        for (let loop in loops) {
            if (loops[loop] != '') {
                loops[loop].volume(newVolume / 100);
            }
        }
    }

    //todo: хранить volume во float
    //todo: подсказки и фоновый звук по отдельности
    //todo: если громкость === 1, баг, громкость устанавливается в 100

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     * @private
     */
    static _toInt (params = {}) {
        let volume = params.volume;

        if (volume % 1 !== 0) {
            volume = volume * 100;
        }

        if (volume === 1) {
            volume = 100;
        }

        return volume;
    }
}