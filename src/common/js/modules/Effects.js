/**
 * Created by K on 11.06.2017.
 */

import getDOMSelectors from './GetDOMSelectors';

const Howler = require('howler');

export class Effects {
    /**
     *
     * @param VolumeInst {object}; inst volumeInst Class
     * @param effects[] {object}; effects description from JSON
     */
    constructor({VolumeInst, effects} = {}) {
        this.soundEffects = new SoundEffects({
            AudioLoops: new AudioLoops(),
            oneShots: {},
        });
        this.volume = {
            global: VolumeInst.global,
            hints: VolumeInst.hints,
            loops: VolumeInst.loops
        };
        this.effects = effects;
    }

    /**
     *
     * @param id {string} jquery
     */
    play(id) {
        const soundEffects = this.soundEffects;
        const effectCur = this.effects[id];

        //todo: инициализировать все звуки на странице сразу, а не по требованию
        if (!soundEffects.oneShots[id]) {
            soundEffects.oneShots[id] = SoundEffects.newHowlOneShot({
                src: effectCur.src,
                volume: this.volume.hints
            });
        }

        const type = effectCur.type;

        if (type === 'oneShot') {
            soundEffects.play(id);
            //todo: video, text, etc.
        } else if (type === 'bg-music') {
            soundEffects.prepareToPlayLoop({target, volume: this.volume.loops});
        } else if (type === 'bg-sound') {
            soundEffects.prepareToPlayLoop({target, volume: this.volume.loops});
        } else if (type === 'add-content') {
            ImageEffects.setAddContent({target});
        }
    }
}

/**
 * single tone
 */
class AudioLoops {
    constructor() {
        this.bgSound = '';
        this.bgSoundNew = '';
        this.bgMusic = '';
        this.bgMusicNew = '';
    }
}

class SoundEffects {
    /**
     *
     * @param AudioLoops {object} class
     * @param oneShots {object}
     */
    constructor({AudioLoops, oneShots} = {}) {
        this.AudioLoops = AudioLoops;
        this.oneShots = oneShots;
    }

    static get sounds() {
        return $('audio');
    }

    /**
     * @param target {object} jquery
     * @returns {string}
     */
    static getState({target} = {}) {
        if (target[0].duration > 0 && !target[0].paused) {
            return 'playing';
        } else {
            return 'paused';
        }
    }

    /**
     *
     * @param target {string}; sounds || bgSound || bgMusic || all;
     * @param volume {number};
     */
    stop({target, volume} = {}) {
        if (target === 'sounds') {
            this.oneShots.each((index, item) => {
                //todo: fadeout
            });
            //todo: bgSound, bgMusic, all
        } else if (target === 'bgSound') {

        }
    }

    /**
     *
     * @param id {string}
     */
    play(id) {
        const oneShots = this.oneShots;

        //todo: приглушать остальные звуки перед воспроизведением нового
        /*if (oneShots[id].state() === 'paused') {
            this.stop({target: 'sounds', volume});
            target[0].play();
        }*/

        oneShots[id].play();
    }

    /**
     *
     * @param target {object} jquery
     * @param volume {number}
     * @param effectParams {object}
     */
    prepareToPlayLoop({target, volume, effectParams} = {}) {
        const self = this;
        const type = target.data('effect-type');
        const src = [];

        target.find('source').each((index, item) => {
            src.push($(item).attr('src'));
        });

        let fadeInSpeed = 5000;
        let fadeOutSpeed = 5000;

        if (effectParams) {
            fadeInSpeed = effectParams.fadeInSpeed || 1000;
            fadeOutSpeed = effectParams.fadeOutSpeed || 1000;
        }

        const newLoopParams = {
            src,
            fadeInSpeed,
            fadeOutSpeed,
            volume,
            addParams: effectParams
        };

        if (type === 'bg-music') {
            newLoopParams.loopName = 'bgMusic';
        } else if (type === 'bg-sound') {
            newLoopParams.loopName = 'bgSound';
        }

        self.setLoop(newLoopParams);
    }

