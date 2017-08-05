import ConstsDom from './ConstsDOM';
import Page from './Page';
import Popover from './Popover';
import {LineHeight, FontSize, GoToPage, VolumeSliders, Theme, Vibration} from './Menu';
import {Effects} from './Effects';
import {Volume, VolumeController} from './Volume';
import LocalStorage from './LocalStorage';

let bowser = require('bowser');

$(window).load(function () {
    //browser compatibility check
    if (!bowser.blink && !bowser.gecko) {
        let $body = $('body');

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
    $(document).on('keydown', function (e) {
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

        let $scrollableItem = $('.js-scrollable-item:visible');

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

    //отображаем доп. меню для элементов с поповером
    $('.menu__item').has(constsDomPopover.popover).each(function (index, popoverParent) {
        let $popover = $(popoverParent).find(constsDomPopover.popover);
        let $triggerButton = $(popoverParent).find(constsDomPopover.triggerButton);

        new Popover({$popover: $popover, $triggerButton: $triggerButton});
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

    $('.js-table-of-contents-close').on('click', function () {
        $(constsDom.tableOfContents).hide();
        $(constsDom.text).show();
    });

    //клик по элементу оглавления (главе)
    $('.table-of-contents__item').on('click', function () {
        let newVal = $.trim($(this).find('.table-of-contents__item__page').text());

        GoToPage.go({currentPage: page.current, pagesLength: page.length, where: Math.abs(parseInt(newVal))});
    });

    //меняем межстрочный интервал
    $('.js-line-height-minus').on('click', function () {
        LineHeight.setByDirection({$val: $(constsDomPopover.lineHeightVal), direction: 'less', $text: $(constsDom.text)});
    });

    $('.js-line-height-plus').on('click', function () {
        LineHeight.setByDirection({$val: $(constsDomPopover.lineHeightVal), direction: 'more', $text: $(constsDom.text)});
    });

    //меняем страницу
    $('.js-page-next').on('click', function () {
        GoToPage.go({currentPage: page.current, pagesLength: page.length, where: 'next'});
    });

    $('.js-page-prev').on('click', function () {
        GoToPage.go({currentPage: page.current, pagesLength: page.length, where: 'prev'});
    });

    $('.js-page-number').find('input').on('blur', function () {
        let $val = $('.js-page-number');
        let pattern = $val.find('input').attr('pattern');
        let newVal = $(this).val();

        if (newVal.length === 0) return;

        //only numbers allows
        if (new RegExp('^' + pattern + '+$').test(newVal) === false) {
            $(this).css({'background': 'red'});
            $(this).val('');

            $(this).one('keydown', function () {
                $(this).css({'background': ''});
            });

            return;
        }

        GoToPage.go({currentPage: page.current, pagesLength: page.length, where: Math.abs(parseInt(newVal))});
    });

    //меняем размер шрифта
    $('.js-font-size-down').on('click', function () {
        FontSize.setByDirection({$text: $(constsDom.text), direction: 'less'});
    });

    $('.js-font-size-up').on('click', function () {
        FontSize.setByDirection({$text: $(constsDom.text), direction: 'more'});
    });

    //инитим громкость
    let VolumeInst = new Volume({
        global: 0.5,
        hints: 0.5,
        loops: 0.5
    });

    //инициализируем контроллер управления эффектами
    let EffectsController = new Effects(VolumeInst);

    //инитим управление громкостью
    let VolumeControllerInst = new VolumeController({
        Volume: VolumeInst,
        $audios: $('audio'),
        $videos: $('video'),
        loops: EffectsController.soundEffects.AudioLoops
    });

    //action text click event
    $('[data-effect-target]').on('click', function (e) {
        e.preventDefault();

        EffectsController.play({
            target: $('[data-effect-id="' + $(this).data('effect-target') + '"]'),
            effectsParams: $(this).data('effect-params')
        });
    });

    //воспроизводим эффекты, которые должны быть проиграны сразу после загрузки
    $('[data-play-on-load]').each(function (index, item) {
        EffectsController.play({
            target: $(item),
            effectsParams: $(item).data('effect-params')
        });
    });

    //событие изменения положения ползунка глобальной громкости
    $(constsDomMenu.volumeGlobal).on('change', function () {
        let volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setGlobal({volume: volume});
    });

    //событие изменения положения ползунка громкости подсказок
    $(constsDomPopover.volumeHints).on('change', function () {
        let volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setHints({volume: volume});
    });

    //событие изменения положения ползунка громкости фоновых звуков
    $(constsDomPopover.volumeBg).on('change', function () {
        let volume = $(this).find('.js-range-slider').val() / 100;

        VolumeControllerInst.setLoops({volume: volume});
    });

    //устанавливаем закладку
    $(constsDomMenu.bookmark).on('click', function () {
        $(this).find(constsDomMenu.svgWrapper).toggleClass('active');
    });

    //fadeOut background sounds before change the page
    //todo: делать потом фейд во время анимации смены страницы
    $(window).on('unload', function () {
        EffectsController.soundEffects.stopLoop({loop: 'all'});
    });

    //сохраняем значения настроек
    $(window).on('unload', function () {
        let volumeGlobalSlider = $(constsDomMenu.volumeGlobal).find('.js-range-slider');
        let volumeHintsSlider = $(constsDomPopover.volumeHints).find('.js-range-slider');
        let volumeBgSlider = $(constsDomPopover.volumeBg).find('.js-range-slider');

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
            page: $(constsDomMenu.pageNumber).attr('data-page-number'),
            fontSize: $(constsDom.text).attr('data-font-size'),
            lineHeight: $(constsDom.text).attr('data-line-height'),
            scrollTop: Math.abs(parseInt($('.mCustomScrollBox.mCS-activeBook').find('> .mCSB_container').css('top'))),
            theme: $(constsDom.page).attr('data-theme'),
            vibration: $(constsDom.page).attr('data-vibration'),
            bookmark: $(constsDomMenu.bookmark)
        });
    });

    let states = LocalStorage.getState();

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
    }
});