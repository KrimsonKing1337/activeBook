import {pageInfo} from './forAppInit/pageInfo';
import {menuInit} from './menu/menuInit';
import {browserCheck} from './forAppInit/browserCheck';
import getDOMSelectors from './helpers/GetDOMSelectors';
import {getAJAX} from './helpers/getAJAX';
import {effectsInst} from './effects/Effects';
import {loadStates} from './states/loadStates';
import {playOnLoad} from './effects/playOnLoad';
import {hoverTouchUnstick} from './events/hoverTouchUnstick';
import 'jquery-touch-events';
import './forAppInit/animateCss';
import {visibilityChangeInit} from './events/visibilityChangeInit';
import LocalStorage from './states/LocalStorage';
import {
  keyboardArrowsInit,
  swipesInit,
  accessoriesForModalContentInit,
  orientationChangeForGalleryInit,
  actionTextInit,
  disableZoomApple
} from './events/commonEvents';
import {firstOpenCheck} from './forAppInit/firstOpenCheck';
import {CssVariables} from './helpers/CssVariables';
import {getScrollBarWidth} from './scroll/getScrollBarWidth';
import {scrollbarDestroy, scrollbarInitAll, showHideScrollbarTouchEventsFix} from './scroll/scrollbarInit';
import {getIsMobile} from './helpers/getIsMobile';
import {getRootApp} from './helpers/getRootApp';
import {modifyPathForPagesCurEffects} from './effects/modifyPathForPagesCurEffects';
import {ModalContent} from './modalContent/ModalContent';
import {getInvertColorsPagesRange, invertColorsByPageNumber} from './effects/invertColors';
import {checkAllAudiosWithRange} from './effects/audioWithRange';
import {lastOpenedPageInst} from './states/lastOpenedPage';
import {GoToPageBtn} from './events/GoToPageBtn.js';
import {httpsCheck} from './forAppInit/httpsCheck.js';

async function onReady(rootApp) {
  if (httpsCheck() === false) return;
  if (browserCheck() === false) return;

  firstOpenCheck();

  const DOMSelectors = getDOMSelectors();
  const $body = $('body');

  const textAJAX = await getAJAX(`${rootApp}/page-0.html`);
  const pageCurJSON = await getAJAX(`${rootApp}/page-0.json`, 'json');
  const pagesJSON = await getAJAX(`${rootApp}/pages.json`, 'json');

  const pagesInfo = pagesJSON.info;
  const pagesEffects = modifyPathForPagesCurEffects(pagesJSON.effects, rootApp);
  const pageCurInfo = pageCurJSON.pageInfo;
  const pageCurEffects = modifyPathForPagesCurEffects(pageCurJSON.effects, rootApp);
  const invertColorPagesRange = getInvertColorsPagesRange(pagesEffects);

  LocalStorage.write({key: 'pageCurEffects', val: pageCurEffects});
  LocalStorage.write({key: 'pagesEffects', val: pagesEffects});

  pageInfo.set({
    pageCurNum: pageCurInfo.num,
    pagesLength: pagesInfo.length
  });

  $(DOMSelectors.textWrapper).html(textAJAX);

  const EffectsController = await effectsInst();

  /**
   *
   * инициализируем здесь, потому что до этого момента
   * $('.go-to-page') не существует
   */
  const goToPageBtnInst = await new GoToPageBtn();

  //определяем поддерживает ли устройство тач
  $(DOMSelectors.page).attr('data-touch-device', 'ontouchstart' in window);

  visibilityChangeInit();

  //загружаем значения настроек
  loadStates();

  actionTextInit();

  swipesInit();

  await EffectsController.setEffects(pageCurEffects);

  await scrollbarInitAll();

  showHideScrollbarTouchEventsFix();

  playOnLoad(pageCurEffects);

  goToPageBtnInst.init();

  menuInit();

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

    //обнуляем таймеры
    EffectsController.clearTimersAll();

    const textAJAX = await getAJAX(`${rootApp}/page-${pageNum}.html`);
    const pageCurJSON = await getAJAX(`${rootApp}/page-${pageNum}.json`, 'json');

    const pageCurInfo = pageCurJSON.pageInfo;
    const pageCurEffects = modifyPathForPagesCurEffects(pageCurJSON.effects, rootApp);

    LocalStorage.write({key: 'pageCurEffects', val: pageCurEffects});

    pageInfo.set({
      pageCurNum: pageCurInfo.num
    });

    checkAllAudiosWithRange(pageCurInfo.num, pagesEffects);

    if (invertColorPagesRange !== false) {
      invertColorsByPageNumber(pageCurInfo.num, invertColorPagesRange);
    }

    // запоминаем, где пользователь оставился в прошлый раз
    LocalStorage.write({key: 'pageForResumeReading', val: pageInfo.pageCurNum});

    // запоминаем последнюю открытую страницу
    lastOpenedPageInst.save(pageInfo.pageCurNum);

    $(DOMSelectors.textWrapper).html(textAJAX);

    await EffectsController.setEffects(pageCurEffects);

    await scrollbarInitAll();

    if (pageInfo.pageCurNum === 'credits' || pageInfo.pageCurNum === 0) {
      $(DOMSelectors.menu).addClass('hide');
    } else {
      $(DOMSelectors.menu).removeClass('hide');

      //устанавливаем плейсхолдеры для input-ов
      $('.js-page-number').text(`${pageInfo.pageCurNum} из ${pageInfo.pagesLength}`);
      $('.js-page-input').attr('placeholder', pageInfo.pageCurNum);
    }

    playOnLoad(pageCurEffects);

    actionTextInit();

    goToPageBtnInst.init();

    $body.removeClass('loading');
  });

  keyboardArrowsInit();
  accessoriesForModalContentInit();
  orientationChangeForGalleryInit();
  disableZoomApple();
  hoverTouchUnstick();

  CssVariables.set('--main-content-height', `${window.innerHeight}px`);
  CssVariables.set('--scrollbar-width', `${getScrollBarWidth()}px`);

  $body.removeClass('initing');
  $body.css('opacity', 1);
}

$(document).ready(() => {
  const isMobile = getIsMobile();

  if (!isMobile) {
    onReady(getRootApp());
  } else {
    document.addEventListener('deviceready', () => {
      onReady(getRootApp());
    }, false);
  }
});
