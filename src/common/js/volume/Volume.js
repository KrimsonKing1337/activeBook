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
     * @param volumeInst {object} instance of class Volume;
     * @param $videos {object} jquery
     * @param oneShots[] {object} Howler
     * @param loops[] {object} Howler
     */
    constructor({volumeInst, $videos, oneShots, loops} = {}) {
        this.volumeInst = volumeInst;
        this.$videos = $videos;
        this.oneShots = oneShots;
        this.loops = loops;
    }

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setGlobal(params = {}) {
        const Volume = this.volumeInst;
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
        const Volume = this.volumeInst;
        const $videos = this.$videos;
        const oneShots = this.oneShots;
        const newVolume = params.volume * this.volumeInst.global;

        /**
         * обновляем значение громкости подсказок в экземпляре класса Volume
         */
        Volume.setOneShots(newVolume);

        Object.keys(oneShots).forEach((key) => {
            oneShots[key].volume(newVolume);
        });

        $videos.each(function () {
            this.volumeInst = newVolume;
        });
    }

    /**
     *
     * @param params {object}
     * @param params.volume {number}
     */
    setLoops(params = {}) {
        const Volume = this.volumeInst;
        const loops = this.loops;
        const newVolume = params.volume * this.volumeInst.global;

        /**
         * обновляем значение громкости фоновых звуков в экземпляре класса Volume
         */
        Volume.setLoops(newVolume);

        Object.keys(loops).forEach((key) => {
            loops[key].volume(newVolume);
        });
    }
}