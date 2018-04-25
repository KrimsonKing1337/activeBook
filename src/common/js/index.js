import {pageInfo} from './PageInfo';
import {menuInit} from './menuInit';
import {browserCheck} from './browserCheck';
import getDOMSelectors from './modules/GetDOMSelectors';
import {getAJAX} from './getAJAX';
import {EffectsController} from './modules/Effects';
import {textInit} from './textInit';
import {loadStates} from './loadStates';
import {playOnLoad} from './playOnLoad';
import {hoverTouchUnstick} from './hoverTouchUnstick';
import 'jquery-touch-events';
import './animateCss';
import {visibilityChangeInit} from './visibilityChangeInit';
import LocalStorage from './modules/LocalStorage';
import {startReadingBtnInit} from './startReadingBtnInit';
import {changePageByKeyboardAndSwipesInit} from './changePageByKeyboardAndSwipesInit';
import {firstOpenCheck} from './firstOpenCheck';
import {addContentInit} from './addContentInit';

$(window).on('load', async () => {
    if (browserCheck() === false) return;

    firstOpenCheck();

    const DOMSelectors = getDOMSelectors();
    const $body = $('body');

    const textAJAX = await getAJAX(`/page-0.html`);
    const dataJSON = await getAJAX(`/page-0.json`);

    pageInfo.set(dataJSON.pageInfo);

    $('.text-wrapper').html(textAJAX);

    visibilityChangeInit();

    menuInit();

    //загружаем значения настроек
    loadStates();

    textInit(EffectsController);

    EffectsController.setEffects(dataJSON.effects);

    playOnLoad(dataJSON.effects);

    if (dataJSON.pageInfo.current === 0) {
        $(DOMSelectors.menu).addClass('hide');
    } else {
        $(DOMSelectors.menu).removeClass('hide');
    }

    //событие перехода на другую страницу
    $(window).on('changePage', async (e, pageNum) => {
        $body.addClass('loading');

        EffectsController.stopAll({
            target: 'all',
            unload: true
        });

        const textAJAX = await getAJAX(`/page-${pageNum}.html`);
        const dataJSON = await getAJAX(`/page-${pageNum}.json`);

        pageInfo.set(dataJSON.pageInfo);

        //запоминаем последнюю открытую страницу
        LocalStorage.write({key: 'lastOpenedPage', val: pageInfo.get().current});

        $('.text-wrapper').html(textAJAX);

        EffectsController.setEffects(dataJSON.effects);

        //устанавливаем плейсхолдеры для input-ов
        $('.js-page-number').text(`${pageInfo.get().current} из ${pageInfo.get().length}`);
        $('.js-page-input').attr('placeholder', pageInfo.get().current);

        playOnLoad(dataJSON.effects);

        textInit(EffectsController);

        window.scrollTo(0, 0);

        if (dataJSON.pageInfo.current === 0) {
            $(DOMSelectors.menu).addClass('hide');
        } else {
            $(DOMSelectors.menu).removeClass('hide');
        }

        $body.removeClass('loading');
    });

    changePageByKeyboardAndSwipesInit();

    //убираем зум на apple устройствах
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });

    hoverTouchUnstick();

    //add content init
    addContentInit();

    startReadingBtnInit();

    $body.removeClass('loading');

    $(DOMSelectors.text).focus();
});