/**
 * Created by K on 11.06.2017.
 */
export class Volume {

    /**
     *
     * @param global {number}
     * @param oneShots {number}
     * @param loops {number}
     */
    constructor({global, oneShots, loops} = {}) {
        this.global = global;
        this.oneShots = oneShots;
        this.loops = loops;
    }

    /**
     *
     * @param value {number}
     */
    setGlobal(value) {
        this.global = value;
    }

    getGlobal() {
        return this.global;
    }

    /**
     *
     * @param value {number}
     */
    setOneShots(value) {
        this.oneShots = value;
    }

    getOneShots() {
        return this.oneShots;
    }

    /**
     *
     * @param value {number}
     */
    setLoops(value) {
        this.loops = value;
    }

    getLoops() {
        return this.loops;
    }
}

export class VolumeController {
    /**
     *
     * @param params {object}
     * @param params.Volume {object} instance of class Volume;
     * @param params.$videos {object} jquery
     * @param params.oneShots[] {object} Howler
     * @param params.loops[] {object} Howler
     */
    constructor(params = {}) {
        this.Volume = params.Volume;
        this.$videos = params.$videos;
        this.oneShots = params.oneShots;
        this.loops = params.loops;
    }

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setGlobal(params = {}) {
        const Volume = this.Volume;
        const newVolume = params.volume;

        /**
         * обновляем значение глобальной громкости в экземпляре класса Volume
         */
        Volume.setGlobal(newVolume);

        this.setOneShots({volume: newVolume});

        this.setLoops({volume: newVolume});
    }

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setOneShots(params = {}) {
        const Volume = this.Volume;
        const $videos = this.$videos;
        const oneShots = this.oneShots;
        const newVolume = params.volume * this.Volume.global;

        /**
         * обновляем значение громкости подсказок в экземпляре класса Volume
         */
        Volume.setOneShots(newVolume);

        Object.keys(oneShots).forEach((key) => {
            oneShots[key].volume(newVolume);
        });

        $videos.each(function () {
            this.volume = newVolume;
        });
    }

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setLoops(params = {}) {
        const Volume = this.Volume;
        const loops = this.loops;
        const newVolume = params.volume * this.Volume.global;

        /**
         * обновляем значение громкости фоновых звуков в экземпляре класса Volume
         */
        Volume.setLoops(newVolume);

        Object.keys(loops).forEach((key) => {
            loops[key].volume(newVolume);
        });
    }
}