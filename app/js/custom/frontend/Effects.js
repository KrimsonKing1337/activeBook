/**
 * Created by K on 11.06.2017.
 */

import Volume from './Volume';
let Howler = require('howler');

export class Effects {
    constructor () {

    }

    /**
     *
     * @param params {object}
     * @param params.target {object} jquery
     * @param params.effectParams {object}
     */
    static play (params = {}) {
        let target = params.target;
        let effectParams = params.effectParams;

        let type = target.data('effect-type');

        if (type === 'audio') {
            SoundEffects.play({target: target});
            //todo: video, text, etc.
        } else if (type === 'bg-music') {

        }
    }
}

class SoundEffects {
    /**
     *
     * @param params {object}
     * @param params.target {object} jquery
     */
    constructor (params = {}) {
        this.target = params.target;

    }

    static get sounds () {
        return $('audio');
    }

    /**
     * @param params {object}
     * @param params.target {object} jquery
     * @returns {string}
     */
    static getState (params = {}) {
        let target = params.target;

        if (target[0].duration > 0 && !target[0].paused) {
            return 'playing';
        } else {
            return 'paused';
        }
    }

    /**
     *
     * @param params
     * @param params.target {string}; sounds || bgSound || bgMusic || all;
     */
    static stop (params = {}) {
        let target = params.target;
        let volume = Volume.get();

        if (target === 'sounds') {
            let sounds = SoundEffects.sounds;

            sounds.each(function (index, item) {
                if (SoundEffects.getState({target: $(item)}) === 'playing') {
                    let el = this;

                    el.animate({volume: 0}, 0, function () {
                        el.pause();
                        el.currentTime = 0;
                        el.volume = volume;
                    });
                }
            });
            //todo: bgSound, bgMusic, all
        } else if (target === 'bgSound') {

        }
    }

    /**
     *
     * @param params
     * @param params.target {object} jquery
     */
    static play (params = {}) {
        let target = params.target;

        if (SoundEffects.getState({target: target}) === 'paused') {
            SoundEffects.stop({target: 'sounds'});
            target[0].play();
        }
    }

    /**
     *
     * @param params
     */
    static playLoop (params = {}) {

    }
}

class VideoEffects {
    constructor () {

    }
}

class TextEffects {
    constructor () {

    }
}