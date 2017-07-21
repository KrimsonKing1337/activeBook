/**
 * Created by K on 11.06.2017.
 */
export class Volume {

    /**
     *
     * @param params {object}
     * @param params.global {number}
     * @param params.hints {number}
     * @param params.loops {number}
     */
    constructor (params = {}) {
        this.global = params.global;
        this.hints = params.hints;
        this.loops = params.loops;
    }

    /**
     *
     * @param value {number}
     */
    setGlobal (value) {
        this.global = value;
    }

    getGlobal () {
        return this.global;
    }

    /**
     *
     * @param value {number}
     */
    setHints (value) {
        this.hints = value;
    }

    getHints () {
        return this.hints;
    }

    /**
     *
     * @param value {number}
     */
    setLoops (value) {
        this.loops = value;
    }

    getLoops () {
        return this.loops;
    }
}

export class VolumeController {
    /**
     *
     * @param params {object}
     * @param params.Volume {object} instance of class Volume;
     * @param params.$audios {object} jquery
     * @param params.$videos {object} jquery
     * @param params.loops[] {object} Howler
     */
    constructor (params = {}) {
        this.Volume = params.Volume;
        this.$audios = params.$audios;
        this.$videos = params.$videos;
        this.loops = params.loops;
    }

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setGlobal (params = {}) {
        let self = this;
        let Volume = self.Volume;
        let loops = self.loops;
        let $audios = self.$audios;
        let $videos = self.$videos;
        let newVolume = params.volume;

        /**
         * обновляем значение в экземпляре класса Volume
         */
        Volume.setGlobal(newVolume);

        $audios.each(function () {
            this.volume = newVolume;
        });

        $videos.each(function () {
            this.volume = newVolume;
        });

        for (let loop in loops) {
            if (loops[loop] != '') {
                loops[loop].volume(newVolume);
            }
        }
    }
}

//todo: хранить volume во float
//todo: подсказки и фоновый звук по отдельности
//todo: если громкость === 1, баг, громкость устанавливается в 100