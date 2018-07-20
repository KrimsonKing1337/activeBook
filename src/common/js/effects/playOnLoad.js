import filter from 'lodash-es/filter';
import {effectsInst} from '../effects/Effects';

/**
 *
 * @param effects[] {object}
 *
 * воспроизводим эффекты, которые должны быть
 * проиграны сразу после загрузки
 */
export function playOnLoad(effects) {
    const EffectsController = effectsInst();
    const playOnLoadEffects = filter(effects, 'playOnLoad');

    if (playOnLoadEffects.length > 0) {
        playOnLoadEffects.forEach((playOnLoadEffectCur) => {
            EffectsController.play(playOnLoadEffectCur.id);
        });
    }
}