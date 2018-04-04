import {Effects} from './modules/Effects';
import {getVolumeInst} from './getVolumeInst';
import {getVolumeControllerInst} from './getVolumeControllerInst';
import {getJSON} from './getJSON';
import filter from 'lodash-es/filter';

export async function outsideInit() {
    const iframe = $('iframe')[0];

    document.title = iframe.contentDocument.title;

    let page = $(iframe.contentDocument).find('body#inside').data('page');

    let effectsJSON = await getJSON(`/${page}.json`);

    //инитим громкость
    let VolumeInst = getVolumeInst();

    //инициализируем контроллер управления эффектами
    let EffectsController = new Effects({
        VolumeInst,
        effects: effectsJSON.effects
    });

    //инитим управление громкостью
    let VolumeControllerInst = getVolumeControllerInst({
        VolumeInst,
        EffectsController
    });

    //воспроизводим эффекты, которые должны быть проиграны сразу после загрузки
    const playOnLoadEffects = filter(effectsJSON.effects, 'playOnLoad');

    if (playOnLoadEffects.length > 0) {
        playOnLoadEffects.forEach((playOnLoadEffectCur) => {
            EffectsController.play(playOnLoadEffectCur.id);
        });
    }

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
        } else if (eventName === 'load') {
            $('body#outside').removeClass('loading');
        } else if (eventName === 'unload') {
            $('body#outside').addClass('loading');
        }
    });

    //событие перехода на другую страницу
    $(iframe).on('load', async () => {
        EffectsController.stopAll('loops');

        page = $(iframe.contentDocument).find('body#inside').data('page');

        effectsJSON = await getJSON(`/${page}.json`);

        //инитим громкость
        VolumeInst = getVolumeInst();

        //инициализируем контроллер управления эффектами
        EffectsController = new Effects({
            VolumeInst,
            effects: effectsJSON.effects
        });

        //инитим управление громкостью
        VolumeControllerInst = getVolumeControllerInst({
            VolumeInst,
            EffectsController
        });

        //воспроизводим эффекты, которые должны быть проиграны сразу после загрузки
        const playOnLoadEffects = filter(effectsJSON.effects, 'playOnLoad');

        if (playOnLoadEffects.length > 0) {
            playOnLoadEffects.forEach((playOnLoadEffectCur) => {
                EffectsController.play(playOnLoadEffectCur.id);
            });
        }

        $('body#outside').removeClass('loading');
    });

    $('body#outside').removeClass('loading');
}