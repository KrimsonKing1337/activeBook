$(window).load(function () {
    //customScrollBar
    $('.text').mCustomScrollbar({
        theme: 'activeBook-default',
        autoDraggerLength: true,
        mouseWheel:{ scrollAmount: 75 }
    });

    //ionRangeSlider
    $('.js-range-slider').ionRangeSlider({
        min: 0,
        max: 100,
        from: 50,
        hide_min_max: true,
        hide_from_to: true
    });

    //отображаем доп. меню для звука при нажатии правой кнопкой мыши
    $('.js-menu-volume').find('> img').on('contextmenu', function (e) {
       e.preventDefault();

       let $addSettings = $(this).closest('.js-menu-volume').find('.add-settings');

       $addSettings.toggleClass('active');

       setTimeout(function () {
           $(document).one('click', function () {
               $addSettings.removeClass('active');
           });
       }, 0);
    });
});