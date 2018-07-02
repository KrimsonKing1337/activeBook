/**
 *
 * @param pageNumberCurrent {number}
 * @param audioWithRange {object}
 */
import {SoundEffects} from './Effects';

function audioWithRange(pageNumberCurrent, audioWithRange) {
    const EffectsController = window.EffectsController;
    const soundEffectsInst = EffectsController.soundEffectsInst;
    const id = audioWithRange.id;
    const type = audioWithRange.type;
    const range = audioWithRange.range;
    const soundEffectsParams = {
        fadeInSpeed: audioWithRange.fadeInSpeed,
        fadeOutSpeed: audioWithRange.fadeOutSpeed,
        stopBy: audioWithRange.stopBy,
        vibration: audioWithRange.vibration,
        notification: audioWithRange.notification,
        flashLight: audioWithRange.flashLight,
        sleepBeforeStart: audioWithRange.sleepBeforeStart
    };

    if (pageNumberCurrent >= range.start && pageNumberCurrent < range.stop) {
        if (type === 'loop') {
            soundEffectsInst.checkAndSetNewLoop(audioWithRange).then(() => {
                if (soundEffectsInst.loops[id].playing() === false) {
                    soundEffectsInst.playLoop(id, soundEffectsParams);
                }
            });
        } else if (type === 'oneShot') {
            soundEffectsInst.checkAndSetNewOneShot(audioWithRange).then(() => {
                if (soundEffectsInst.oneShots[id].playing() === false) {
                    soundEffectsInst.playOneShot(id, soundEffectsParams);
                }
            });
        }
    } else {
        if (type === 'loop') {
            if (soundEffectsInst.loops[id]) {
                soundEffectsInst.stopLoop(id, soundEffectsParams).then(() => {
                    SoundEffects.unload(soundEffectsInst.loops[id]);

                    delete soundEffectsInst.loops[id];
                });
            }
        } else if (type === 'oneShot') {
            if (soundEffectsInst.oneShots[id]) {
                soundEffectsInst.stopOneShot(id, soundEffectsParams).then(() => {
                    SoundEffects.unload(soundEffectsInst.oneShots[id]);

                    delete soundEffectsInst.oneShots[id];
                });
            }
        }
    }
}

/**
 *
 * @param pageNumberCurrent {number}
 * @param pagesEffects[] {object}
 */
export function checkAllAudiosWithRange(pageNumberCurrent, pagesEffects) {
    if (pagesEffects.length > 0) {
        pagesEffects.forEach((pagesEffectCur) => {
            if (pagesEffectCur.type === 'loop' || pagesEffectCur.type === 'oneShot') {
                audioWithRange(pageNumberCurrent, pagesEffectCur);
            }
        });
    }
}