import filter from 'lodash-es/filter';
import {getVolumeControllerInst} from './getVolumeControllerInst';
import {getAJAX} from './getAJAX';
import {textInit} from './textInit';
import {menuInit} from './menuInit';
import {Effects} from './modules/Effects';
import {getVolumeInst} from './getVolumeInst';

/**
 *
 * @param pageNum {number}
 */
export async function effectsTextAndMenuInit(pageNum) {
    const textAJAX = await getAJAX(`/page-${pageNum}.html`);
    const dataJSON = await getAJAX(`/page-${pageNum}.json`);

    $('.text-wrapper').html(textAJAX);

    //инитим громкость
    const VolumeInst = getVolumeInst();

    //инициализируем контроллер управления эффектами
    const EffectsController = new Effects({
        VolumeInst,
        effects: dataJSON.effects
    });

    //инитим управление громкостью
    const VolumeControllerInst = getVolumeControllerInst({
        VolumeInst,
        EffectsController
    });

    //воспроизводим эффекты, которые должны быть проиграны сразу после загрузки
    const playOnLoadEffects = filter(dataJSON.effects, 'playOnLoad');

    if (playOnLoadEffects.length > 0) {
        playOnLoadEffects.forEach((playOnLoadEffectCur) => {
            EffectsController.play(playOnLoadEffectCur.id);
        });
    }

    textInit(EffectsController);
    menuInit({VolumeInst, VolumeControllerInst, pageInfo: dataJSON.pageInfo});

    return EffectsController;
}