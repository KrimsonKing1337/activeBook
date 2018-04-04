import {Effects} from './modules/Effects';
import {getVolumeInst} from './getVolumeInst';
import {getVolumeControllerInst} from './getVolumeControllerInst';
import {getJSON} from './getJSON';

export async function outsideInit() {
    const iframe = $('iframe')[0];

    document.title = iframe.contentDocument.title;

    const page = $(iframe.contentDocument).find('body#inside').data('page');

    const effectsJSON = await getJSON(`/${page}.json`);

    //инитим громкость
    const VolumeInst = getVolumeInst();

    //инициализируем контроллер управления эффектами
    const EffectsController = new Effects({
        VolumeInst,
        effects: effectsJSON.effects
    });

    //инитим управление громкостью
    const VolumeControllerInst = getVolumeControllerInst({
        VolumeInst,
        EffectsController
    });

    //воспроизводим эффекты, которые должны быть проиграны сразу после загрузки
    $('[data-play-on-load]').each((index, item) => {
        EffectsController.play($(item).data('effect-target'));
    });

    //todo: инициализировать громкость; на volume.global = ..., etc.

    /**
     * ловим события с iframe и реагируем на них,
     * в данном случае только касательно громкости
     */
    window.addEventListener('message', (e) => {
        const eventName = e.data[0];
        const data = e.data[1];

        if (eventName === 'volumeGlobalChange') {
            VolumeControllerInst.setGlobal({volume: data});
        } else if (eventName === 'volumeHintsChange') {
            VolumeControllerInst.setHints({volume: data});
        } else if (eventName === 'volumeBgChange') {
            VolumeControllerInst.setLoops({volume: data});
        }
    });
}