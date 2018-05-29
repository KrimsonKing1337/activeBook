import 'howler';
import getDOMSelectors from './GetDOMSelectors';
import find from 'lodash-es/find';
import {GoToPage} from './Menu';
import 'notifyjs-browser';
import LocalStorage from './LocalStorage';
import {VolumeController} from './Volume';
import {getVolumeInst} from '../getVolumeInst';
import {CssVariables} from '../CssVariables';
import {getRandomInt} from '../getRamdomInt';

const DOMSelectors = getDOMSelectors();

class Effects {
    /**
     *
     * @param [effects[]] {object}; effects description from JSON
     */
    constructor({effects = []} = {}) {
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
                soundEffectsInst.checkAndSetNewOneShot(effectCur);
            } else if (type === 'loop') {
               soundEffectsInst.checkAndSetNewLoop(effectCur);
            } else if (type === 'modalContent') {
                modalContentEffectsInst.init(effectCur);
            }
        });
    }

    /**
     *
     * @param id {string}
     */
    play(id) {
        const effectCur = find(this.effects, {id});
        const type = effectCur.type;
        const soundEffectsParams = {
            fadeInSpeed: effectCur.fadeInSpeed,
            stopBy: effectCur.stopBy,
            goTo: effectCur.goTo,
            vibration: effectCur.vibration,
            notification: effectCur.notification
        };

        if (type === 'oneShot') {
            soundEffectsInst.playOneShot(id, soundEffectsParams);
        } else if (type === 'loop') {
            soundEffectsInst.playLoop(id, soundEffectsParams);
        } else if (type === 'modalContent') {
            modalContentEffectsInst.play();
        } else if (type === 'notification') {
            NotificationsEffects.play(effectCur);
        } else if (type === 'textShadow') {
            textShadowEffectsInst.play(effectCur);
        } else if (type === 'sideTextScroll') {
            sideTextScrollEffectInst.play(effectCur);
        }
    }

    /**
     *
     * @param id {string}
     */
    stop(id) {
        const effectCur = find(this.effects, {id});
        const type = effectCur.type;

        if (type === 'oneShot') {
            soundEffectsInst.stopOneShot(id);
        } else if (type === 'loop') {
            soundEffectsInst.stopLoop(id);
        }
    }

    stopAll({target, fadeOutSpeed = 1000, unload = false} = {}) {
        vibrationEffectsInst.stop();
        textShadowEffectsInst.stop();
        sideTextScrollEffectInst.stop();
        soundEffectsInst.stopAll({target, fadeOutSpeed, unload});
    }
}

class NotificationsEffects {
    constructor() {

    }

    /**
     *
     * @param notification {object}
     */
    static play(notification) {
        if (NotificationsEffects.canPlay(notification) === false) return;

        const text = NotificationsEffects.getText(notification);

        $.notify(text, {
            className: notification.className || 'success',
            autoHide: notification.autoHide || true,
            autoHideDelay: notification.autoHideDelay || 7500,
            globalPosition: 'bottom left'
        });

        if (notification.achievement) {
            LocalStorage.write({key: notification.id, val: true});
        }
    }

    /**
     *
     * @param notification {object}
     */
    static canPlay(notification) {
        if (!notification.achievement) return true;

        return (LocalStorage.read({key: notification.id}) === null);
    }

    static getAchievementPrefix() {
        return 'Achievement unlock';
    }

    static getText(notification) {
        return notification.achievement === true ?
            `${NotificationsEffects.getAchievementPrefix()}: ${notification.text}` :
            notification.text;
    }
}

