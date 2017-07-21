/**
 * Created by K on 11.06.2017.
 */

import Volume from './Volume';
import ConstsDOM from './ConstsDOM';
let Howler = require('howler');

export class Effects {
    /**
     *
     * @param Volume {object}; inst Volume Class
     */
    constructor (Volume) {
        this.soundEffects = new SoundEffects();
        this.globalVolume = Volume.global;
        this.hintsVolume = Volume.hints;
        this.loopsVolume = Volume.loops;
    }

    /**
     *
     * @param params {object}
     * @param params.target {object} jquery
     * @param params.effectParams {object}
     */
    play (params = {}) {
        let self = this;
        let soundEffects = self.soundEffects;
        let volume = self.volume;

        let target = params.target;
        let effectParams = params.effectParams;

        let type = target.data('effect-type');

        if (type === 'audio') {
            SoundEffects.play({target: target});
            //todo: video, text, etc.
        } else if (type === 'bg-music') {
            soundEffects.playLoop({target: target});
        } else if (type === 'bg-sound') {
            soundEffects.playLoop({target: target});
        } else if (type === 'image-left-side') {
            ImageEffects.setLeftSide({target: target});
        }
    }
}

class SoundEffects {
    /**
     *
     * @param [params] {object}
     */
    constructor (params = {}) {
        this.loopBgSound = '';
        this.loopBgSoundNew = '';
        this.loopBgMusic = '';
        this.loopBgMusicNew = '';
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
        let volume = Volume.getGlobal({format: 'int'});

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
     * @param params.target {object} jquery
     */
    playLoop (params = {}) {
        let self = this;
        let target = params.target;
        let type = target.data('effect-type');
        let src = [];
        let fadeInSpeed = 1000;
        let fadeOutSpeed = 1000;

        target.find('source').each(function (index, item) {
            src.push($(item).attr('src'));
        });

        //todo: fadeIn, fadeOut
        let newLoopParams = {
            src: src,
            fadeInSpeed: fadeInSpeed,
            fadeOutSpeed: fadeOutSpeed,
            volume: self.globalVolume
        };

        if (type === 'bg-music') {
            newLoopParams.loop = 'loopBgMusic';
        } else if (type === 'bg-sound') {
            newLoopParams.loop = 'loopBgSound';
        }

        self._setLoop(newLoopParams);
    }

    /**
     *
     * @param params {object}
     * @param params.loop {object} || string - loop-звук, который нужно остановить.
     * если нужно остановить все фоновые звуки - передаём 'all'
     * @param [params.fadeOutSpeed] {number} - скорость, с которой будет происходить fadeOut
     */
    stopLoop (params = {}) {
        let self = this;

        let loop = params.loop;
        let fadeOutSpeed = params.fadeOutSpeed;
        if (typeof fadeOutSpeed === 'undefined') fadeOutSpeed = 1000;

        if (!loop) return;

        if (loop === 'all') {

            $.each([self.loopBgSound, self.loopBgSoundNew, self.loopBgMusic, self.loopBgMusicNew], function (index, value) {
                self.stopLoop({loop: value, fadeOutSpeed: fadeOutSpeed});
            });

            return;
        }

        let volume = self.globalVolume;

        loop.once('fade', function () {
            loop.stop();

            if (SoundEffects.tryCatchHowlUnload(loop)) loop.unload();
        });

        //некорректное поведение, если задавать fadeOutSpeed = 0;
        loop.fade(volume, 0, fadeOutSpeed > 0 ? fadeOutSpeed : 1);
    }

    //Unload and destroy a Howl object.
    //This will immediately stop all sounds attached to this sound and remove it from the cache.
    static tryCatchHowlUnload (obj) {
        try {
            obj.unload();
        } catch (err) {
            return false;
        }

        return true;
    }

    /**
     *
     * @param params
     * @param params.loop {object}
     * @param params.src[] {string}
     * @param params.fadeInSpeed {number}
     * @param params.fadeOutSpeed {number}
     * @param params.volume {number}
     * @private
     */
    _setLoop (params = {}) {
        let self = this;
        let loop = params.loop;
        let src = params.src;
        let fadeInSpeed = params.fadeInSpeed;
        let fadeOutSpeed = params.fadeOutSpeed;
        let volume = params.volume;

        //записываем в экземпляр класса
        self[loop] = SoundEffects._newHowl({src: src});

        if (self[loop].state() !== 'loaded') {
            self[loop].once('load', function () {
                self[loop].fade(0, volume, fadeInSpeed);
            });
        } else {
            self[loop].fade(0, volume, fadeInSpeed);
        }
    }

    /**
     *
     * @param params
     * @param params.src
     * @private
     */
    static _newHowl (params = {}) {
        let src = params.src;

        return new Howl({
            src: src,
            autoplay: true,
            loop: true,
            volume: 0
        });
    }

    /**
     *
     * @param params {object}
     * @param params.src[] {string}
     * @param params.srcHowler {string}
     * @returns {boolean}
     * @private
     */
    static _srcEquals (params = {}) {
        let src = params.src;
        let srcHowler = params.srcHowler;

        src.forEach(function (item) {
            if (item === srcHowler) return true;
        });

        return false;
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

class ImageEffects {
    constructor () {

    }

    /**
     *
     * @param params
     * @param params.target
     */
    static setLeftSide (params = {}) {
        let target = params.target;
        let img = target.find('img');
        let leftSide = $(ConstsDOM.get().leftSide);

        //jquery использует абсолютные пути, поэтому сравниваем таким образом
        if (leftSide.css('background-image').indexOf(img.attr('src').replace('../', '')) !== -1) return;

        leftSide.addClass('fadeOut');
        leftSide.one('transitionend', function () {
            leftSide.css({'background-image': 'url(' + img.attr('src') + ')'});
            leftSide.removeClass('fadeOut');
        });
        //todo: слайдер, если несколько
    }
}