    /**
     *
     * @param volume {number} - громкость лупа
     * @param loop {object} || string - loop-звук, который нужно остановить.
     * если нужно остановить все фоновые звуки - передаём 'all'
     * @param [fadeOutSpeed] {number} - скорость, с которой будет происходить fadeOut
     */
    stopLoop({volume, loop, fadeOutSpeed} = {}) {
        if (typeof fadeOutSpeed === 'undefined') fadeOutSpeed = 1000;

        if (!loop) return;

        if (loop === 'all') {
            $.each([this.loopBgSound, this.loopBgSoundNew, this.loopBgMusic, this.loopBgMusicNew], (index, value) => {
                this.stopLoop({loop: value, fadeOutSpeed, volume});
            });

            return;
        }

        loop.once('fade', () => {
            loop.stop();

            if (SoundEffects.tryCatchHowlUnload(loop)) loop.unload();
        });

        //некорректное поведение, если задавать fadeOutSpeed = 0;
        loop.fade(volume, 0, fadeOutSpeed > 0 ? fadeOutSpeed : 1);
    }

    //Unload and destroy a Howl object.
    //This will immediately stop all sounds attached to this sound and remove it from the cache.
    static tryCatchHowlUnload(obj) {
        try {
            obj.unload();
        } catch (err) {
            return false;
        }

        return true;
    }

    /**
     *
     * @param loopName {object}
     * @param src[] {string}
     * @param fadeInSpeed {number}
     * @param fadeOutSpeed {number}
     * @param volume {number}
     * @param addParams {number}
     * @private
     */
    setLoop({loopName, src, fadeInSpeed, fadeOutSpeed, volume, addParams} = {}) {
        const self = this;

        //записываем в экземпляр класса
        self.AudioLoops[loopName] = SoundEffects.newHowlLoop({src});

        const playLoopParams = {
            loopName,
            fadeInSpeed,
            fadeOutSpeed,
            volume,
            addParams
        };

        if (self.AudioLoops[loopName].state() !== 'loaded') {
            self.AudioLoops[loopName].once('load', () => {
                self.playLoop(playLoopParams);
            });
        } else {
            self.playLoop(playLoopParams);
        }
    }

    /**
     *
     * @param loopName {object}
     * @param fadeInSpeed {number}
     * @param fadeOutSpeed {number}
     * @param volume {number}
     * @param addParams {object}
     * @param addParams.stopBy {string}
     * @private
     */
    playLoop({loopName, fadeInSpeed, fadeOutSpeed, volume, addParams} = {}) {
        let stopBy;

        if (addParams && addParams.stopBy) {
            stopBy = addParams.stopBy;
        }

        this.AudioLoops[loopName].fade(0, volume, fadeInSpeed);

        if (stopBy) {
            setTimeout(() => {
                this.stopLoop({
                    loop: this.AudioLoops[loopName],
                    volume,
                    fadeOutSpeed
                })
            }, stopBy);
        }
    }

    /**
     *
     * @param src
     */
    static newHowlLoop({src} = {}) {
        return new Howl({
            src,
            autoplay: true,
            loop: true,
            volume: 0
        });
    }

    /**
     *
     * @param src {string}
     * @param volume {number}
     */
    static newHowlOneShot({src, volume} = {}) {
        return new Howl({
            src,
            autoplay: false,
            loop: false,
            volume
        });
    }

    /**
     *
     * @param src[] {string}
     * @param srcHowler {string}
     * @returns {boolean}
     * @private
     */
    static srcEquals({src, srcHowler} = {}) {
        src.forEach((item) => {
            if (item === srcHowler) return true;
        });

        return false;
    }
}

class VideoEffects {
    constructor() {

    }
}

class TextEffects {
    constructor() {

    }
}

class ImageEffects {
    constructor() {

    }

    /**
     *
     * @param target
     */
    static setAddContent({target} = {}) {
        const contents = target.contents();
        const $addContent = $(getDOMSelectors().addContent);
        const $addContentInner = $(getDOMSelectors().addContentInner);

        //jquery использует абсолютные пути, поэтому сравниваем таким образом
        /*if ($addContent.css('background-image').indexOf(img.attr('src').replace('../', '')) !== -1) return;

        $addContent.addClass('fadeOut');
        $addContent.one('transitionend', () => {
            $addContent.css({'background-image': `url(${ img.attr('src') })`});
            $addContent.removeClass('fadeOut');
        });*/

        $addContentInner.append(contents);
        $addContent.fadeIn();
        //todo: слайдер, если несколько
    }
}