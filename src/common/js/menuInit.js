import {FontSize, GoToPage, LineHeight, Theme, Vibration} from './modules/Menu';
import Popover from './modules/Popover';
import {svgInit} from './svgInit';
import {ionRangeSliderInit} from './ionRangeSliderInit';
import getDOMSelectors from './modules/GetDOMSelectors';
import {volumeSaveStates} from './volumeSaveStates';
import {vibrationEffectsInst} from './modules/Effects';
import {volumeControllerInst} from './modules/Effects';
import {pageInfo} from './pageInfo';
import LocalStorage from './modules/LocalStorage';
import {bookmarksSaveState} from './bookmarksSaveState';

export function menuInit() {
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
        $(DOMSelectors.menuFullScreen).animateCss('fadeIn');
        $(DOMSelectors.menuFullScreenInner).animateCss('slideInDown');
    });

    $('.js-menu-full-screen-close').on('click', () => {
        $(DOMSelectors.menuFullScreen).animateCss('fadeOut');

        $(DOMSelectors.menuFullScreenInner).animateCss('slideOutUp', () => {
            $(DOMSelectors.menuFullScreen)[0].scrollTop = 0;
            $(DOMSelectors.menuFullScreen).removeClass('active');
        });
    });

    if (!vibrationEffectsInst.vibrationSupport) {
        $('.menu-full-screen__vibration').remove();
    } else {
        //переключалка для вибрации
        $(DOMSelectors.vibrationOption).on('click', function () {
            const val = JSON.parse($(this).attr('data-vibration'));

            vibrationEffectsInst.set(val);

            if (val === true) {
                vibrationEffectsInst.play({duration: 150});
            }

            Vibration.set({
                $target: $(DOMSelectors.page),
                val,
                $vibrationOption: $(DOMSelectors.vibrationOption)
            });

            //save state
            LocalStorage.write({
                key: 'vibration',
                val
            });
        });
    }

    //переключалка темы оформления
    $(DOMSelectors.themeOption).on('click', function () {
        const val = $(this).attr('data-theme');

        Theme.set({
            $target: $(DOMSelectors.page),
            val,
            $themeOption: $(DOMSelectors.themeOption)
        });

        //save state
        LocalStorage.write({
            key: 'theme',
            val
        });
    });

    //оглавление
    $(DOMSelectors.tableOfContentsShow).on('click', () => {
        $(DOMSelectors.text).addClass('hide');

        $(DOMSelectors.menuFullScreen).removeClass('active');
        $(DOMSelectors.tableOfContents).addClass('active');
        $(DOMSelectors.tableOfContentsInner).animateCss('fadeIn');
    });

    $('.js-table-of-contents-close').on('click', () => {
        $(DOMSelectors.text).removeClass('hide');

        $(DOMSelectors.tableOfContents).animateCss('fadeOut');

        $(DOMSelectors.tableOfContentsInner).animateCss('slideOutUp', () => {
            $(DOMSelectors.tableOfContents)[0].scrollTop = 0;
            $(DOMSelectors.tableOfContents).removeClass('active');
        });
    });

    //клик по элементу оглавления (главе)
    $('.js-table-of-contents-item').on('click', function () {
        $('.js-table-of-contents-close').trigger('click');

        GoToPage.go({
            val: $(this).attr('data-go-to')
        });
    });

    //меняем межстрочный интервал
    $('.js-line-height-minus').on('click', () => {
        LineHeight.setByDirection({
            $val: $(DOMSelectors.lineHeightVal),
            direction: 'less',
            $target: $(DOMSelectors.page)
        });

        //save state
        LocalStorage.write({
            key: 'lineHeight',
            val: $(DOMSelectors.page).attr('data-line-height')
        });
    });

    $('.js-line-height-plus').on('click', () => {
        LineHeight.setByDirection({
            $val: $(DOMSelectors.lineHeightVal),
            direction: 'more',
            $target: $(DOMSelectors.page)
        });

        //save state
        LocalStorage.write({
            key: 'lineHeight',
            val: $(DOMSelectors.page).attr('data-line-height')
        });
    });

    //устанавливаем плейсхолдеры для input-ов
    $('.js-page-number').text(`${pageInfo.pageCurNum} из ${pageInfo.pagesLength}`);
    $('.js-page-input').attr('placeholder', pageInfo.pageCurNum);

    //меняем страницу
    $('.js-page-next').on('click', () => {
        GoToPage.goWithDirection({
            currentPage: pageInfo.pageCurNum,
            pagesLength: pageInfo.pagesLength,
            direction: 'next'
        });
    });

    $('.js-page-prev').on('click', () => {
        GoToPage.goWithDirection({
            currentPage: pageInfo.pageCurNum,
            pagesLength: pageInfo.pagesLength,
            direction: 'prev'
        });
    });

    $('.js-go-to-page-by-number').on('click', (e) => {
        e.stopPropagation();
    });

    //титры
    $('.js-credits-show').on('click', () => {
        $(DOMSelectors.text).addClass('hide');

        $(DOMSelectors.menuFullScreen).removeClass('active');
        $(DOMSelectors.credits).addClass('active');
        $(DOMSelectors.creditsInner).animateCss('fadeIn');
    });

    $('.js-credits-close').on('click', () => {
        $(DOMSelectors.text).removeClass('hide');

        $(DOMSelectors.credits).animateCss('fadeOut');

        $(DOMSelectors.creditsInner).animateCss('slideOutUp', () => {
            $(DOMSelectors.credits)[0].scrollTop = 0;
            $(DOMSelectors.credits).removeClass('active');
        });
    });

    $('.js-page-input').on('keypress', (e) => {
        if (e.which === 13) {
            $('.js-go-to-page-trigger').trigger('mousedown');
        }
    });

    $('.js-go-to-page-trigger').on('mousedown touchstart', (e) => {
        e.stopPropagation();

        const $input = $('.js-page-input');
        const pattern = $input.attr('pattern');
        let newVal = $input.val();

        if (newVal.length === 0) return;
        if (newVal === pageInfo.pageCurNum) return;

        if (newVal > pageInfo.pagesLength) {
            newVal = pageInfo.pagesLength;
        } else if (newVal <= 0) {
            newVal = 1;
        }

        //only numbers allows
        if (new RegExp(`^${ pattern }+$`).test(newVal) === false) {
            $input.parent().addClass('error');
            $input.val('');

            $input.one('keydown', () => {
                $input.parent().removeClass('error');
            });

            return;
        }

        GoToPage.go({val: newVal});

        $input.val('');

        $('.js-go-to-page-by-number').removeClass('active');
        $('.js-go-to-page-by-arrows').addClass('active');
    });

    $('.js-page-number').on('click', () => {
        $('.js-go-to-page-by-arrows').removeClass('active');
        $('.js-go-to-page-by-number').addClass('active');

        setTimeout(() => {
            $('.js-page-input').focus();
        }, 10); //for firefox
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

        //save state
        LocalStorage.write({
            key: 'fontSize',
            val: $(DOMSelectors.page).attr('data-font-size')
        });
    });

    $('.js-font-size-up').on('click', () => {
        FontSize.setByDirection({
            $target: $(DOMSelectors.page),
            direction: 'more'
        });

        //save state
        LocalStorage.write({
            key: 'fontSize',
            val: $(DOMSelectors.page).attr('data-font-size')
        });
    });

    //событие изменения положения ползунка глобальной громкости
    $(DOMSelectors.volumeGlobal).on('change', function (e, save = true) {
        const volume = $(this).find('.js-range-slider').val() / 100;

        volumeControllerInst.setGlobal({volume});

        if (save === false) return;

        volumeSaveStates();
    });

    //событие изменения положения ползунка громкости подсказок (звуков в тексте)
    $(DOMSelectors.volumeOneShots).on('change', function (e, save = true) {
        const volume = $(this).find('.js-range-slider').val() / 100;

        volumeControllerInst.setOneShots({volume});

        if (save === false) return;

        volumeSaveStates();
    });

    //событие изменения положения ползунка громкости фоновых звуков
    $(DOMSelectors.volumeLoops).on('change', function (e, save = true) {
        const volume = $(this).find('.js-range-slider').val() / 100;

        volumeControllerInst.setLoops({volume});

        if (save === false) return;

        volumeSaveStates();
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
        if (monthNow < 10) monthNow = `0${ monthNow }`;
        const yearNow = dateNow.getFullYear().toString().substring(2);
        const parseDate = `${ dayNow }/${ monthNow }/${ yearNow }`;

        $newBookmark.find('.js-bookmark-date').text(parseDate);
        $newBookmark.find('.js-bookmark-page').text(pageInfo.pageCurNum);

        $('.js-bookmarks-list').append($newBookmark);

        bookmarkPopover.positioning();

        bookmarksSaveState();
    });

    //удаляем закладку
    $('.js-bookmark-remove').on('click', function (e) {
        e.stopPropagation();

        $(this).closest('.js-bookmark-item').remove();

        bookmarkPopover.positioning();

        bookmarksSaveState();
    });
}