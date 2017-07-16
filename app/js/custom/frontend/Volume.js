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

    get global () {
        return this.volume;
    }

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setGlobal (params = {}) {
        let self = this;
        let loops = self.loops;
        let newVolume = params.volume;

        self.volume = newVolume;

        self.$audios.each(function () {
           this.volume = newVolume;
        });

        self.$videos.each(function () {
            this.volume = newVolume;
        });

        for (let loop in loops) {
            if (loops[loop] != '') {
                loops[loop].volume(newVolume);
            }
        }
    }

    //todo: хранить volume во float
    //todo: подсказки и фоновый звук по отдельности
    //todo: если громкость === 1, баг, громкость устанавливается в 100
}