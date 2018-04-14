/**
 * Created by K on 11.06.2017.
 */

import getDOMSelectors from './GetDOMSelectors';
import find from 'lodash-es/find';
import {GoToPage} from './Menu';

const Howler = require('howler');

export class Effects {
    /**
     *
     * @param VolumeInst {object}; inst volumeInst Class
     * @param effects[] {object}; effects description from JSON
     */
    constructor({VolumeInst, effects} = {}) {
        this.VolumeInst = VolumeInst;

        this.soundEffectsInst = new SoundEffects({
            VolumeInst: this.VolumeInst,
            loops: {},
            oneShots: {},
        });

        this.imageEffectsInst = new ImageEffects({
            images: {}
        });

        this.effects = effects;

        this.initEffects();
    }

    setEffects(effects) {
        this.effects = effects;

        this.initEffects();
    }

    /**
     * инициализируем эффекты на странице
     */
    initEffects() {
        this.effects.forEach((effectCur) => {
            const type = effectCur.type;

            if (type === 'oneShot') {
                this.soundEffectsInst.checkAndSetNewOneShot(effectCur);
            } else if (type === 'loop') {
                this.soundEffectsInst.checkAndSetNewLoop(effectCur);
            } else if (type === 'image') {
                this.imageEffectsInst.checkAndSet(effectCur);
            }
        });
    }

