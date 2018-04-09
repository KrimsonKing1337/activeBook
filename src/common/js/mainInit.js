import {browserCheck} from './browserCheck';
import getDOMSelectors from './modules/GetDOMSelectors';
import {loadStates} from './loadStates';
import 'jquery-touch-events';
import {hoverInit} from './hoverInit';
import {effectsTextAndMenuInit} from './effectsTextAndMenuInit';

export async function mainInit() {
    if (browserCheck() === false) return;

    const DOMSelectors = getDOMSelectors();
    const $body = $('body');
    const $menu = $(DOMSelectors.menu);
    const $menuHTML = $menu.html();

    let EffectsController = await effectsTextAndMenuInit(0);

    //событие перехода на другую страницу
    $(window).on('changePage', async (e, pageNum) => {
        $body.addClass('loading');

        EffectsController.stopAll({
            target: 'all',
            unload: true
        });

        $menu.html($menuHTML); //иначе все события начинают задваиваться

        EffectsController = await effectsTextAndMenuInit(pageNum);

        $body.removeClass('loading');
    });


    $body.removeClass('loading');

    //стрелка вперёд = след. страница,
    //стрелка назад = пред. страница
    $(document).on('keydown', (e) => {
        if (e.which === 37) {
            $('.js-page-prev').trigger('click');
        } else if (e.which === 39) {
            $('.js-page-next').trigger('click');
        } else if (e.which === 38 || e.which === 40) {

        }
    });

    $(DOMSelectors.page).swiperight(() => {
        $('.js-page-prev').trigger('click');
    });

    $(DOMSelectors.page).swipeleft(() => {
        $('.js-page-next').trigger('click');
    });

    hoverInit([
        $(DOMSelectors.action),
        $(DOMSelectors.svgWrapper),
        $(DOMSelectors.volumeGlobal),
        $(DOMSelectors.volumeOneShots),
        $(DOMSelectors.volumeLoops),
        $('.js-bookmark-create'),
        $('.js-bookmark-item'),
        $('.js-bookmark-remove'),
        $('.js-table-of-contents-show'),
        $('.js-theme-option'),
        $('.js-vibration-option'),
        $('.js-line-height-minus'),
        $('.js-line-height-plus')
    ]);

    //загружаем значения настроек
    loadStates();

    //add content init
    $(DOMSelectors.addContentClose).on('click', () => {
        $(DOMSelectors.addContent).fadeOut();
    });

    $(DOMSelectors.addContentFullSize).on('click', () => {
        const children = $(DOMSelectors.addContentInner).children();

        let src;
        const video = children.filter('video');
        const img = children.filter('img');

        if (img.length > 0) {
            src = img.attr('src');
        }

        //todo: video

        $(DOMSelectors.addContentClose).trigger('click');

        window.open(`${window.location.origin}/${src}`, '_blank');
    });

    $(DOMSelectors.text).focus();
}