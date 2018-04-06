/**
 * Created by K on 11.06.2017.
 */

import getDOMSelectors from './GetDOMSelectors';
import find from 'lodash-es/find';

const Howler = require('howler');

export class Effects {
    /**
     *
     * @param VolumeInst {object}; inst volumeInst Class
     * @param effects[] {object}; effects description from JSON
     */
    constructor({VolumeInst, effects} = {}) {
        this.soundEffectsInst = new SoundEffects({
            VolumeInst,
            loops: {},
            oneShots: {},
        });
        this.VolumeInst = VolumeInst;
        this.effects = effects;

        /**
         * инициализируем звуки на странице
         */
        this.effects.forEach((effectCur) => {
            const id = effectCur.id;
            const type = effectCur.type;
            const src = effectCur.src;

            if (type === 'oneShot') {
                this.checkAndSetNewOneShot({id, src});
            } else if (type === 'loop') {
                this.checkAndSetNewLoop({id, src});
            }
        });
    }

    /**
     *
     * @param id {string}
     */
    play(id) {
        const soundEffectsInst = this.soundEffectsInst;
        const effectCur = find(this.effects, {id});

        const type = effectCur.type;

        if (type === 'oneShot') {
            soundEffectsInst.playOneShot(id);
        } else if (type === 'loop') {
            soundEffectsInst.playLoop(id);
        } else if (type === 'add-content') {
            ImageEffects.setAddContent({target});
        }

        //todo: video, text, etc.
    }

    /**
     *
     * @param id {string}
     */
    stop(id) {
        const soundEffectsInst = this.soundEffectsInst;
        const effectCur = find(this.effects, {id});
        const type = effectCur.type;

        if (type === 'oneShot') {
            soundEffectsInst.stopOneShot(id);
        } else if (type === 'loop') {
            soundEffectsInst.stopLoop(id);
        }
    }

    stopAll({target, fadeOutSpeed = 1000, unload = false} = {}) {
        const soundEffectsInst = this.soundEffectsInst;

        soundEffectsInst.stopAll({target, fadeOutSpeed, unload});
    }

    /**
     *
     * @param id {string}
     * @param src {string}
     */
    checkAndSetNewOneShot({id, src}) {
        const soundEffectsInst = this.soundEffectsInst;

        if (!soundEffectsInst.oneShots[id]) {
            soundEffectsInst.oneShots[id] = SoundEffects.newHowlOneShot({
                src,
                volume: this.VolumeInst.getOneShots()
            });
        }
    }

    /**
     *
     * @param id {string}
     * @param src {string}
     */
    checkAndSetNewLoop({id, src}) {
        const soundEffectsInst = this.soundEffectsInst;

        if (!soundEffectsInst.loops[id]) {
            soundEffectsInst.loops[id] = SoundEffects.newHowlLoop({
                src,
                volume: this.VolumeInst.getLoops()
            });
        }
    }
}

class SoundEffects {
    /**
     * @param VolumeInst {object}
     * @param loops {object}
     * @param oneShots {object}
     */
    constructor({VolumeInst, loops, oneShots} = {}) {
        this.VolumeInst = VolumeInst;
        this.loops = loops;
        this.oneShots = oneShots;
    }

    /**
     *
     * @param target {string}; oneShots || loops || all;
     * @param [fadeOutSpeed] {number};
     * @param [unload] {bool}; выгрузить из памяти звук (уничтожить связанный объект Howler)
     */
    stopAll({target, fadeOutSpeed = 1000, unload = false} = {}) {
        if (target === 'oneShots') {
            Object.keys(this.oneShots).forEach((key) => {
                const oneShotCur = this.oneShots[key];

                SoundEffects.fadeOut(oneShotCur, this.VolumeInst.getOneShots(), fadeOutSpeed);

                if (unload === true) {
                    SoundEffects.unload(oneShotCur);
                }
            });
        } else if (target === 'loops') {
            Object.keys(this.loops).forEach((key) => {
                const loopCur = this.loops[key];

                SoundEffects.fadeOut(loopCur, this.VolumeInst.getLoops(), fadeOutSpeed);

                if (unload === true) {
                    SoundEffects.unload(loopCur);
                }
            });
        } else if (target === 'all') {
            this.stopAll({
                target: 'oneShots',
                fadeOutSpeed,
                unload
            });

            this.stopAll({
                target: 'loops',
                fadeOutSpeed,
                unload
            });
        }
    }

    /**
     *
     * @param target {object}; howler inst sound;
     * @param volume {number};
     * @param [fadeOutSpeed] {number};
     */
    static fadeOut(target, volume, fadeOutSpeed = 1000) {
        target.once('fade', () => {
            target.stop();
        });

        //некорректное поведение, если задавать fadeOutSpeed = 0;
        target.fade(volume, 0, fadeOutSpeed > 0 ? fadeOutSpeed : 1);
    }

    /**
     *
     * @param target {object}; howler inst sound;
     * @param volume {number};
     * @param [fadeInSpeed] {number};
     */
    static fadeIn(target, volume, fadeInSpeed = 1000) {
        target.play();
        //некорректное поведение, если задавать fadeOutSpeed = 0;
        target.fade(0, volume, fadeInSpeed > 0 ? fadeInSpeed : 1);
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     */
    stopOneShot(id, fadeOutSpeed = 1000) {
        const oneShot = this.oneShots[id];

        SoundEffects.fadeOut(oneShot, this.VolumeInst.getOneShots(), fadeOutSpeed);
    }

    /**
     *
     * @param id {string}
     * @param [fadeInSpeed] {number}
     */
    playOneShot(id, fadeInSpeed = 0) {
        const oneShot = this.oneShots[id];

        if (oneShot.playing() === true) {
            this.stopAll({target: 'oneShots'});
        }

        SoundEffects.fadeIn(oneShot, this.VolumeInst.getOneShots(), fadeInSpeed);
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     */
    stopLoop(id, fadeOutSpeed = 1000) {
        const loop = this.loops[id];

        SoundEffects.fadeOut(loop, this.VolumeInst.getLoops(), fadeOutSpeed);
    }

    /**
     *
     * @param target {object} Howler;
     */
    static unload(target) {
        if (SoundEffects.tryCatchHowlUnload(target)) {
            target.unload();
        }
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
     * @param id {object}
     * @param [fadeInSpeed {number}]
     * @param [stopBy {object}]
     */
    playLoop(id, fadeInSpeed = 1000, stopBy) {
        const loops = this.loops;

        loops[id].fade(0, this.VolumeInst.getLoops(), fadeInSpeed);

        if (stopBy) {
            setTimeout(() => {
                this.stopLoop(this.loops[id], stopBy.fadeOutSpeed);
            }, stopBy.duration);
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