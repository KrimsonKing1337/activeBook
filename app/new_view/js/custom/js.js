import ConstsDom from './ConstsDOM';
import PopoverControl from './PopoverControl';

$(window).load(function () {
    const constsDom = ConstsDom.get();

    //customScrollBar
    $('.js-scrollable-item').mCustomScrollbar({
        theme: 'activeBook-default',
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
        constsDom.$text.hide();
        constsDom.$tableOfContents.show();
        PopoverControl.close($(this).closest('.menu__item'), $(this).closest('.add-settings'));
    });

    $('.js-table-of-contents-close').on('click', function () {
        constsDom.$tableOfContents.hide();
        constsDom.$text.show();
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

    //меняем страницу
    //todo: потом заменить на настоящий переход на страницу
    $('.js-page-next').on('click', function () {
        let $val = $('.js-page-number');
        let currentVal = parseInt($val.attr('data-page-number'));
        let pagesLength = parseInt($val.attr('data-pages-length'));
        let newVal = currentVal + 1;

        if (currentVal >= pagesLength) newVal = currentVal;
        if (newVal.toString().length < 3) {
            for (let i = 1; i < 3; i++) {
                if (('0'.repeat(i) + newVal).length === 3) {
                    newVal = '0'.repeat(i) + newVal;
                    break;
                }
            }
        }

        $val.find('input').val(newVal);
    });

    $('.js-page-prev').on('click', function () {
        let $val = $('.js-page-number');
        let currentVal = parseInt($val.attr('data-page-number'));
        let newVal = currentVal - 1;

        if (currentVal <= 1) newVal = currentVal;
        if (newVal.toString().length < 3) {
            for (let i = 1; i < 3; i++) {
                if (('0'.repeat(i) + newVal).length === 3) {
                    newVal = '0'.repeat(i) + newVal;
                    break;
                }
            }
        }

        $val.find('input').val(newVal);
    });

    $('.js-page-number').find('input').on('blur', function () {
        let $val = $('.js-page-number');
        let currentVal = parseInt($val.attr('data-page-number'));
        let pagesLength = parseInt($val.attr('data-pages-length'));
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

        newVal = Math.abs(parseInt(newVal));

        if (newVal <= 1) {
            newVal = 1;
        } else if (newVal >= pagesLength) {
            newVal = pagesLength;
        }

        if (newVal === currentVal) return;

        console.log(newVal);
    });
});