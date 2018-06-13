import {pageInfo} from './pageInfo';
import {menuInit} from './menuInit';
import {browserCheck} from './browserCheck';
import getDOMSelectors from './GetDOMSelectors';
import {getAJAX} from './getAJAX';
import {EffectsController} from './Effects';
import {textInit} from './textInit';
import {loadStates} from './loadStates';
import {playOnLoad} from './playOnLoad';
import {hoverTouchUnstick} from './hoverTouchUnstick';
import 'jquery-touch-events';
import './animateCss';
import {visibilityChangeInit} from './visibilityChangeInit';
import LocalStorage from './LocalStorage';
import {goToPageBtnInit} from './goToPageBtnInit';
import {keyboardArrowsInit, accessoriesForModalContentInit, orientationChangeForGalleryInit} from './commonEvents';
import {firstOpenCheck} from './firstOpenCheck';
import {CssVariables} from './CssVariables';
import {getScrollBarWidth} from './getScrollBarWidth';
import {scrollbarDestroy, scrollbarInitAll, showHideScrollbarTouchEventsFix} from './scrollbarInit';
import {getIsMobile} from './getIsMobile';
import {getRootApp} from './getRootApp';
import {modifyPathForPagesCurEffects} from './modifyPathForPagesCurEffects';
import {swipesInit} from './swipesInit';
import {ModalContent} from './ModalContent';
import {invertColorsByPageNumber} from './invertColorsByPageNumber';

async function onReady(rootApp) {
    if (browserCheck() === false) return;

    firstOpenCheck();

    const DOMSelectors = getDOMSelectors();
    const $body = $('body');

    const textAJAX = await getAJAX(`${rootApp}/page-0.html`);
    const pageCurJSON = await getAJAX(`${rootApp}/page-0.json`, 'json');
    const pagesJSON = await getAJAX(`${rootApp}/pages.json`, 'json');

    const pagesInfo = pagesJSON.pagesInfo;
    const pageCurInfo = pageCurJSON.pageInfo;
    const pagesCurEffects = modifyPathForPagesCurEffects(pageCurJSON.effects, rootApp);

    pageInfo.set({
        pageCurNum: pageCurInfo.num,
        pagesLength: pagesInfo.length
    });

    $(DOMSelectors.textWrapper).html(textAJAX);

    //определяем поддерживает ли устройство тач
    $(DOMSelectors.page).attr('data-touch-device', 'ontouchstart' in window);

    visibilityChangeInit();

    menuInit();

    //загружаем значения настроек
    loadStates();

    textInit(EffectsController);

    swipesInit();

    EffectsController.setEffects(pagesCurEffects);

    await scrollbarInitAll();

    showHideScrollbarTouchEventsFix();

    playOnLoad(pagesCurEffects);

    goToPageBtnInit();

    if (pageInfo.pageCurNum === 0) {
        $(DOMSelectors.menu).addClass('hide');
    } else {
        $(DOMSelectors.menu).removeClass('hide');
    }

    //событие перехода на другую страницу
    $(window).on('changePage', async (e, pageNum) => {
        /**
         * деструктор модалки должен идти перед навешиванием на body класса loading,
         * иначе не выполняется animateCss('fadeOut'),
         * а значит и промис тоже не резолвится
         */
        await ModalContent.destroyAll();

        $body.addClass('loading');

        scrollbarDestroy();

        EffectsController.stopAll({
            target: 'all',
            unload: true
        });

        const textAJAX = await getAJAX(`${rootApp}/page-${pageNum}.html`);
        const pageCurJSON = await getAJAX(`${rootApp}/page-${pageNum}.json`, 'json');

        const pageCurInfo = pageCurJSON.pageInfo;
        const pagesCurEffects = modifyPathForPagesCurEffects(pageCurJSON.effects, rootApp);

        pageInfo.set({
            pageCurNum: pageCurInfo.num
        });

        invertColorsByPageNumber(pageCurInfo.num, 30);

        //запоминаем последнюю открытую страницу
        LocalStorage.write({key: 'lastOpenedPage', val: pageInfo.pageCurNum});

        $(DOMSelectors.textWrapper).html(textAJAX);

        EffectsController.setEffects(pagesCurEffects);

        await scrollbarInitAll();

        if (pageInfo.pageCurNum === 'credits' || pageInfo.pageCurNum === 0) {
            $(DOMSelectors.menu).addClass('hide');
        } else {
            $(DOMSelectors.menu).removeClass('hide');

            //устанавливаем плейсхолдеры для input-ов
            $('.js-page-number').text(`${pageInfo.pageCurNum} из ${pageInfo.pagesLength}`);
            $('.js-page-input').attr('placeholder', pageInfo.pageCurNum);
        }

        playOnLoad(pagesCurEffects);

        textInit(EffectsController);

        goToPageBtnInit();

        $body.removeClass('loading');
    });

    keyboardArrowsInit();
    accessoriesForModalContentInit();
    orientationChangeForGalleryInit();

    //убираем зум на apple устройствах
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });

    hoverTouchUnstick();

    CssVariables.set('--main-content-height', `${window.innerHeight}px`);
    CssVariables.set('--scrollbar-width', `${getScrollBarWidth()}px`);

    $body.removeClass('initing');
    $body.css('opacity', 1);
}

$(document).ready(() => {
    const isMobile = getIsMobile();

    if (!isMobile) {
        const rootApp = getRootApp();

        onReady(rootApp);
    } else {
        document.addEventListener('deviceready', () => {
            const rootApp = getRootApp();

            onReady(rootApp);
        }, false);
    }
});