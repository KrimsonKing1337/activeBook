import ConstsDom from './ConstsDOM';
import Popover from './Popover';
import {LineHeight, FontSize, GoToPage} from './Menu';
import {Effects} from './Effects';
import Volume from './Volume';

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

    //todo: currentPage, pagesLength и прочие параметры страницы получать из специального геттера класса
    const page = {
        current: parseInt($('.js-page-number').attr('data-page-number')),
        length: parseInt($('.js-page-number').attr('data-pages-length')),
    };

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
        let $parent = $(constsDomPopover.vibrationToggle);

        if (!$(this).hasClass('active')) {
            $parent.find('.active').removeClass('active');
            $(this).addClass('active');
        }
    });

    //переключалка темы оформления
    $(constsDomPopover.themeOption).on('click', function () {
        let $parent = $(this).closest('.theme-options');
        let $page = $(constsDom.page);

        if (!$(this).hasClass('active')) {
            let theme = $(this).attr('data-theme-name');
            let themeForRemove = $page.attr('class').match(/theme-\S+/) || [''];

            $parent.find('.active').removeClass('active');
            $(this).addClass('active');
            $page.removeClass(themeForRemove[0]).addClass('theme-' + theme);
        }
    });

    //оглавление
    $(constsDomPopover.tableOfContentsShow).on('click', function () {
        $(constsDom.text).hide();
        $(constsDom.tableOfContents).show();
        PopoverControl.close({
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
        let $val = $('.js-line-height-val');

        LineHeight.set({$val: $val, direction: 'less', $text: $(constsDom.text)});
    });

    $('.js-line-height-plus').on('click', function () {
        let $val = $('.js-line-height-val');

        LineHeight.set({$val: $val, direction: 'more', $text: $(constsDom.text)});
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
        FontSize.set({$text: $(constsDom.text), direction: 'less'});
    });

    $('.js-font-size-up').on('click', function () {
        FontSize.set({$text: $(constsDom.text), direction: 'more'});
    });

    //инициализируем контроллер управления эффектами
    let EffectsController = new Effects();

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

    let VolumeController = new Volume({
        volume: 50, //todo: значение из слайдера
        $audios: $('audio'),
        $videos: $('video'),
        loops: {
            loopBgSound: EffectsController.soundEffects.loopBgSound,
            loopBgSoundNew: EffectsController.soundEffects.loopBgSoundNew,
            loopBgMusic: EffectsController.soundEffects.loopBgMusic,
            loopBgMusicNew: EffectsController.soundEffects.loopBgMusicNew
        }
    });

    $('.menu__item').has(constsDomMenu.volumeGlobal).on('change', function () {
        let volume = $(this).find(constsDomMenu.volumeGlobal).prop('value') / 100;

        VolumeController.setGlobal({volume: volume});
    });

    //fadeOut background sounds before change the page
    //todo: делать потом фейд во время анимации смены страницы
    $(window).on('unload', function () {
        EffectsController.soundEffects.stopLoop({loop: 'all'});
    });
});