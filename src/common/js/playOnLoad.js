import filter from 'lodash-es/filter';
import {EffectsController} from './modules/Effects';

/**
 *
 * @param effects {object}
 *
 * воспроизводим эффекты, которые должны быть
 * проиграны сразу после загрузки
 */
export function playOnLoad(effects) {
    const playOnLoadEffects = filter(effects, 'playOnLoad');

    if (playOnLoadEffects.length > 0) {
        playOnLoadEffects.forEach((playOnLoadEffectCur) => {
            EffectsController.play(playOnLoadEffectCur.id);
        });
    }
}