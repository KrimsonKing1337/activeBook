import filter from 'lodash-es/filter';

/**
 *
 * @param effects[] {object}
 *
 * воспроизводим эффекты, которые должны быть
 * проиграны сразу после загрузки
 */
export function playOnLoad(effects) {
    const playOnLoadEffects = filter(effects, 'playOnLoad');

    if (playOnLoadEffects.length > 0) {
        playOnLoadEffects.forEach((playOnLoadEffectCur) => {
            window.EffectsController.play(playOnLoadEffectCur.id);
        });
    }
}