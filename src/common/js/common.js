import ConstsDom from './modules/ConstsDOM';
import Page from './modules/Page';
import Popover from './modules/Popover';
import {LineHeight, FontSize, GoToPage, VolumeSliders, Theme, Vibration, Bookmarks} from './modules/Menu';
import {Effects} from './modules/Effects';
import {Volume, VolumeController} from './modules/Volume';
import LocalStorage from './modules/LocalStorage';
import 'jquery-mousewheel';
import 'malihu-custom-scrollbar-plugin';
import 'ion-rangeslider';
import bowser from 'bowser';

$(window).on('load', () => {
    //browser compatibility check
    if (!bowser.blink && !bowser.gecko) {
        const $body = $('body');

        $body.empty();
        $body.append('<div class="warning">Пожалуйста, используйте Google Chrome версии 58+ или Firefox версии 53+</div>');
        return;
    }

    const constsDom = ConstsDom.get();
    const constsDomMenu = ConstsDom.getMenu();
    const constsDomPopover = ConstsDom.getPopover();
    const page = Page.getParams();

    //customScrollBar
    $('.js-scrollable-item').mCustomScrollbar({
        theme: 'activeBook',
        autoDraggerLength: true,
        mouseWheel: {scrollAmount: 75},
        scrollbarPosition: 'outside'
    });

    //стрелки, pageUp, pageDown, Home, End передаются в mCustomScrollBar
    //todo: влево/вправо в него не передавать, а в нём самом запретить их обработку
    /**
     * из самого .mCustomScrollBox элемента
     * событие keydown не всплывает,
     * но триггер события на него (```$scrollableItem.find('> .mCustomScrollBox').trigger(e);```)
     * всплывёт. для этого случая и стоит проверка на то,
     * что активный элемент - это .mCustomScrollBox.
     * иначе будет бесконечный цикл и ошибка в итоге
     */
    $(document).on('keydown', (e) => {
        if (e.which < 33 || e.which > 40) return;

        //todo: trigger click заменить на вызов функции перехода
        if (e.which === 37) {
            $('.js-page-prev').trigger('click');
            return;
        }

        //todo: trigger click заменить на вызов функции перехода
        if (e.which === 39) {
            $('.js-page-next').trigger('click');
            return;
        }

        const $scrollableItem = $('.js-scrollable-item:visible');

        if ($scrollableItem.find('> .mCustomScrollBox')[0] === document.activeElement) return;

        $scrollableItem.find('> .mCustomScrollBox').focus();
        $scrollableItem.find('> .mCustomScrollBox').trigger(e);
    });

    //ionRangeSlider
    $('.js-range-slider').ionRangeSlider({
        min: 0,
        max: 100,
        from: 50,
        step: 1,
        hide_min_max: true,
        hide_from_to: true
    });

    /**
     * пробегаемся по каждому тэгу use
     * внутри svg.
     * ищем соответствующий тэгу <use> тэг <path>:
     * аттрибут у <use> xlink:href и id у <path> совпадают.
     * если нет <path> с таким id, значит несколько <use> ссылаются
     * на один и тот же <path>.
     * в этом случае записываем старый уникальный id и выходим из функции.
     * тогда у нас будет уникальный id и все <use> будут ссылаться
     * на один и тот же <path>
     */
    $('svg').each((i, item) => {
        const $svgCur = $(item);
        const svgCount = i;
        const $use = $svgCur.find('use');
        const $defs = $svgCur.find('defs');
        let oldCountValue = 0;

        $use.each((i, item) => {
            const $useCur = $(item);
            const id = $useCur.attr('xlink:href');
            const $path = $useCur.find(id);
            const $defsPath = $defs.find('path').eq(i);

            if ($defsPath.length === 0) {
                $useCur.attr('xlink:href', `#svg-id-${svgCount}-${oldCountValue}`);
                $path.attr('id', `svg-id-${svgCount}-${oldCountValue}`);
                return;
            }

            $defsPath.attr('id', `svg-id-${svgCount}-${i}`);
            $useCur.attr('xlink:href', `#svg-id-${svgCount}-${i}`);
            $path.attr('id', `svg-id-${svgCount}-${i}`);
            oldCountValue = i;
        });

        $svgCur.wrap('<div class="obj-img__wrapper" />');
    });

    //отображаем доп. меню для элементов с поповером
    /**
     *
     * для того, чтобы можно было использовать методы экземляра класса,
     * записываем каждый экземпляр поповера в переменную
     */
    const bookmarkPopover = new Popover({
        $popover: $(constsDomMenu.bookmark).find(constsDomPopover.popover),
        $triggerButton: $(constsDomMenu.bookmark).find(constsDomPopover.triggerButton)
    });

    const volumePopover = new Popover({
        $popover: $(constsDomMenu.volume).find(constsDomPopover.popover),
        $triggerButton: $(constsDomMenu.volume).find(constsDomPopover.triggerButton)
    });

    const etcPopover = new Popover({
        $popover: $(constsDomMenu.etc).find(constsDomPopover.popover),
        $triggerButton: $(constsDomMenu.etc).find(constsDomPopover.triggerButton)
    });

    //переключалка для вибрации
    //todo: если включаем - то давать короткую вибрацию
    $(constsDomPopover.vibrationOption).on('click', function () {
        Vibration.set({
            $page: $(constsDom.page),
            val: $(this).attr('data-vibration'),
            $vibrationOption: $(constsDomPopover.vibrationOption)
        });
    });

    //переключалка темы оформления
    $(constsDomPopover.themeOption).on('click', function () {
        Theme.set({
            $page: $(constsDom.page),
            val: $(this).attr('data-theme'),
            $themeOption: $(constsDomPopover.themeOption)
        });
    });

    //оглавление
    $(constsDomPopover.tableOfContentsShow).on('click', function () {
        $(constsDom.text).hide();
        $(constsDom.tableOfContents).show();
        Popover.close({
            $triggerButton: $(this).closest('.menu__item'),
            $popover: $(this).closest(constsDomPopover.popover)
        });
    });

    $('.js-table-of-contents-close').on('click', () => {
        $(constsDom.tableOfContents).hide();
        $(constsDom.text).show();
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
            $val: $(constsDomPopover.lineHeightVal),
            direction: 'less',
            $text: $(constsDom.text)
        });
    });

    $('.js-line-height-plus').on('click', () => {
        LineHeight.setByDirection({
            $val: $(constsDomPopover.lineHeightVal),
            direction: 'more',
            $text: $(constsDom.text)
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
        FontSize.setByDirection({$text: $(constsDom.text), direction: 'less'});
    });

    $('.js-font-size-up').on('click', () => {
        FontSize.setByDirection({$text: $(constsDom.text), direction: 'more'});
    });

    //инитим громкость
    const VolumeInst = new Volume({
        global: 0.5,
        hints: 0.5,
        loops: 0.5
    });

    //инициализируем контроллер управления эффектами
    const EffectsController = new Effects(VolumeInst);

    //инитим управление громкостью
    const VolumeControllerInst = new VolumeController({
        Volume: VolumeInst,
        $audios: $('audio'),
        $videos: $('video'),
        loops: EffectsController.soundEffects.AudioLoops
    });

    //action text click event
    $('[data-effect-target]').on('click', function (e) {
        e.preventDefault();

        const effectParams = $(this).data('effect-params'); //.data() переводит JSON в obj сама

        EffectsController.play({
            target: $(`[data-effect-id="${ $(this).data('effect-target') }"]`),
            effectParams
        });
    });

    //воспроизводим эффекты, которые должны быть проиграны сразу после загрузки
    $('[data-play-on-load]').each((index, item) => {
        const effectParams = $(item).data('effect-params'); //.data() переводит JSON в obj сама

        EffectsController.play({
            target: $(item),
            effectParams
        });
    });

    //событие изменения положения ползунка глобальной громкости
    $(constsDomMenu.volumeGlobal).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setGlobal({volume});
    });

    //событие изменения положения ползунка громкости подсказок
    $(constsDomPopover.volumeHints).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setHints({volume});
    });

    //событие изменения положения ползунка громкости фоновых звуков
    $(constsDomPopover.volumeBg).on('change', function () {
        const volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setLoops({volume});
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

    //fadeOut background sounds before change the page
    //todo: делать потом фейд во время анимации смены страницы
    $(window).on('unload', () => {
        EffectsController.soundEffects.stopLoop({
            loop: 'all',
            volume: EffectsController.volume.loops
        });
    });

    //сохраняем значения настроек
    $(window).on('unload', () => {
        const volumeGlobalSlider = $(constsDomMenu.volumeGlobal).find('.js-range-slider');
        const volumeHintsSlider = $(constsDomPopover.volumeHints).find('.js-range-slider');
        const volumeBgSlider = $(constsDomPopover.volumeBg).find('.js-range-slider');

        const bookmarks = [];

        $('.js-bookmark-item:not(.template)').each((i, item) => {
            const $bookmark = $(item);
            const date = $bookmark.find('.js-bookmark-date').text().trim();
            const page = $bookmark.find('.js-bookmark-page').text().trim();

            bookmarks.push({
                date,
                page
            });
        });

        LocalStorage.saveState({
            volume: {
                global: VolumeInst.getGlobal(),
                hints: VolumeInst.getHints(),
                loops: VolumeInst.getLoops()
            },
            volumeSlidersPosition: {
                global: volumeGlobalSlider.val(),
                hints: volumeHintsSlider.val(),
                bg: volumeBgSlider.val()
            },
            currentPage: $(constsDomMenu.pageNumber).attr('data-page-number'),
            fontSize: $(constsDom.text).attr('data-font-size'),
            lineHeight: $(constsDom.text).attr('data-line-height'),
            scrollTop: Math.abs(parseInt($('.mCustomScrollBox.mCS-activeBook').find('> .mCSB_container').css('top'))),
            theme: $(constsDom.page).attr('data-theme'),
            vibration: $(constsDom.page).attr('data-vibration'),
            bookmarks
        });
    });

    const states = LocalStorage.getState();

    if (states !== false) {
        //volume sliders position
        VolumeSliders.set({
            sliders: {
                global: {
                    inst: $(constsDomMenu.volumeGlobal).find('.js-range-slider').data('ionRangeSlider'),
                    val: states.volumeSlidersPosition.global
                },
                hints: {
                    inst: $(constsDomPopover.volumeHints).find('.js-range-slider').data('ionRangeSlider'),
                    val: states.volumeSlidersPosition.hints
                },
                bg: {
                    inst: $(constsDomPopover.volumeBg).find('.js-range-slider').data('ionRangeSlider'),
                    val: states.volumeSlidersPosition.bg
                }
            }
        });

        //font-size
        FontSize.set({
            $text: $(constsDom.text),
            newVal: states.fontSize
        });

        //line-height
        LineHeight.set({
            $text: $(constsDom.text),
            $val: $(constsDomPopover.lineHeightVal),
            newVal: states.lineHeight
        });

        //theme
        Theme.set({
            $page: $(constsDom.page),
            val: states.theme,
            $themeOption: $(constsDomPopover.themeOption)
        });

        //vibration
        Vibration.set({
            $page: $(constsDom.page),
            val: states.vibration,
            $vibrationOption: $(constsDomPopover.vibrationOption)
        });

        //bookmarks
        Bookmarks.set({
            $bookmarkContainer: $('.js-bookmarks-list'),
            $bookmarkTemplate: $('.js-bookmark-item.template'),
            bookmarksArr: states.bookmarks
        })
    }
});