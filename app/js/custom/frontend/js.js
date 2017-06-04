import ConstsDom from './ConstsDOM';
import PopoverControl from './PopoverControl';

$(window).load(function () {
    const constsDom = ConstsDom.get();
    const constsDomMenu = ConstsDom.getMenu();
    const constsDomPopover = ConstsDom.getPopover();

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
        hide_min_max: true,
        hide_from_to: true
    });

    //отображаем доп. меню для элементов с поповером
    $('.menu__item').has(constsDomPopover.popover).each(function (index, popoverParent) {
        let $popover = $(popoverParent).find(constsDomPopover.popover);
        let $triggerButton = $(popoverParent).find(constsDomPopover.triggerButton);

        new PopoverControl({$popover: $popover, $triggerButton: $triggerButton});
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
        let pageNumber = $.trim($(this).find('.table-of-contents__item__page').text());

        //todo: потом заменить на настоящий переход на страницу
        console.log(pageNumber);
    });

    //меняем межстрочный интервал
    //todo: вынести в отдельный метод
    $('.js-line-height-minus').on('click', function () {
        let $val = $('.js-line-height-val');
        let currentVal = parseInt($val.text());
        let newVal = currentVal - 25;

        if (currentVal <= 75) return;

        $val.text(newVal + '%');

        let classForRemove = $(constsDom.text).attr('class').match(/line-height-\S+/) || [''];

        $(constsDom.text).removeClass(classForRemove[0]).addClass('line-height-' + newVal);
        $(constsDom.text).attr('data-line-height', newVal);
    });

    $('.js-line-height-plus').on('click', function () {
        let $val = $('.js-line-height-val');
        let currentVal = parseInt($val.text());
        let newVal = currentVal + 25;

        if (currentVal >= 150) return;

        $val.text(newVal + '%');

        let classForRemove = $(constsDom.text).attr('class').match(/line-height-\S+/) || [''];

        $(constsDom.text).removeClass(classForRemove[0]).addClass('line-height-' + newVal);
        $(constsDom.text).attr('data-line-height', newVal);
    });

    //меняем страницу
    //todo: вынести в отдельную функцию переход на страницу
    $('.js-page-next').on('click', function () {
        let $val = $('.js-page-number');
        let currentVal = parseInt($val.attr('data-page-number'));
        let pagesLength = parseInt($val.attr('data-pages-length'));
        let newVal = currentVal + 1;

        if (currentVal >= pagesLength) newVal = currentVal;

        location.href = '../pages/page_' + newVal + '.html';
    });

    $('.js-page-prev').on('click', function () {
        let $val = $('.js-page-number');
        let currentVal = parseInt($val.attr('data-page-number'));
        let newVal = currentVal - 1;

        if (currentVal <= 1) newVal = currentVal;

        location.href = '../pages/page_' + newVal + '.html';
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

        location.href = '../pages/page_' + newVal + '.html';
    });

    //font-size control
    /**
     * @param params {object}
     * @param params.newFontSize {string}
     * */
    const changeFontSize = function (params = {}) {
        let newFontSize = params.newFontSize;

        if (!newFontSize) {
            return false;
        }

        let text = $(constsDom.text);
        let classNameForRemove = text.attr('data-font-size');

        text.removeClass('font-size-' + classNameForRemove).addClass('font-size-' + newFontSize);
        text.attr('data-font-size', newFontSize);
    };

    $('.js-font-size-down').add('.js-font-size-up').on('click', function () {
        let fontSizes = ['75', '100', '125', '150'];
        let text = $(constsDom.text);
        let fontSizeNow = text.attr('data-font-size');
        let fontSizeNowIndex = $.inArray(fontSizeNow, fontSizes);
        let newFontSize = fontSizes[fontSizeNowIndex - 1];

        if ($(this).hasClass('js-font-size-up')) {
            newFontSize = fontSizes[fontSizeNowIndex + 1];
        }

        if (!newFontSize) {
            return false;
        }

        changeFontSize({newFontSize: newFontSize});
    });
});