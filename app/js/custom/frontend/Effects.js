/**
 * Created by K on 11.06.2017.
 */

import ConstsDOM from './ConstsDOM';
let Howler = require('howler');

export class Effects {
    /**
     *
     * @param Volume {object}; inst Volume Class
     */
    constructor (Volume) {
        this.soundEffects = new SoundEffects({
            AudioLoops: new AudioLoops()
        });
        this.volume = {
            global: Volume.global,
            hints: Volume.hints,
            loops: Volume.loops
        }
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
        let target = params.target;
        let effectParams = params.effectParams;

        let type = target.data('effect-type');

        if (type === 'audio') {
            SoundEffects.play({target: target, volume: self.volume.global});
            //todo: video, text, etc.
        } else if (type === 'bg-music') {
            soundEffects.playLoop({target: target, volume: self.volume.loops});
        } else if (type === 'bg-sound') {
            soundEffects.playLoop({target: target, volume: self.volume.loops});
        } else if (type === 'image-left-side') {
            ImageEffects.setLeftSide({target: target});
        }
    }
}

/**
 * single tone
 */
class AudioLoops {
    constructor () {
        this.bgSound = '';
        this.bgSoundNew = '';
        this.bgMusic = '';
        this.bgMusicNew = '';
    }
}

class SoundEffects {
    /**
     *
     * @param params {object}
     * @param params.AudioLoops {object} class
     */
    constructor (params = {}) {
        this.AudioLoops = params.AudioLoops;
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
     * @param params.volume {number};
     */
    static stop (params = {}) {
        let target = params.target;
        let volume = params.volume;

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
     * @param params.volume {number}
     */
    static play (params = {}) {
        let target = params.target;
        let volume = params.volume;

        if (SoundEffects.getState({target: target}) === 'paused') {
            SoundEffects.stop({target: 'sounds', volume: volume});
            target[0].play();
        }
    }

    /**
     *
     * @param params
     * @param params.target {object} jquery
     * @param params.volume {number}
     */
    playLoop (params = {}) {
        let self = this;
        let target = params.target;
        let type = target.data('effect-type');
        let src = [];
        let fadeInSpeed = 1000;
        let fadeOutSpeed = 1000;
        let volume = params.volume;

        target.find('source').each(function (index, item) {
            src.push($(item).attr('src'));
        });

        //todo: fadeIn, fadeOut
        let newLoopParams = {
            src: src,
            fadeInSpeed: fadeInSpeed,
            fadeOutSpeed: fadeOutSpeed,
            volume: volume
        };

        if (type === 'bg-music') {
            newLoopParams.loopName = 'bgMusic';
        } else if (type === 'bg-sound') {
            newLoopParams.loopName = 'bgSound';
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

        let volume = self.volume.loops;

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
     * @param params.loopName {object}
     * @param params.src[] {string}
     * @param params.fadeInSpeed {number}
     * @param params.fadeOutSpeed {number}
     * @param params.volume {number}
     * @private
     */
    _setLoop (params = {}) {
        let self = this;
        let loopName = params.loopName;
        let src = params.src;
        let fadeInSpeed = params.fadeInSpeed;
        let fadeOutSpeed = params.fadeOutSpeed;
        let volume = params.volume;

        //записываем в экземпляр класса
        self.AudioLoops[loopName] = SoundEffects._newHowl({src: src});

        if (self.AudioLoops[loopName].state() !== 'loaded') {
            self.AudioLoops[loopName].once('load', function () {
                self.AudioLoops[loopName].fade(0, volume, fadeInSpeed);
            });
        } else {
            self.AudioLoops[loopName].fade(0, volume, fadeInSpeed);
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