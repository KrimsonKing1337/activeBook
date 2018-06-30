import 'howler';
import get from 'lodash-es/get';
import find from 'lodash-es/find';
import 'notifyjs-browser';
import LocalStorage from '../states/LocalStorage';
import {VolumeController} from '../volume/Volume';
import {getVolumeInst} from '../volume/getVolumeInst';
import {CssVariables} from '../helpers/CssVariables';
import {getRandomInt} from '../helpers/getRamdomInt';
import {ModalContent} from '../modalContent/ModalContent';

const vibrationState = LocalStorage.read({key: 'vibration'});

export class Effects {
    constructor() {
        this.effects = [];
        this.volumeInst = getVolumeInst();
        this.vibrationEffectsInst = new VibrationEffects({
            state: vibrationState !== null ? vibrationState : true
        });
        this.flashLightEffectsInst = new FlashLightEffects();
        this.soundEffectsInst = new SoundEffects({
            loops: {},
            oneShots: {},
            volumeInst: this.volumeInst,
            vibrationEffectsInst: this.vibrationEffectsInst,
            flashLightEffectsInst: this.flashLightEffectsInst
        });
        this.volumeControllerInst = new VolumeController({
            $videos: $('video'),
            oneShots: this.soundEffectsInst.oneShots,
            loops: this.soundEffectsInst.loops,
            volumeInst: this.volumeInst
        });
        this.textShadowEffectsInst = new TextShadowEffects();
        this.sideTextScrollEffectInst = new SideTextScrollEffect();
    }

    setEffects(effects) {
        this.effects = effects;

        return this.initEffects();
    }

    /**
     * инициализируем эффекты на странице
     */
    initEffects() {
        const promises = [];

        this.effects.forEach((effectCur) => {
            const type = effectCur.type;

            if (type === 'oneShot') {
                promises.push(this.soundEffectsInst.checkAndSetNewOneShot(effectCur));
            } else if (type === 'loop') {
                promises.push(this.soundEffectsInst.checkAndSetNewLoop(effectCur));
            } else if (type === 'modalContent') {
                new ModalContent().init(effectCur);

                promises.push(Promise.resolve());
            }
        });

        return Promise.all(promises);
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
            vibration: effectCur.vibration,
            notification: effectCur.notification,
            flashLight: effectCur.flashLight
        };

