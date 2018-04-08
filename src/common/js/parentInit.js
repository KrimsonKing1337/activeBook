import {Effects} from './modules/Effects';
import {getVolumeInst} from './getVolumeInst';
import {getVolumeControllerInst} from './getVolumeControllerInst';
import {getJSON} from './getJSON';
import filter from 'lodash-es/filter';

export async function parentInit() {
    const iframe = $('iframe')[0];
    const $bodyParent = $('body#parent');

    document.title = iframe.contentDocument.title;

    let page = $(iframe.contentDocument).find('body#child').data('page');

    let effectsJSON = await getJSON(`/${page}.json`);

    //todo: инициализировать всё только в родительском окне, в iframe только сообщать события

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

    //событие перехода на другую страницу
    $(iframe).on('load', async () => {
        EffectsController.stopAll({
            target: 'all',
            unload: true
        });

        page = $(iframe.contentDocument).find('body#child').data('page');

        effectsJSON = await getJSON(`/${page}.json`);

        //todo: не инитить заново всё, что ниже. подменять только effectsJSON

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

        $bodyParent.removeClass('loading');

        setTimeout(() => {
            $(iframe.contentDocument).focus();
            $(iframe.contentWindow).focus();
        }, 100);
    });


    $bodyParent.removeClass('loading');

    setTimeout(() => {
        $(iframe.contentDocument).focus();
        $(iframe.contentWindow).focus();
    }, 100);

    /**
     * ловим события с iframe и реагируем на них,
     * в данном случае только касательно громкости
     */
    window.addEventListener('message', (e) => {
        const eventName = e.data[0];
        const data = e.data[1];

        if (eventName === 'volumeGlobalChange') {
            VolumeControllerInst.setGlobal({volume: data});
        } else if (eventName === 'volumeOneShotsChange') {
            VolumeControllerInst.setOneShots({volume: data});
        } else if (eventName === 'volumeBgChange') {
            VolumeControllerInst.setLoops({volume: data});
        } else if (eventName === 'actionTextClick') {
            EffectsController.play(data);
        } else if (eventName === 'load') {
            $bodyParent.removeClass('loading');
        } else if (eventName === 'unload') {
            $bodyParent.addClass('loading');
        } else if (eventName === 'saveStates') {
            iframe.contentWindow.postMessage(['saveStates', VolumeInst], '*');
        }
    });
}