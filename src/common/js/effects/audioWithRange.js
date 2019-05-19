import {SoundEffects} from './Effects';
import {effectsInst} from '../effects/Effects';

/**
 *
 * @param pageNumberCurrent {number}
 * @param range[] {object}
 */
function isPageInRange(pageNumberCurrent, range) {
  if (range.length > 0) {
    return range.some((rangeCur) => {
      return pageNumberCurrent >= rangeCur.start && pageNumberCurrent < rangeCur.stop;
    });
  } else {
    return pageNumberCurrent >= range.start && pageNumberCurrent < range.stop;
  }
}

/**
 *
 * @param pageNumberCurrent {number}
 * @param audioWithRange {object}
 */
async function audioWithRange(pageNumberCurrent, audioWithRange) {
  const EffectsController = await effectsInst();
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
    sleepBefore: audioWithRange.sleepBefore
  };

  if (isPageInRange(pageNumberCurrent, range) === true) {
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
  if (pagesEffects.length === 0) return;

  pagesEffects.forEach((pagesEffectsCur) => {
    if (pagesEffectsCur.type === 'loop' || pagesEffectsCur.type === 'oneShot') {
      audioWithRange(pageNumberCurrent, pagesEffectsCur);
    }
  });
}
