import {pageInfo} from './pageInfo';
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
    const pageCurJSON = await getAJAX(`/page-0.json`);
    const pagesJSON = await getAJAX(`/pages.json`);

    const pagesInfo = pagesJSON.pagesInfo;
    const pageCurInfo = pageCurJSON.pageInfo;
    const pagesCurEffects = pageCurJSON.effects;

    pageInfo.set({
        pageCurNum: pageCurInfo.num,
        pagesLength: pagesInfo.length
    });

    $(DOMSelectors.textWrapper).html(textAJAX);

    visibilityChangeInit();

    menuInit();

    //загружаем значения настроек
    loadStates();

    textInit(EffectsController);

    EffectsController.setEffects(pagesCurEffects);

    playOnLoad(pagesCurEffects);

    if (pageInfo.pageCurNum === 0) {
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
        const pageCurJSON = await getAJAX(`/page-${pageNum}.json`);

        const pageCurInfo = pageCurJSON.pageInfo;
        const pagesCurEffects = pageCurJSON.effects;

        pageInfo.set({
            pageCurNum: pageCurInfo.num
        });

        //запоминаем последнюю открытую страницу
        LocalStorage.write({key: 'lastOpenedPage', val: pageInfo.pageCurNum});

        $(DOMSelectors.textWrapper).html(textAJAX);

        EffectsController.setEffects(pagesCurEffects);

        //устанавливаем плейсхолдеры для input-ов
        $('.js-page-number').text(`${pageInfo.pageCurNum} из ${pageInfo.pagesLength}`);
        $('.js-page-input').attr('placeholder', pageInfo.pageCurNum);

        playOnLoad(pagesCurEffects);

        textInit(EffectsController);

        if (pageInfo.pageCurNum === 0) {
            $(DOMSelectors.menu).addClass('hide');
        } else {
            $(DOMSelectors.menu).removeClass('hide');
        }

        $body.removeClass('loading');

        $(DOMSelectors.textWrapper)
            .scrollTop(0)
            .focus();
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

    $body.removeClass('initing');
    $body.css('opacity', 1);

    $(DOMSelectors.textWrapper).focus();
});