class SoundEffects {
    /**
     * @param loops {object}
     * @param oneShots {object}
     */
    constructor({loops, oneShots} = {}) {
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

                if (oneShotCur.state() === 'loaded') {
                    await SoundEffects.fadeOut(oneShotCur, volumeInst.getOneShots(), fadeOutSpeed);
                }

                if (unload === true) {
                    SoundEffects.unload(oneShotCur);
                    delete this.oneShots[key];
                }
            });
        } else if (target === 'loops') {
            Object.keys(this.loops).forEach(async (key) => {
                const loopCur = this.loops[key];

                if (loopCur.state() === 'loaded') {
                    await SoundEffects.fadeOut(loopCur, volumeInst.getLoops(), fadeOutSpeed);
                }

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
            if (!target) resolve();

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
        return new Promise((resolve, reject) => {
            const state = target.state();

            if (state === 'loaded') {
                resolve();
            } else if (state === 'loading') {
                target.once('load', () => {
                    resolve();
                });
            }

            target.play();

            //некорректное поведение, если задавать fadeOutSpeed = 0;
            target.fade(0, volume, fadeInSpeed > 0 ? fadeInSpeed : 1);
        });
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     */
    stopOneShot(id, {fadeOutSpeed = 0} = {}) {
        const oneShot = this.oneShots[id];

        SoundEffects.fadeOut(oneShot, volumeInst.getOneShots(), fadeOutSpeed);
    }

    /**
     *
     * @param id {string}
     * @param [fadeInSpeed] {number}
     * @param [stopBy] {number}
     * @param [goTo] {object}
     * @param [vibration] {object}
     * @param [notification] {object}
     */
    async playOneShot(id, {fadeInSpeed = 0, stopBy, goTo, vibration, notification} = {}) {
        const oneShot = this.oneShots[id];

        if (notification) {
            if (NotificationsEffects.canPlay(notification) === false) {
                return;
            }

            NotificationsEffects.play(notification);
        }

        if (oneShot.playing() === true) {
            this.stopAll({target: 'oneShots', fadeOutSpeed: 0});
        }

        await SoundEffects.fadeIn(oneShot, volumeInst.getOneShots(), fadeInSpeed);

        if (vibration) {
            vibrationEffectsInst.play(vibration);
        }

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

        SoundEffects.fadeOut(loop, volumeInst.getLoops(), fadeOutSpeed);
    }

    /**
     *
     * @param target {object} Howler;
     */
    static unload(target) {
        if (SoundEffects.tryCatchHowlUnload(target) === true) {
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

    async playLoop(id, {fadeInSpeed = 1000, stopBy, vibration, notification} = {}) {
        /**
         *
         * @param id {string}
         * @param [fadeInSpeed] {number}
         * @param [stopBy] {object}
         * @param [vibration] {object}
         * @param [notification] {object}
         */
        const loop = this.loops[id];

        if (notification) {
            if (NotificationsEffects.canPlay(notification) === false) {
                return;
            }

            NotificationsEffects.play(notification);
        }

        await SoundEffects.fadeIn(loop, volumeInst.getLoops(), fadeInSpeed);

        if (vibration) {
            setTimeout(() => {
                vibrationEffectsInst.play(vibration);
            }, 300);
        }

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
                volume: volumeInst.getOneShots()
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
                volume: volumeInst.getLoops()
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
            preload: true,
            autoplay: false,
            //html5: true,
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
            preload: true,
            autoplay: false,
            //html5: true,
            loop: false,
            volume
        });
    }
}

class ModalContentEffects {
    constructor() {
        this.$modalContent = $(DOMSelectors.modalContent);
        this.$modalContentInner = $(DOMSelectors.modalContentInner);
        this.$modalContentClose = $(DOMSelectors.modalContentClose);
        this.$modalContentFullSize = $(DOMSelectors.modalContentFullSize);
        this.$img = this.$modalContent.find('img');
        this.$video = this.$modalContent.find('video');
        this.$iframe = this.$modalContent.find('iframe');
        this.$section = this.$modalContent.find('section');
    }

    /**
     *
     * @param effect {object}
     */
    init(effect) {
        this.set(effect);
        this.initCloseBtn();
        this.initFullSizeBtn();
    }

    /**
     *
     * @param [src[]] {string};
     * @param [text] {string};
     * @param modalContentType {string};
     */
    set({src, text, modalContentType} = {}) {
        if (modalContentType === 'image') {
            ModalContentEffects.setSrc(this.$img, src);
            ModalContentEffects.showElem(this.$img);
        } else if (modalContentType === 'video') {
            ModalContentEffects.setSrc(this.$video, src);
            ModalContentEffects.showElem(this.$video);
        } else if (modalContentType === 'iframe') {
            ModalContentEffects.setSrc(this.$iframe, src);
            ModalContentEffects.showElem(this.$iframe);
        } else if (modalContentType === 'text') {
            ModalContentEffects.setText(this.$section, text);
            ModalContentEffects.showElem(this.$section);
        }
    }

    /**
     *
     * @param $el {object} jquery
     */
    static showElem($el) {
        $el.addClass('active');
    }

    /**
     *
     * @param $el {object} jquery
     * @param src[] {string}
     */
    static setSrc($el, src) {
        $el.attr('src', src[0]);
    }

    /**
     *
     * @param $el {object} jquery
     * @param text {string}
     */
    static setText($el, text) {
        $el.text(text);
    }

    play() {
        this.$modalContent.addClass('active');
        this.$modalContent.animateCss('fadeIn');
    }

    close() {
        this.$modalContent.animateCss('fadeOut', () => {
            this.$modalContent.removeClass('active');
        });
    }

    initCloseBtn() {
        this.$modalContentClose.on('click', () => {
            this.close();
        });
    }

    initFullSizeBtn() {
        const children = this.$modalContentInner.children();

        let src = null;
        const video = children.filter('video.active');
        const img = children.filter('img.active');

        if (img.length > 0) {
            src = img.attr('src');
        } else if (video.length > 0) {
            src = video.attr('src');
        }

        if (src === null) return;

        this.$modalContentFullSize.on('click', () => {
            modalContentEffectsInst.close();

            window.open(`${window.location.origin}/${src}`, '_blank');
        });

        this.$modalContentFullSize.addClass('active');
    }
}

class VibrationEffects {
    /**
     *
     * @param state {boolean}; первоначальное состояние вибрации
     */
    constructor({state = true} = {}) {
        this.state = state;
        this.vibrationSupport = 'vibrate' in navigator;
        this.interval = null;
    }

    /**
     *
     * @param state {boolean}
     */
    set(state) {
        this.state = state;

        if (state === false) {
            this.stop();
        }
    }

    /**
     *
     * @param duration {number}
     * @param [repeat] {number}
     * @param [sleep] {number}
     * @param [sleepBeforeStart] {number}
     */
    play({duration, repeat = 0, sleep = 100, sleepBeforeStart = 300} = {}) {
        if (!this.vibrationSupport) return;
        if (this.state !== true) return;

        setTimeout(() => {
            navigator.vibrate(duration);

            if (repeat > 1) {
                let i = 1;

                this.interval = setInterval(() => {
                    if (i >= repeat) clearInterval(this.interval);

                    navigator.vibrate(duration);

                    i++;
                }, sleep);
            }
        }, sleepBeforeStart);
    }

    stop() {
        if (!this.vibrationSupport) return;

        clearInterval(this.interval);
        navigator.vibrate(0);
    }
}

class TextShadowEffects {
    constructor() {
        this.$textShadow = $('.text-shadow');
        this.interval = null;
        this.prevColorRandom = null;
        this.prevColorPolice = 'blue';
    }

    show() {
        this.$textShadow.addClass('active');
    }

    hide() {
        this.$textShadow.removeClass('active');
    }

    /**
     *
     * @param color {string}
     */
    static setColor(color) {
        CssVariables.set('--text-shadow-color', color);
    }

    /**
     *
     * @param animation {string}
     */
    static setAnimation(animation) {
        CssVariables.set('--text-shadow-animation', animation);
    }

    /**
     *
     * @param speed {number}
     */
    static setAnimationSpeed(speed) {
        CssVariables.set('--text-shadow-animation-speed', `${speed}ms`);
    }


    setColorRandom() {
        const r = getRandomInt(0, 255);
        const g = getRandomInt(0, 255);
        const b = getRandomInt(0, 255);
        const color = `rgb(${r}, ${g}, ${b})`;

        if (this.prevColorRandom !== color) {
            this.prevColorRandom = color;

            TextShadowEffects.setColor(color);
        } else {
            this.setColorRandom();
        }
    }

    setColorPolice() {
        if (this.prevColorPolice === 'blue') {
            this.prevColorPolice = 'red';

            TextShadowEffects.setColor('red');
        } else if (this.prevColorPolice === 'red') {
            this.prevColorPolice = 'blue';

            TextShadowEffects.setColor('blue');
        }
    }

    /**
     *
     * @param [color] {string}
     * @param [animation] {string}
     * @param [sleep] {number}
     * @param [speed] {number}
     */
    play({animation = 'blink', color = 'red', sleep = 1000, speed = 1000} = {}) {
        TextShadowEffects.setAnimation(animation);
        TextShadowEffects.setAnimationSpeed(speed);

        if (color === 'random') {
            this.setColorRandom();
        } else if (color === 'chameleon') {
            this.setColorRandom();

            this.interval = setInterval(() => {
                this.setColorRandom();
            }, sleep);
        } else if (color === 'police') {
            this.setColorPolice();

            this.$textShadow.on('animationiteration', () => {
                this.setColorPolice();
            });
        } else {
            TextShadowEffects.setColor(color);
        }

        this.show();
    }

    stop() {
        this.hide();
        this.$textShadow.off();
        clearInterval(this.interval);
    }
}

class SideTextScrollEffect {
    constructor() {
        this.sideTextScrollWrapper = $('.side-text-scroll-wrapper');
        this.sideTextScrollLeftContent = $('.js-side-text-scroll-left-content');
        this.sideTextScrollRightContent = $('.js-side-text-scroll-right-content');
    }

    /**
     *
     * @param [left] {string}
     * @param [right] {string}
     * @param [speed] {number}
     */
    play({left, right, speed = 60000} = {}) {
        const $left = $(left);
        const $right = $(right);

        if ($right.length === 0 && $left.length === 0) return;

        if ($left.length > 0) {
            SideTextScrollEffect.addNbsp($left.contents());

            this.sideTextScrollLeftContent.html($left.html());
        }

        if ($right.length > 0) {
            SideTextScrollEffect.addNbsp($right.contents());

            this.sideTextScrollRightContent.html($right.html());
        }

        SideTextScrollEffect.setAnimationSpeed(speed);

        this.show();
    }

    show() {
        this.sideTextScrollWrapper.addClass('active');
    }

    hide() {
        this.sideTextScrollWrapper.removeClass('active');
    }

    stop() {
        this.sideTextScrollLeftContent.html('');
        this.sideTextScrollRightContent.html('');
        this.hide();
    }

    static setAnimationSpeed(speed) {
        CssVariables.set('--side-scroll-text-animation-speed', `${speed}ms`);
    }

    /**
     *
     * @param $contents {object} jquery
     */
    static addNbsp($contents) {
        $contents.each((i, item) => {
            if (/^\s+$/.test(item.textContent)) return;

            item.textContent += '\u00A0'; //&nbsp;
        });
    }
}

export const volumeInst = getVolumeInst();

const vibrationState = LocalStorage.read({key: 'vibration'});

export const vibrationEffectsInst = new VibrationEffects({
    state: vibrationState !== null ? vibrationState : true
});

export const soundEffectsInst = new SoundEffects({
    loops: {},
    oneShots: {}
});

export const volumeControllerInst = new VolumeController({
    $videos: $('video'),
    oneShots: soundEffectsInst.oneShots,
    loops: soundEffectsInst.loops,
    volumeInst
});

export const modalContentEffectsInst = new ModalContentEffects();

export const textShadowEffectsInst = new TextShadowEffects();

export const sideTextScrollEffectInst = new SideTextScrollEffect();

export const EffectsController = new Effects();