    /**
     *
     * @param id {string}
     */
    play(id) {
        const soundEffectsInst = this.soundEffectsInst;
        const imageEffectsInst = this.imageEffectsInst;
        const effectCur = find(this.effects, {id});
        const type = effectCur.type;

        if (effectCur.vibration && VibrationEffects.state() === true) {
            setTimeout(() => {
                VibrationEffects.play(effectCur.vibration);
            }, 300);
        }

        if (type === 'oneShot') {
            soundEffectsInst.playOneShot(id, {
                fadeInSpeed: effectCur.fadeInSpeed,
                stopBy: effectCur.stopBy,
                goTo: effectCur.goTo
            });
        } else if (type === 'loop') {
            soundEffectsInst.playLoop(id, {
                fadeInSpeed: effectCur.fadeInSpeed,
                stopBy: effectCur.stopBy,
                goTo: effectCur.goTo
            });
        } else if (type === 'image') {
            imageEffectsInst.play(id);
        }
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

        VibrationEffects.stop();
        soundEffectsInst.stopAll({target, fadeOutSpeed, unload});
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
            Object.keys(this.oneShots).forEach(async (key) => {
                const oneShotCur = this.oneShots[key];

                await SoundEffects.fadeOut(oneShotCur, this.VolumeInst.getOneShots(), fadeOutSpeed);

                if (unload === true) {
                    SoundEffects.unload(oneShotCur);
                    delete this.oneShots[key];
                }
            });
        } else if (target === 'loops') {
            Object.keys(this.loops).forEach(async (key) => {
                const loopCur = this.loops[key];

                await SoundEffects.fadeOut(loopCur, this.VolumeInst.getLoops(), fadeOutSpeed);

                if (unload === true) {
                    SoundEffects.unload(loopCur);
                    delete this.loops[key];
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
        return new Promise(((resolve, reject) => {
            target.once('fade', () => {
                target.stop();
                resolve();
            });

            //некорректное поведение, если задавать fadeOutSpeed = 0;
            target.fade(volume, 0, fadeOutSpeed > 0 ? fadeOutSpeed : 1);
        }));
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
    stopOneShot(id, {fadeOutSpeed = 0} = {}) {
        const oneShot = this.oneShots[id];

        SoundEffects.fadeOut(oneShot, this.VolumeInst.getOneShots(), fadeOutSpeed);
    }

    /**
     *
     * @param id {string}
     * @param [fadeInSpeed] {number}
     * @param [stopBy] {number}
     * @param [goTo] {object}
     */
    playOneShot(id, {fadeInSpeed = 0, stopBy, goTo} = {}) {
        const oneShot = this.oneShots[id];

        if (oneShot.playing() === true) {
            this.stopAll({target: 'oneShots', fadeOutSpeed: 0});
        }

        SoundEffects.fadeIn(oneShot, this.VolumeInst.getOneShots(), fadeInSpeed);

        if (goTo) {
            const sleep = goTo.sleep || 0;

            if (goTo.page) {
                setTimeout(() => {
                    GoToPage.go({val: goTo.page});
                }, sleep);
            } else if (goTo.href) {
                setTimeout(() => {
                    window.open(`${window.location.origin}/${goTo.href}`, '_blank');
                }, sleep);
            }
        }
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     */
    stopLoop(id, {fadeOutSpeed = 1000} = {}) {
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
     * @param id {string}
     * @param [fadeInSpeed {number}]
     * @param [stopBy {object}]
     */
    playLoop(id, {fadeInSpeed = 1000, stopBy} = {}) {
        const loop = this.loops[id];

        SoundEffects.fadeIn(loop, this.VolumeInst.getLoops(), fadeInSpeed);

        //todo: start timer after loaded and start play, вынести stopBy, goTo в отдельные методы
        if (stopBy) {
            setTimeout(() => {
                this.stopLoop(id, {fadeOutSpeed: stopBy.fadeOutSpeed});

            }, stopBy.duration);
        }
    }

    /**
     *
     * @param oneShotCur {object}
     */
    checkAndSetNewOneShot(oneShotCur) {
        const oneShots = this.oneShots;
        const id = oneShotCur.id;

        if (!oneShots[id]) {
            oneShots[id] = SoundEffects.newHowlOneShot({
                src: oneShotCur.src,
                volume: this.VolumeInst.getOneShots()
            });
        }
    }

    /**
     *
     * @param loopCur {object}
     */
    checkAndSetNewLoop(loopCur) {
        const loops = this.loops;
        const id = loopCur.id;

        if (!loops[id]) {
            loops[id] = SoundEffects.newHowlLoop({
                src: loopCur.src,
                volume: this.VolumeInst.getLoops()
            });
        }
    }

    /**
     *
     * @param src
     */
    static newHowlLoop({src} = {}) {
        return new Howl({
            src,
            autoplay: false,
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
    constructor(images) {
        this.images = images;
    }

    /**
     *
     * @param imageCur {object};
     */
    checkAndSet(imageCur) {
        const images = this.images;
        const id = imageCur.id;

        if (!images[id]) {
            //кэшируем
            ImageEffects.set(imageCur.src);

            images[id] = imageCur;
        }
        //todo: слайдер, если несколько
    }

    /**
     *
     * @param src {string};
     */
    static set(src) {
        const $img = `<img src="${src}" />`;
        const $addContentInner = $(getDOMSelectors().addContentInner);

        $addContentInner.html($img);
    }

    /**
     *
     * @param id {string};
     */
    play(id) {
        const images = this.images;
        const $addContent = $(getDOMSelectors().addContent);

        ImageEffects.set(images[id].src);
        $addContent.fadeIn();
    }
}

let vibroInterval;

export class VibrationEffects {
    constructor() {
        //todo: геттеры, сеттеры, записываем и меняем состояние вибрации здесь, отвязываемся от DOM-элемента
    }

    static vibrationSupport() {
        return 'vibrate' in navigator;
    }

    /**
     *
     * @param duration {number}
     * @param [repeat] {number}
     * @param [sleep] {number}
     */
    static play({duration, repeat = 0, sleep = 100} = {}) {
        if (!VibrationEffects.vibrationSupport()) return;

        navigator.vibrate(duration);

        if (repeat > 1) {
            let i = 1;

            vibroInterval = setInterval(() => {
                if (i >= repeat) clearInterval(vibroInterval);

                navigator.vibrate(duration);

                i++;
            }, sleep);
        }
    }

    static stop() {
        if (!VibrationEffects.vibrationSupport()) return;

        clearInterval(vibroInterval);
        navigator.vibrate(0);
    }

    static state() {
        return $(getDOMSelectors().page).data('vibration');
    }
}