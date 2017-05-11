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
    $('.js-menu-volume').find('.obj-img__helper').on('click', function (e) {
       e.preventDefault();
       e.stopPropagation();

       let $addSettings = $(this).closest('.js-menu-volume').find('.add-settings');

       $addSettings.toggleClass('active');

       setTimeout(function () {
           $(document).one('click', function () {
               $addSettings.removeClass('active');
           });
       }, 0);
    });

    //ждать прогрузки object перед рассчётом размеров

    $('.obj-img__helper').each(function () {
        let objImgWrapper = $(this).closest('.obj-img__wrapper');
        let height = objImgWrapper.height();
        let width = objImgWrapper.width();
        $(this).css({
           'height': height + 'px',
           'width': width + 'px'
        });
    });
});