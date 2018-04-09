import filter from 'lodash-es/filter';

/**
 *
 * @param EffectsController {object}
 * @param effects {object}
 *
 * воспроизводим эффекты, которые должны быть
 * проиграны сразу после загрузки
 */
export function playOnLoad({EffectsController, effects} = {}) {
    const playOnLoadEffects = filter(effects, 'playOnLoad');

    if (playOnLoadEffects.length > 0) {
        playOnLoadEffects.forEach((playOnLoadEffectCur) => {
            EffectsController.play(playOnLoadEffectCur.id);
        });
    }
}