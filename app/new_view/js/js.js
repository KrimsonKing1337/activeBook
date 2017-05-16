$(window).load(function () {
    //customScrollBar
    $('.text').mCustomScrollbar({
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
    $('.menu__item').has('.add-settings').each(function (index, item) {
        $(item).find('.obj-img__wrapper').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let $objImgWrapper = $(this);
            let $addSettings = $(item).find('.add-settings');
            $addSettings.toggleClass('active');
            $objImgWrapper.toggleClass('active');

            /**
             * убираем всплытие события клик у поповера,
             * чтобы он не закрывался при нём
             */
            setTimeout(function () {
                $addSettings.on('click', function (e) {
                    e.stopPropagation();
                });
            }, 0);

            /**
             * клик в любом месте документа,
             * кроме самого этого элемента
             * скроет поповер
             */
            setTimeout(function () {
                $(document).one('click', function () {
                    $addSettings.removeClass('active');
                    $addSettings.off('click');
                    $objImgWrapper.removeClass('active');
                });
            }, 0);
        });
    });
});