        if (type === 'oneShot') {
            this.soundEffectsInst.playOneShot(id, soundEffectsParams);
        } else if (type === 'loop') {
            this.soundEffectsInst.playLoop(id, soundEffectsParams);
        } else if (type === 'modalContent') {
            ModalContent.getInstById(id).open();
        } else if (type === 'notification') {
            NotificationsEffects.play(effectCur);
        } else if (type === 'textShadow') {
            this.textShadowEffectsInst.play(effectCur);
        } else if (type === 'sideTextScroll') {
            this.sideTextScrollEffectInst.play(effectCur);
        } else if (type === 'filter') {
            FilterEffects.apply(effectCur);
        } else if (type === 'vibration') {
            this.vibrationEffectsInst.isStop = false;
            this.vibrationEffectsInst.play(effectCur);
        } else if (type === 'flashLight') {
            this.flashLightEffectsInst.isStop = false;
            this.flashLightEffectsInst.play(effectCur);
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
            this.soundEffectsInst.stopOneShot(id);
        } else if (type === 'loop') {
            this.soundEffectsInst.stopLoop(id);
        }
    }

    /**
     *
     * @param target {string}
     * @param fadeOutSpeed {number}
     * @param unload {boolean}
     * @param pause {boolean}
     */
    stopAll({target, fadeOutSpeed = 1000, unload = false, pause = false} = {}) {
        this.vibrationEffectsInst.stop();
        this.textShadowEffectsInst.stop();
        this.sideTextScrollEffectInst.stop();
        this.flashLightEffectsInst.stop();
        this.soundEffectsInst.stopAll({target, fadeOutSpeed, unload, pause});
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
     * @param volumeInst {object}
     * @param vibrationEffectsInst {object}
     * @param flashLightEffectsInst {object}
     */
    constructor({loops, oneShots, volumeInst, vibrationEffectsInst, flashLightEffectsInst} = {}) {
        this.loops = loops;
        this.oneShots = oneShots;
        this.volumeInst = volumeInst;
        this.vibrationEffectsInst = vibrationEffectsInst;
        this.flashLightEffectsInst = flashLightEffectsInst;
    }

    /**
     *
     * @param target {string}; oneShots || loops || all;
     * @param [fadeOutSpeed] {number};
     * @param [unload] {boolean}; выгрузить из памяти звук (уничтожить связанный объект Howler)
     * @param [pause] {boolean}; просто стоп или пауза
     */
    stopAll({target, fadeOutSpeed = 1000, unload = false, pause = false} = {}) {
        const action = pause === true ? 'pause' : 'stop';

        if (target === 'oneShots') {
            Object.keys(this.oneShots).forEach(async (key) => {
                const oneShotCur = this.oneShots[key];

                if (oneShotCur.state() === 'loaded') {
                    await SoundEffects.fadeOut({
                        target: oneShotCur,
                        volume: this.volumeInst.getOneShots(),
                        fadeOutSpeed,
                        action
                    });
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
                    await SoundEffects.fadeOut({
                        target: loopCur,
                        volume: this.volumeInst.getLoops(),
                        fadeOutSpeed,
                        action
                    });
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
                unload,
                pause
            });

            this.stopAll({
                target: 'loops',
                fadeOutSpeed,
                unload,
                pause
            });
        }
    }

    /**
     *
     * @param target {object}; howler inst sound;
     * @param volume {number};
     * @param [fadeOutSpeed] {number};
     * @param [action] {string};
     */
    static fadeOut({target, volume, fadeOutSpeed = 1000, action = 'stop'}) {
        return new Promise(((resolve, reject) => {
            if (!target) resolve();

            target.once('fade', () => {
                if (action === 'stop') {
                    target.stop();
                } else if (action === 'pause') {
                    target.pause();
                }

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
    static fadeIn({target, volume, fadeInSpeed = 1000}) {
        return new Promise((resolve, reject) => {
            /*target.once('fade', () => {
                console.log('fadeIn fade event');

                resolve();
            });*/

            target.once('play', () => {
                resolve();
            });

            target.play();

            //некорректное поведение, если задавать fadeOutSpeed = 0;
            target.fade(0, volume, fadeInSpeed > 0 ? fadeInSpeed : 1);
        });
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     * @param [pause] {boolean}
     */
    stopOneShot(id, {fadeOutSpeed = 0, pause = false} = {}) {
        const oneShot = this.oneShots[id];
        const action = pause === true ? 'pause' : 'stop';

        SoundEffects.fadeOut({
            target: oneShot,
            volume: this.volumeInst.getOneShots(),
            fadeOutSpeed,
            action
        });
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     */
    pauseOneStop(id, {fadeOutSpeed = 0}) {
        this.stopOneShot(id , {fadeOutSpeed, pause: true});
    }

    /**
     *
     * @param id {string}
     * @param [fadeInSpeed] {number}
     * @param [stopBy] {number}
     * @param [flashLight] {object}
     * @param [vibration] {object}
     * @param [notification] {object}
     */
    async playOneShot(id, {fadeInSpeed = 0, stopBy, vibration, flashLight, notification} = {}) {
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

        await SoundEffects.fadeIn({
            target: oneShot,
            volume: this.volumeInst.getOneShots(),
            fadeInSpeed
        });

        if (vibration) {
            this.vibrationEffectsInst.isStop = false;
            this.vibrationEffectsInst.play(vibration);
        }

        if (flashLight) {
            this.flashLightEffectsInst.isStop = false;
            this.flashLightEffectsInst.play(flashLight);
        }
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     * @param [pause] {boolean}
     */
    stopLoop(id, {fadeOutSpeed = 1000, pause = false} = {}) {
        const loop = this.loops[id];
        const action = pause === true ? 'pause' : 'stop';

        SoundEffects.fadeOut({
            target: loop,
            volume: this.volumeInst.getLoops(),
            fadeOutSpeed,
            action
        });
    }

    /**
     *
     * @param id {string}
     * @param [fadeOutSpeed] {number}
     */
    pauseLoop(id, {fadeOutSpeed = 0}) {
        this.stopLoop(id , {fadeOutSpeed, pause: true});
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

    /**
     *
     * @param id {string}
     * @param [fadeInSpeed] {number}
     * @param [stopBy] {object}
     * @param [vibration] {object}
     * @param [flashLight] {object}
     * @param [notification] {object}
     */
    async playLoop(id, {fadeInSpeed = 1000, stopBy, vibration, flashLight, notification} = {}) {
        const loop = this.loops[id];

        if (notification) {
            if (NotificationsEffects.canPlay(notification) === false) {
                return;
            }

            NotificationsEffects.play(notification);
        }

        await SoundEffects.fadeIn({
            target: loop,
            volume: this.volumeInst.getLoops(),
            fadeInSpeed
        });

        if (vibration) {
            this.vibrationEffectsInst.isStop = false;
            this.vibrationEffectsInst.play(vibration);
        }

        if (flashLight) {
            this.flashLightEffectsInst.isStop = false;
            this.flashLightEffectsInst.play(flashLight);
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
            return new Promise((resolve, reject) => {
                oneShots[id] = SoundEffects.newHowlOneShot({
                    src: oneShotCur.src,
                    volume: this.volumeInst.getOneShots()
                });

                oneShots[id].once('load', () => {
                    resolve();
                });

                /*oneShots[id].once('play', () => {
                    resolve();
                });*/
            });
        } else {
            return Promise.resolve();
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
            return new Promise((resolve, reject) => {
                loops[id] = SoundEffects.newHowlLoop({
                    src: loopCur.src,
                    volume: loopCur.fadeIn === false ? this.volumeInst.getLoops() : 0
                });

                loops[id].once('load', () => {
                    resolve();
                });

                /*loops[id].once('play', () => {
                    console.log('checkAndSetNewLoop event play');

                    resolve();
                });*/
            });
        } else {
            return Promise.resolve();
        }
    }

    /**
     *
     * @param src {string}
     * @param volume {number}
     */
    static newHowlLoop({src, volume} = {}) {
        return new Howl({
            src,
            preload: true,
            autoplay: false,
            loop: true,
            volume: 0 //volume is 0 for fadeIn effect
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
            loop: false,
            volume
        });
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
        this.isLoop = false;
        this.isStop = false;
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
     * @param [duration] {number}
     * @param [sleep] {number}
     * @param [sleepBeforeStart] {number}
     * @param [loop] {boolean}
     * @param [segments][] {object}
     * @param [fromReduce] {boolean}
     */
    play({duration, sleep = 100, sleepBeforeStart = 0, loop, segments = []} = {}, fromReduce = false) {
        if (!this.vibrationSupport) return;
        if (this.state !== true) return;
        //if (this.isStop === true) return Promise.reject('play is interrupted by stop flag');
        if (this.isStop === true) return;

        if (typeof loop !== 'undefined') this.isLoop = loop;

        if (segments.length > 0) {
            segments.reduce((previous, current, index, array) => {
                return previous
                    .then(() => {
                        return this.play(array[index], true).then(() => {
                            if (this.isLoop === true && index === array.length - 1) {
                                this.play({segments}, true);
                            }
                        });
                    })
                    .catch((msg) => {
                        //console.log(msg);
                    });
            }, Promise.resolve());

            return;
        }

        if (typeof duration === 'undefined') return;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                navigator.vibrate(duration);

                setTimeout(() => {
                    resolve();

                    if (this.isLoop === true && fromReduce === false) {
                        this.play({duration, sleep, sleepBeforeStart, loop});
                    }
                }, sleep);
            }, sleepBeforeStart);
        });
    }

    stop() {
        if (!this.vibrationSupport) return;

        this.isStop = true;
        this.isLoop = false;
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

export class FilterEffects {
    constructor() {

    }

    /**
     *
     * @param value {boolean}
     * @param writeToLocalStorage {boolean}
     */
    static invert(value, writeToLocalStorage = true) {
        $('.page').attr('data-invert', value);

        if (writeToLocalStorage) {
            LocalStorage.write({key: 'filterInvert', val: value});
        }
    }

    /**
     * @param filterEffect {object}
     */
    static apply(filterEffect) {
        const filter = filterEffect.filter;
        const name = filter.name;
        const value = filter.value;

        FilterEffects[name](value);
    }
}

class FlashLightEffects {
    constructor() {
        this.flashLight = get(window, 'plugins.flashlight');
        this.isLoop = false;
        this.isStop = false;
        this.setIsAvailable();
    }

    setIsAvailable() {
        return new Promise((resolve, reject) => {
            if (!this.flashLight) {
                this.isAvailable = false;

                resolve();

                return;
            }

            this.flashLight.available((isAvailable) => {
                this.isAvailable = isAvailable;

                resolve();
            });
        });
    }

    /**
     *
     * @param [duration] {number}
     * @param [sleepBeforeStart] {number}
     * @param [sleep] {number}
     * @param [loop] {boolean}
     * @param [segments][] {object}
     * @param [fromReduce] {boolean}
     */
    async play({duration, sleep = 100, sleepBeforeStart = 0, loop, segments = []} = {}, fromReduce = false) {
        if (!this.isAvailable) return;

        //if (this.isStop === true) return Promise.reject('play is interrupted by stop flag');
        if (this.isStop === true) return;

        if (typeof loop !== 'undefined') this.isLoop = loop;

        if (duration === 'infinity') duration = Infinity; //JSON can't Infinity as number

        if (segments.length > 0) {
            segments.reduce((previous, current, index, array) => {
                return previous
                    .then(() => {
                        return this.play(array[index], true).then(() => {
                            if (this.isLoop === true && index === array.length - 1) {
                                this.play({segments}, true);
                            }
                        });
                    })
                    .catch((msg) => {
                        //console.log(msg);
                    });
            }, Promise.resolve());

            return;
        }

        if (typeof duration === 'undefined') return;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.switchOn();

                if (duration === Infinity) {
                    resolve();
                } else {
                    setTimeout(() => {
                        resolve();

                        if (this.isLoop === true && fromReduce === false) {
                            this.play({duration, sleep, sleepBeforeStart, loop});
                        }

                        setTimeout(() => {
                            this.switchOff();
                        }, duration);
                    }, sleep);
                }
            }, sleepBeforeStart);
        });
    }

    stop() {
        if (!this.isAvailable) return;

        this.isStop = true;
        this.isLoop = false;
        this.switchOff();
    }

    switchOn() {
        if (!this.isAvailable) return;

        this.flashLight.switchOn(() => {
            // optional success callback
        }, () => {
            console.error('flashLight switchOn error'); // optional error callback
        }, {
            intensity: 0.3 // optional as well
        });
    }

    switchOff() {
        if (!this.isAvailable) return;

        this.flashLight.switchOff(() => {
            // optional success callback
        }, () => {
            console.error('flashLight switchOff error'); // optional error callback
        });
    }
}