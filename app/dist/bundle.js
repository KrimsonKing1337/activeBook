/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * геттеры для селекторов
 * на странице
 */

class ConstsDOM {
    constructor () {

    }

    /**
     *
     * @returns {{string}}
     *
     * основные селекторы DOM-элементов страницы
     */
    static get () {
        return {
            text: '.text',
            tableOfContents: '.table-of-contents',
            menu: '.menu',
            leftSide: '.left-side',
            rightSide: '.right-side',
            action: '.action',
            objImgWrapper: '.obj-img__wrapper',
            page: '.page'
        }
    }

    /**
     *
     * @returns {{string}}
     *
     * js-хуки для элементов меню
     */
    static getMenu () {
        return {
            bookmark: '.js-bookmark',
            pagePrev: '.js-page-prev',
            pageNext: '.js-page-next',
            pageNumber: '.js-page-number',
            volumeSlider: '.js-range-slider',
            fontSizeDown: '.js-font-size-down',
            fontSizeUp: '.js-font-size-up'
        }
    }

    /**
     *
     * @returns {{jquery}}
     *
     * js-хуки для элементов поповера
     */
    static getPopover () {
        return {
            popover: '.add-settings',
            popoverBottom: '.add-settings__bottom',
            triggerButton: '.obj-img__wrapper',
            menu: '.menu',
            tableOfContentsShow: '.js-table-of-contents-show',
            vibrationToggle: '.js-vibration-toggle',
            vibrationOption: '.js-vibration-option',
            themeOption: '.js-theme-option',
            lineHeightMinus: '.js-line-height-minus',
            lineHeightPlus: '.js-line-height-plus',
            lineHeightVal: '.js-line-height-val'
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ConstsDOM;


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__ = __webpack_require__(0);
/**
 * управляем отображением поповеров
 */


/**
 * инициализатор для поповера
 */
class Popover {
    /**
     *
     * @param selectors {object} jquery;
     * @param selectors.$popover {object} jquery;
     * @param selectors.$triggerButton {object} jquery;
     */
    constructor (selectors) {
        this.constDomPopover = __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__["a" /* default */].getPopover();
        this.$popover = $(selectors.$popover);
        this.$triggerButton = $(selectors.$triggerButton);
        this.init();
    }

    /**
     *
     */
    init () {
        let self = this;
        let $triggerButton = self.$triggerButton;
        let $popover = self.$popover;

        $triggerButton.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            /**
             * скрываем все поповеры,
             * кроме актуальной
             */
            Popover._closeAllOtherPopovers({
                $popovers: $(self.constDomPopover.popover + '.active'),
                $popoverActual: $popover
            });

            /**
             * деактивируем все триггер-кнопки,
             * кроме той, по которой щас кликнули
             */
            Popover._closeAllOtherTriggerButtons({
                $triggerButtons: $(self.constDomPopover.triggerButton + '.active'),
                $triggerButtonActual: $triggerButton
            });

            $popover.toggleClass('active');
            $triggerButton.toggleClass('active');

            /**
             * позиционируем поповер
             */
            self._positioning();

            /**
             * навешиваем дополнительные события
             * (для скрытия попапа и т.д.)
             */
            self._additionalEvents();
        });
    }

    /**
     *
     * @param selectors {object}
     * @param selectors.$popovers {object} jquery
     * @param selectors.$popoverActual {object} jquery
     * @private
     */
    static _closeAllOtherPopovers (selectors) {
        let $popovers = selectors.$popovers;
        let $popoverActual = selectors.$popoverActual;

        $popovers.each(function () {
            if ($(this)[0] !== $popoverActual[0]) $(this).removeClass('active');
        });
    }

    /**
     *
     * @param selectors {object}
     * @param selectors.$triggerButtons {object} jquery
     * @param selectors.$triggerButtonActual {object} jquery
     * @private
     */
    static _closeAllOtherTriggerButtons (selectors) {
        let $triggerButtons = selectors.$triggerButtons;
        let $triggerButtonActual = selectors.$triggerButtonActual;

        $triggerButtons.each(function () {
            if ($(this)[0] !== $triggerButtonActual[0]) $(this).removeClass('active');
        });
    }

    /**
     * @private
     */
    _additionalEvents () {
        let self = this;
        let $popover = self.$popover;
        let $triggerButton = self.$triggerButton;

        /**
         * убираем всплытие события клик у поповера,
         * чтобы он не закрывался при нём
         */
        setTimeout(function () {
            $popover.on('click', function (e) {
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
                Popover.close({
                    $popover: $popover,
                    $triggerButton: $triggerButton
                });
            });
        }, 0);
    }

    /**
     * @param selectors {object}
     * @param selectors.$triggerButton {object} jquery
     * @param selectors.$popover {object} jquery
     */
    static close (selectors) {
        let $popover = selectors.$popover;
        let $triggerButton = selectors.$triggerButton;

        $popover.removeClass('active');
        $popover.off('click');
        $triggerButton.removeClass('active');
    }

    /**
     * @private
     */
     _positioning () {
        let self = this;
        let $popover = self.$popover;

        /**
         * сбрасываем все изменения,
         * чтобы позиционирование сработало нормально.
         * скрываем элемент на время позиционирования.
         *
         */
        self._positioningBefore();

        /**
         *
         * получаем координаты всех нужных объектов
         */
        let coords = self._getCoords();

        /**
         *
         * transform работает гораздо быстрее всяких margin,
         * потому что браузер не перерисовывает DOM-дерево
         */

        let top = Math.abs(parseInt(coords.$popoverBottom.bottom - coords.$popover.top));

        $popover.css({'transform' : 'translateY(-' + top + 'px)'});

        /**
         * если правая точка поповера заходит
         * на край блока с текстом, двигаем его назад + небольшой отступ.
         * аналогично с левой точкой
         */
        if (coords.$popover.right >= coords.$menu.right) {
            let right = Math.abs(parseInt(coords.$popover.right - coords.$menu.right + 10 /*padding-right*/));

            $popover.css({'transform' : 'translate(-' + right + 'px, ' + '-' + top + 'px)'});
        } else if (coords.$popover.left <= coords.$menu.left) {
            let left = Math.abs(parseInt(coords.$popover.left - coords.$menu.left + 10 /*padding-left*/));

            $popover.css({'transform' : 'translate(' + left + 'px, ' + '-' + top + 'px)'});
        }

        /**
         *
         * после того как поповер был сдвинут,
         * координаты его нижней части были измененеы,
         * их нужно актуализировать, ещё раз получив их
         */

        let $popoverBottom = $popover.find(self.constDomPopover.popoverBottom);

        coords.$popoverBottom = $popoverBottom[0].getBoundingClientRect();

        /**
         * зеркалим нижнюю часть поповера,
         * если триггер-кнопка правее его
         */

        if ((coords.$popoverBottom.left - parseInt($popoverBottom.css('left'))) < coords.$triggerButton.left) {
            $popoverBottom.addClass('revert');
        }

        /**
         * когда позиционирование было завершено,
         * проявляем элемент
         */
        self._positioningAfter();
    }

    /**
     *
     * @private
     */
    _positioningBefore () {
        let self = this;
        let $popover = self.$popover;

        $popover.css({
            'transform' : 'translate(0, 0)',
            'opacity' : '0'
        });

        let $popoverBottom = $popover.find(self.constDomPopover.popoverBottom);
        $popoverBottom.removeClass('revert');
    }

    /**
     * @private
     */
    _getCoords () {
        let self = this;
        let $popover = self.$popover;
        let $triggerButton = self.$triggerButton;

        return {
            $popover: $popover[0].getBoundingClientRect(),
            $triggerButton: $triggerButton[0].getBoundingClientRect(),
            $menu: $(self.constDomPopover.menu)[0].getBoundingClientRect(),
            $popoverBottom: $popover.find(self.constDomPopover.popoverBottom)[0].getBoundingClientRect()
        };
    }

    /**
     *
     * @private
     */
    _positioningAfter () {
        this.$popover.css({
            'opacity' : ''
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Popover;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Popover__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Menu__ = __webpack_require__(10);




$(window).load(function () {
    const constsDom = __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__["a" /* default */].get();
    const constsDomMenu = __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__["a" /* default */].getMenu();
    const constsDomPopover = __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__["a" /* default */].getPopover();

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

        new __WEBPACK_IMPORTED_MODULE_1__Popover__["a" /* default */]({$popover: $popover, $triggerButton: $triggerButton});
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
    $('.js-line-height-minus').on('click', function () {
        let $val = $('.js-line-height-val');

        __WEBPACK_IMPORTED_MODULE_2__Menu__["a" /* LineHeight */].set({$val: $val, direction: 'less', $text: $(constsDom.text)});
    });

    $('.js-line-height-plus').on('click', function () {
        let $val = $('.js-line-height-val');

        __WEBPACK_IMPORTED_MODULE_2__Menu__["a" /* LineHeight */].set({$val: $val, direction: 'more', $text: $(constsDom.text)});
    });

    //меняем страницу
    $('.js-page-next').on('click', function () {
        let $val = $('.js-page-number');

        __WEBPACK_IMPORTED_MODULE_2__Menu__["b" /* GoToPage */].go({$val: $val, direction: 'next'});
    });

    $('.js-page-prev').on('click', function () {
        let $val = $('.js-page-number');

        __WEBPACK_IMPORTED_MODULE_2__Menu__["b" /* GoToPage */].go({$val: $val, direction: 'prev'});
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

        __WEBPACK_IMPORTED_MODULE_2__Menu__["b" /* GoToPage */].go({$val: $val, direction: 'any'});
    });

    //меняем размер шрифта
    $('.js-font-size-down').on('click', function () {
        __WEBPACK_IMPORTED_MODULE_2__Menu__["c" /* FontSize */].set({$text: $(constsDom.text), direction: 'less'});
    });

    $('.js-font-size-up').on('click', function () {
        __WEBPACK_IMPORTED_MODULE_2__Menu__["c" /* FontSize */].set({$text: $(constsDom.text), direction: 'more'});
    });
});

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * меняем межстрочный интервал на странице
 */
class LineHeight {
    constructor () {

    }

    /**
     *
     * @param params {object};
     * @param params.$text {object};
     * @param params.$val {object} jquery;
     * @param params.direction {string} less || more;
     */
    static set (params = {}) {
        let $text = params.$text;
        let $val = params.$val;
        let direction = params.direction;

        let currentVal = parseInt($text.attr('data-line-height')) || 100;

        let newVal;
        let limit;

        if (direction === 'less') {
            newVal = currentVal - 25;
            limit = currentVal <= 75;
        } else if (direction === 'more') {
            newVal = currentVal + 25;
            limit = currentVal >= 150;
        }

        if (limit === true) return;

        LineHeight._apply({$text: $text, $val: $val, newVal: newVal});
    }

    /**
     *
     * @param params {object};
     * @param params.$text {object} jquery;
     * @param params.$val {object} jquery;
     * @param params.newVal {number};
     * @private
     */
    static _apply (params = {}) {
        let $text = params.$text;
        let $val = params.$val;
        let newVal = params.newVal;

        $val.text(newVal + '%');
        $text.attr('data-line-height', newVal);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LineHeight;


/**
 * переход на страницу
 */
class GoToPage {
    constructor () {

    }

    /**
     *
     * @param params {object};
     * @param params.$val {object} jquery;
     * @param params.direction {string} next || prev || any;
     */
    static go (params = {}) {
        let $val = params.$val;
        let direction = params.direction;

        let currentPage = parseInt($val.attr('data-page-number'));
        let pagesLength = parseInt($val.attr('data-pages-length'));

        let newVal;
        let limit;

        if (direction === 'next') {
            newVal = currentPage + 1;
            limit = currentPage >= pagesLength;
        } else if (direction === 'prev') {
            newVal = currentPage - 1;
            limit = currentPage <= 1;
        } else if (direction === 'any') {
            newVal = $val.find('input').val();

            if (newVal.length === 0) return;

            newVal = Math.abs(parseInt(newVal));

            if (newVal <= 1) {
                newVal = 1;
            } else if (newVal >= pagesLength) {
                newVal = pagesLength;
            }

            limit = newVal === currentPage;
        }

        if (limit === true) {
            $val.find('input').val('');
            return;
        }

        location.href = '../pages/page_' + newVal + '.html';
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = GoToPage;


/**
 * меняем размер шрифта
 */
class FontSize {
    constructor () {

    }

    /**
     *
     * @param params {object};
     * @param params.$text {object};
     * @param params.direction {string} less || more;
     */
    static set (params = {}) {
        let $text = params.$text;
        let direction = params.direction;

        let currentVal = parseInt($text.attr('data-font-size')) || 100;

        let newVal;
        let limit;

        if (direction === 'less') {
            newVal = currentVal - 25;
            limit = currentVal <= 75;
        } else if (direction === 'more') {
            newVal = currentVal + 25;
            limit = currentVal >= 150;
        }

        if (limit === true) return;

        FontSize._apply({$text: $text, newVal: newVal});
    }

    /**
     *
     * @param params {object};
     * @param params.$text {object} jquery;
     * @param params.$val {object} jquery;
     * @param params.newVal {number};
     * @private
     */
    static _apply (params = {}) {
        let $text = params.$text;
        let newVal = params.newVal;

        $text.attr('data-font-size', newVal);
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = FontSize;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map