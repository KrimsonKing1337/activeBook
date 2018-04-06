import getDOMSelectors from './modules/GetDOMSelectors';
import Page from './modules/Page';
import Popover from './modules/Popover';
import {LineHeight, FontSize, GoToPage, Theme, Vibration} from './modules/Menu';
import {Effects} from './modules/Effects';
import {browserCheck} from './browserCheck';
import {mCustomScrollbarInit} from './mCustomScrollbarInit';
import {ionRangeSliderInit} from './ionRangeSliderInit';
import {svgInit} from './svgInit';
import {saveStates} from './saveStates';
import {loadStates} from './loadStates';
import {getVolumeInst} from './getVolumeInst';
import {getVolumeControllerInst} from './getVolumeControllerInst';
import {outsideInit} from './outsideInit';
import {getJSON} from "./getJSON";

$(window).on('load', async () => {
    const $body = $('body');

    if ($body.data('type') === 'outside') {
        /**
         * scripts for outside here
         */
        outsideInit();

        return;
    }

    if (browserCheck() === false) return;

    const DOMSelectors = getDOMSelectors();
    const page = Page.getParams();

    mCustomScrollbarInit();

    ionRangeSliderInit();

    svgInit();

    //отображаем доп. меню для элементов с поповером
    /**
     *
     * для того, чтобы можно было использовать методы экземляра класса,
     * записываем каждый экземпляр поповера в переменную
     */
    const bookmarkPopover = new Popover({
        $popover: $(DOMSelectors.bookmark).find(DOMSelectors.addSettings),
        $triggerButton: $(DOMSelectors.bookmark).find(DOMSelectors.svgWrapper)
    });

    const volumePopover = new Popover({
        $popover: $(DOMSelectors.volume).find(DOMSelectors.addSettings),
        $triggerButton: $(DOMSelectors.volume).find(DOMSelectors.svgWrapper)
    });

    const etcPopover = new Popover({
        $popover: $(DOMSelectors.etc).find(DOMSelectors.addSettings),
        $triggerButton: $(DOMSelectors.etc).find(DOMSelectors.svgWrapper)
    });

    //переключалка для вибрации
    //todo: если включаем - то давать короткую вибрацию
    $(DOMSelectors.vibrationOption).on('click', function () {
        Vibration.set({
            $page: $(DOMSelectors.page),
            val: $(this).attr('data-vibration'),
            $vibrationOption: $(DOMSelectors.vibrationOption)
        });
    });

    //переключалка темы оформления
    $(DOMSelectors.themeOption).on('click', function () {
        Theme.set({
            $page: $(DOMSelectors.page),
            val: $(this).attr('data-theme'),
            $themeOption: $(DOMSelectors.themeOption)
        });
    });

    //оглавление
    $(DOMSelectors.tableOfContentsShow).on('click', function () {
        $(DOMSelectors.text).hide();
        $(DOMSelectors.tableOfContents).show();
        Popover.close({
            $triggerButton: $(this).closest('.menu__item'),
            $popover: $(this).closest(DOMSelectors.addSettings)
        });
    });

    $('.js-table-of-contents-close').on('click', () => {
        $(DOMSelectors.tableOfContents).hide();
        $(DOMSelectors.text).show();
    });

    //клик по элементу оглавления (главе)
    $('.table-of-contents__item').on('click', function () {
        const newVal = $.trim($(this).find('.table-of-contents__item__page').text());

        GoToPage.goWithDirection({
            currentPage: page.current,
            pagesLength: page.length,
            direction: Math.abs(parseInt(newVal))
        });
    });

    //меняем межстрочный интервал
    $('.js-line-height-minus').on('click', () => {
        LineHeight.setByDirection({
            $val: $(DOMSelectors.lineHeightVal),
            direction: 'less',
            $text: $(DOMSelectors.text)
        });
    });

    $('.js-line-height-plus').on('click', () => {
        LineHeight.setByDirection({
            $val: $(DOMSelectors.lineHeightVal),
            direction: 'more',
            $text: $(DOMSelectors.text)
        });
    });

    //меняем страницу
    $('.js-page-next').on('click', () => {
        GoToPage.goWithDirection({currentPage: page.current, pagesLength: page.length, direction: 'next'});
    });

    $('.js-page-prev').on('click', () => {
        GoToPage.goWithDirection({currentPage: page.current, pagesLength: page.length, direction: 'prev'});
    });

    $('.js-go-to-page-by-number').on('click', (e) => {
        e.stopPropagation();
    });

    $('.js-page-input').on('keypress', (e) => {
        if (e.which === 13) {
            $('.js-go-to-page-trigger').trigger('click');
        }
    });

    $('.js-go-to-page-trigger').on('click', () => {
        const $input = $('.js-page-input');
        const pattern = $input.attr('pattern');
        const newVal = $input.val();

        if (newVal.length === 0) return;

        //only numbers allows
        if (new RegExp(`^${ pattern }+$`).test(newVal) === false) {
            $input.parent().addClass('error');
            $input.val('');

            $input.one('keydown', () => {
                $input.parent().removeClass('error');
            });

            return;
        }

        GoToPage.goWithDirection({
            currentPage: page.current,
            pagesLength: page.length,
            direction: Math.abs(parseInt(newVal))
        });
    });

    $('.js-page-number').find('input').on('focus', () => {
        $('.js-go-to-page-by-arrows').removeClass('active');
        $('.js-go-to-page-by-number').addClass('active');

        $('.js-page-input').focus();

        $(document).one('click', () => {
            $('.js-go-to-page-by-number').removeClass('active');
            $('.js-go-to-page-by-arrows').addClass('active');
        });
    });

    //меняем размер шрифта
    $('.js-font-size-down').on('click', () => {
        FontSize.setByDirection({$text: $(DOMSelectors.text), direction: 'less'});
    });

    $('.js-font-size-up').on('click', () => {
        FontSize.setByDirection({$text: $(DOMSelectors.text), direction: 'more'});
    });

    const effectsJSON = await getJSON(`/page-${page.current}.json`);

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

    //action text click event
    $('[data-effect-target]').on('click', function (e) {
        e.preventDefault();

        EffectsController.play($(this).data('effect-target'));
    });

    //событие изменения положения ползунка глобальной громкости
    $(DOMSelectors.volumeGlobal).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setGlobal({volume});

        window.parent.postMessage(['volumeGlobalChange', volume], '*');
    });

    //событие изменения положения ползунка громкости подсказок (звуков в тексте)
    $(DOMSelectors.volumeOneShots).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setOneShots({volume});

        window.parent.postMessage(['volumeOneShotsChange', volume], '*');
    });

    //событие изменения положения ползунка громкости фоновых звуков
    $(DOMSelectors.volumeBg).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setLoops({volume});

        window.parent.postMessage(['volumeBgChange', volume], '*');
    });

    //переходим по закладке
    $('.js-bookmark-item').on('click', function () {
        const page = $(this).find('.js-bookmark-page').text().trim();

        GoToPage.go({val: page});
    });

    //создаём закладку
    $('.js-bookmark-create').on('click', () => {
        const $newBookmark = $('.js-bookmark-item.template').clone(true).removeClass('template');
        const dateNow = new Date();
        const dayNow = dateNow.getDate();
        let monthNow = (dateNow.getMonth() + 1);
        if (monthNow < 10) monthNow = `0${ monthNow}`;
        const yearNow = dateNow.getFullYear().toString().substring(2);
        const parseDate = `${dayNow }/${ monthNow }/${ yearNow}`;
        const pageNumber = Page.getParams().current;

        $newBookmark.find('.js-bookmark-date').text(parseDate);
        $newBookmark.find('.js-bookmark-page').text(pageNumber);

        $('.js-bookmarks-list').append($newBookmark);

        bookmarkPopover.positioning();
    });

    //удаляем закладку
    $('.js-bookmark-remove').on('click', function (e) {
        e.stopPropagation();

        $(this).closest('.js-bookmark-item').remove();

        bookmarkPopover.positioning();
    });

    //сохраняем значения настроек
    $(window).on('unload', () => {
        window.parent.postMessage(['unload', true], '*');

        saveStates(VolumeInst);
    });

    //загружаем значения настроек
    loadStates();

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

        window.location.href = src;
    });
});