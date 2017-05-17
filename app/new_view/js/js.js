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

            /**
             * деактивируем все поповеры,
             * кроме того, по которому щас кликнули.
             * для этого получаем список из эл-тов с классом active
             * и сравниваем каждый член массива с данным эл-том
             */
            $('.add-settings.active').each(function () {
                if ($(this)[0] !== $addSettings[0]) $(this).removeClass('active');
            });

            $('.obj-img__wrapper.active').each(function () {
                if ($(this)[0] !== $objImgWrapper[0]) $(this).removeClass('active');
            });

            $addSettings.toggleClass('active');
            $objImgWrapper.toggleClass('active');

            addSettingsPositioning($objImgWrapper, $addSettings);

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

    /**
     *
     * @param $clickedItem {object}
     * @param $addSettings {object}
     */
    const addSettingsPositioning = ($clickedItem, $addSettings) => {
        $addSettings.css({
            'transform' : 'translate(0, 0)',
            'opacity' : '0'
        });

        let $addSettingsCoords = $addSettings[0].getBoundingClientRect();
        let $clickedItemCoords = $clickedItem[0].getBoundingClientRect();
        let $textCoords = $('.text')[0].getBoundingClientRect();

        let $addSettingsBottom = $addSettings.find('.add-settings__bottom');

        $addSettingsBottom.removeClass('revert');

        let $addSettingsBottomCoords = $addSettings.find('.add-settings__bottom')[0].getBoundingClientRect();

        /**
         *
         * transform работает гораздо быстрее всяких margin,
         * потому что браузер не перерисовывает DOM-дерево
         */

        let top = Math.abs(parseInt($addSettingsBottomCoords.bottom - $clickedItemCoords.top));

        $addSettings.css({'transform' : 'translateY(-' + top + 'px)'});

        if ($addSettingsCoords.right >= $textCoords.right) {
            let right = Math.abs(parseInt($addSettingsCoords.right - $textCoords.right + 10 /*padding-right*/));

            $addSettings.css({'transform' : 'translate(-' + right + 'px, ' + '-' + top + 'px)'});
        } else if ($addSettingsCoords.left <= $textCoords.left) {
            let left = Math.abs(parseInt($addSettingsCoords.left - $textCoords.left + 10 /*padding-left*/));

            $addSettings.css({'transform' : 'translate(' + left + 'px, ' + '-' + top + 'px)'});
        }

        /**
         *
         * после того как поповер был сдвинут,
         * координаты его нижней части были измененеы,
         * их нужно актуализировать, ещё раз получив их
         */
        $addSettingsBottomCoords = $addSettings.find('.add-settings__bottom')[0].getBoundingClientRect();

        if (($addSettingsBottomCoords.left - parseInt($addSettingsBottom.css('left'))) < $clickedItemCoords.left) {
            $addSettingsBottom.addClass('revert');
        }

        $addSettings.css({
            'opacity' : ''
        });
    }
});