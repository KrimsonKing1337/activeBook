import ConstsDom from './ConstsDOM';
import PopoverControl from './PopoverControl';

$(window).load(function () {
    const constDom = ConstsDom.get();

    //customScrollBar
    $('.js-scrollable-item').mCustomScrollbar({
        theme: 'activeBook-default',
        autoDraggerLength: true,
        mouseWheel: {scrollAmount: 75},
        scrollbarPosition: 'outside'
    });

    //ionRangeSlider
    $('.js-range-slider').ionRangeSlider({
        min: 0,
        max: 100,
        from: 50,
        hide_min_max: true,
        hide_from_to: true
    });

    //отображаем доп. меню для элементов с поповером
    PopoverControl.init($('.menu__item').has('.add-settings'));

    //переключалка для вибрации
    //todo: если включаем - то давать короткую вибрацию
    $('.js-vibration-toggle').find('.add-settings__item__toggle__item').on('click', function () {
       let $parent = $(this).closest('.add-settings__item__toggle');

       if (!$(this).hasClass('active')) {
           $parent.find('.add-settings__item__toggle__item').removeClass('active');
           $(this).addClass('active');
       }
    });

    //переключалка темы оформления
    $('.add-settings__item__theme-option').on('click', function () {
        let $parent = $(this).closest('.add-settings__item.theme-options');

        if (!$(this).hasClass('active')) {
            $parent.find('.add-settings__item__theme-option').removeClass('active');
            $(this).addClass('active');
        }
    });

    //оглавление
    $('.js-table-of-contents-show').on('click', function () {
       constDom.$text.hide();
       constDom.$tableOfContents.show();
       PopoverControl.close($(this).closest('.menu__item'), $(this).closest('.add-settings'));
    });

    $('.js-table-of-contents-close').on('click', function () {
        constDom.$tableOfContents.hide();
        constDom.$text.show();
    });

    //клик по элементу оглавления (главе)
    $('.table-of-contents__item').on('click', function () {
       let pageNumber = $.trim($(this).find('.table-of-contents__item__page').text());

       //todo: потом заменить на настоящий переход на страницу
       console.log(pageNumber);
    });

    //меняем межстрочный интервал
    //todo: добавить реальное изменение интервала
    $('.js-line-height-minus').on('click', function () {
        let $val = $('.js-line-height-val');
        let currentVal = parseInt($val.text());
        let newVal = currentVal - 25;

        if (currentVal <= 50) newVal = 50;

        $val.text(newVal + '%');
    });

    $('.js-line-height-plus').on('click', function () {
        let $val = $('.js-line-height-val');
        let currentVal = parseInt($val.text());
        let newVal = currentVal + 25;

        if (currentVal >= 150) newVal = 150;

        $val.text(newVal + '%');
    });
});