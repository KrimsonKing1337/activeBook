import {FontSize, GoToPage, LineHeight, Theme, Vibration} from './modules/Menu';
import Popover from './modules/Popover';
import {svgInit} from './svgInit';
import {ionRangeSliderInit} from './ionRangeSliderInit';
import getDOMSelectors from './modules/GetDOMSelectors';
import {saveStates} from './saveStates';
import {pageInfo} from './pageInfo';
import {VibrationEffects} from './modules/Effects';

/**
 *
 * @param VolumeInst {object}
 * @param VolumeControllerInst {object}
 */
export function menuInit({VolumeInst, VolumeControllerInst} = {}) {
    const DOMSelectors = getDOMSelectors();

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

    /*const volumePopover = new Popover({
        $popover: $(DOMSelectors.volume).find(DOMSelectors.addSettings),
        $triggerButton: $(DOMSelectors.volume).find(DOMSelectors.svgWrapper)
    });

    const etcPopover = new Popover({
        $popover: $(DOMSelectors.etc).find(DOMSelectors.addSettings),
        $triggerButton: $(DOMSelectors.etc).find(DOMSelectors.svgWrapper)
    });*/


    $(DOMSelectors.etc).on('click', () => {
        $(DOMSelectors.menuFullScreen).addClass('active');
        $(DOMSelectors.menuFullScreenInner).animateCss('fadeInDown');
    });

    $('.js-menu-full-screen-close').on('click', () => {
        $(DOMSelectors.menuFullScreenInner).animateCss('fadeOutUp', () => {
            $(DOMSelectors.menuFullScreen)[0].scrollTop = 0;
            $(DOMSelectors.menuFullScreen).removeClass('active');
        });
    });

    if (!VibrationEffects.vibrationSupport()) {
        $('.menu-full-screen__vibration').remove();
    } else {
        //переключалка для вибрации
        $(DOMSelectors.vibrationOption).on('click', function () {
            const val = $(this).data('vibration');

            if (val === true) {
                navigator.vibrate(150);
            }

            Vibration.set({
                $target: $(DOMSelectors.page),
                val,
                $vibrationOption: $(DOMSelectors.vibrationOption)
            });

            saveStates(VolumeInst);
        });
    }

    //переключалка темы оформления
    $(DOMSelectors.themeOption).on('click', function () {
        Theme.set({
            $target: $(DOMSelectors.page),
            val: $(this).attr('data-theme'),
            $themeOption: $(DOMSelectors.themeOption)
        });

        saveStates(VolumeInst);
    });

    //оглавление
    $(DOMSelectors.tableOfContentsShow).on('click', function () {
        $(DOMSelectors.menuFullScreen).removeClass('active');
        $(DOMSelectors.tableOfContents).addClass('active');
        $(DOMSelectors.tableOfContents).animateCss('fadeIn');
        $(DOMSelectors.text).addClass('hide');

        Popover.close({
            $triggerButton: $(this).closest('.menu__item'),
            $popover: $(this).closest(DOMSelectors.addSettings)
        });
    });

    $('.js-table-of-contents-close').on('click', () => {
        $(DOMSelectors.tableOfContents).animateCss('fadeOutUp', () => {
            $(DOMSelectors.tableOfContents).removeClass('active');
            $(DOMSelectors.tableOfContents)[0].scrollTop = 0;
        });
        $(DOMSelectors.text).removeClass('hide');
    });

    //клик по элементу оглавления (главе)
    $('.table-of-contents__item').on('click', function () {
        const newVal = $.trim($(this).find('.table-of-contents__item__page').text());

        $('.js-table-of-contents-close').trigger('click');

        GoToPage.goWithDirection({
            currentPage: pageInfo().current,
            pagesLength: pageInfo().length,
            direction: Math.abs(parseInt(newVal))
        });
    });

    //меняем межстрочный интервал
    $('.js-line-height-minus').on('click', () => {
        LineHeight.setByDirection({
            $val: $(DOMSelectors.lineHeightVal),
            direction: 'less',
            $target: $(DOMSelectors.page)
        });

        saveStates(VolumeInst);
    });

    $('.js-line-height-plus').on('click', () => {
        LineHeight.setByDirection({
            $val: $(DOMSelectors.lineHeightVal),
            direction: 'more',
            $target: $(DOMSelectors.page)
        });

        saveStates(VolumeInst);
    });

    //устанавливаем плейсхолдеры для input-ов
    $('.js-page-number').find('input').attr('placeholder', `${pageInfo().current} из ${pageInfo().length}`);
    $('.js-page-input').attr('placeholder', pageInfo().current);

    //меняем страницу
    $('.js-page-next').on('click', () => {
        GoToPage.goWithDirection({
            currentPage: pageInfo().current,
            pagesLength: pageInfo().length,
            direction: 'next'
        });
    });

    $('.js-page-prev').on('click', () => {
        GoToPage.goWithDirection({
            currentPage: pageInfo().current,
            pagesLength: pageInfo().length,
            direction: 'prev'
        });
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
            currentPage: pageInfo().current,
            pagesLength: pageInfo().length,
            direction: Math.abs(parseInt(newVal))
        });

        $input.val('');

        setTimeout(() => {
            $(document).trigger('click');
        }, 0);
    });

    $('.js-page-number').find('input').on('focus', () => {
        $('.js-go-to-page-by-arrows').removeClass('active');
        $('.js-go-to-page-by-number').addClass('active');

        $('.js-page-input').focus();

        setTimeout(() => {
            $(document).one('click, touchstart', () => {
                $('.js-go-to-page-by-number').removeClass('active');
                $('.js-go-to-page-by-arrows').addClass('active');
            });
        }, 0);
    });

    $('.js-page-input').on('blur', () => {
        $('.js-go-to-page-by-number').removeClass('active');
        $('.js-go-to-page-by-arrows').addClass('active');
    });

    //меняем размер шрифта
    $('.js-font-size-down').on('click', () => {
        FontSize.setByDirection({
            $target: $(DOMSelectors.page),
            direction: 'less'
        });

        saveStates(VolumeInst);
    });

    $('.js-font-size-up').on('click', () => {
        FontSize.setByDirection({
            $target: $(DOMSelectors.page),
            direction: 'more'
        });

        saveStates(VolumeInst);
    });

    //событие изменения положения ползунка глобальной громкости
    $(DOMSelectors.volumeGlobal).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setGlobal({volume});
        saveStates(VolumeInst);
    });

    //событие изменения положения ползунка громкости подсказок (звуков в тексте)
    $(DOMSelectors.volumeOneShots).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setOneShots({volume});
        saveStates(VolumeInst);
    });

    //событие изменения положения ползунка громкости фоновых звуков
    $(DOMSelectors.volumeLoops).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setLoops({volume});
        saveStates(VolumeInst);
    });

    //переходим по закладке
    $('.js-bookmark-item').on('click', function () {
        const page = $(this).find('.js-bookmark-page').text().trim();

        GoToPage.go({val: page});

        setTimeout(() => {
            $(document).trigger('click');
        }, 0);
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
        const pageNumber = pageInfo().current;

        $newBookmark.find('.js-bookmark-date').text(parseDate);
        $newBookmark.find('.js-bookmark-page').text(pageNumber);

        $('.js-bookmarks-list').append($newBookmark);

        bookmarkPopover.positioning();

        saveStates(VolumeInst);
    });

    //удаляем закладку
    $('.js-bookmark-remove').on('click', function (e) {
        e.stopPropagation();

        $(this).closest('.js-bookmark-item').remove();

        bookmarkPopover.positioning();

        saveStates(VolumeInst);
    });
}