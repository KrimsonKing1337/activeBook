import ConstsDom from './ConstsDOM';
import PopoverControl from './PopoverControl';

$(window).load(function () {
    const constDom = ConstsDom.get();

    //customScrollBar
    constDom.$text.mCustomScrollbar({
        theme: 'activeBook-default',
        autoDraggerLength: true,
        mouseWheel: {scrollAmount: 75}
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
});