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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
/* 1 */
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
/* harmony export (immutable) */ __webpack_exports__["b"] = LineHeight;


/**
 * переход на страницу
 */
class GoToPage {
    constructor () {

    }

    /**
     *
     * @param params {object};
     * @param params.currentPage {string};
     * @param params.pagesLength {string};
     * @param params.where {number || string} next || prev;
     */
    static go (params = {}) {
        let where = params.where;
        let currentPage = params.currentPage;
        let pagesLength = params.pagesLength;

        let newVal;
        let limit;

        if (where === 'next') {
            newVal = currentPage + 1;
            limit = currentPage >= pagesLength;
        } else if (where === 'prev') {
            newVal = currentPage - 1;
            limit = currentPage <= 1;
        } else if (typeof where === 'number' && isNaN(where) === false) {
            newVal = where;

            if (newVal <= 1) {
                newVal = 1;
            } else if (newVal >= pagesLength) {
                newVal = pagesLength;
            }

            limit = newVal === currentPage;
        } else {
            new Error('Unrecognized param "where" (' + where + '). Only next, prev and number is allowed');
        }

        if (limit === true) return;

        location.href = '../pages/page_' + newVal + '.html';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GoToPage;


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


/***/ }),
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
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2015
 */

!function (root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (true) __webpack_require__(6)(name, definition)
  else root[name] = definition()
}(this, 'bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
      , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
      , chromeos = /CrOS/.test(ua)
      , silk = /silk/i.test(ua)
      , sailfish = /sailfish/i.test(ua)
      , tizen = /tizen/i.test(ua)
      , webos = /(web|hpw)os/i.test(ua)
      , windowsphone = /windows phone/i.test(ua)
      , samsungBrowser = /SamsungBrowser/i.test(ua)
      , windows = !windowsphone && /windows/i.test(ua)
      , mac = !iosdevice && !silk && /macintosh/i.test(ua)
      , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
      , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , xbox = /xbox/i.test(ua)
      , result

    if (/opera/i.test(ua)) {
      //  an old Opera
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
      }
    } else if (/opr|opios/i.test(ua)) {
      // a new Opera
      result = {
        name: 'Opera'
        , opera: t
        , version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/SamsungBrowser/i.test(ua)) {
      result = {
        name: 'Samsung Internet for Android'
        , samsungBrowser: t
        , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/coast/i.test(ua)) {
      result = {
        name: 'Opera Coast'
        , coast: t
        , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/yabrowser/i.test(ua)) {
      result = {
        name: 'Yandex Browser'
      , yandexbrowser: t
      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/ucbrowser/i.test(ua)) {
      result = {
          name: 'UC Browser'
        , ucbrowser: t
        , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/mxios/i.test(ua)) {
      result = {
        name: 'Maxthon'
        , maxthon: t
        , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/epiphany/i.test(ua)) {
      result = {
        name: 'Epiphany'
        , epiphany: t
        , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/puffin/i.test(ua)) {
      result = {
        name: 'Puffin'
        , puffin: t
        , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
      }
    }
    else if (/sleipnir/i.test(ua)) {
      result = {
        name: 'Sleipnir'
        , sleipnir: t
        , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (/k-meleon/i.test(ua)) {
      result = {
        name: 'K-Meleon'
        , kMeleon: t
        , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
      }
    }
    else if (windowsphone) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      }
      else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    } else if (chromeos) {
      result = {
        name: 'Chrome'
      , chromeos: t
      , chromeBook: t
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    } else if (/chrome.+? edge/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      }
    }
    else if (/vivaldi/i.test(ua)) {
      result = {
        name: 'Vivaldi'
        , vivaldi: t
        , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (sailfish) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel|fxios/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    }
    else if (silk) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/slimerjs/i.test(ua)) {
      result = {
        name: 'SlimerJS'
        , slimer: t
        , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (webos) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (tizen) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/qupzilla/i.test(ua)) {
      result = {
        name: 'QupZilla'
        , qupzilla: t
        , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
      }
    }
    else if (/chromium/i.test(ua)) {
      result = {
        name: 'Chromium'
        , chromium: t
        , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
        , chrome: t
        , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
        , version: versionIdentifier
      }
    }
    else if (/safari|applewebkit/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      }
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if(/googlebot/i.test(ua)) {
      result = {
        name: 'Googlebot'
      , googlebot: t
      , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
      }
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      if (/(apple)?webkit\/537\.36/i.test(ua)) {
        result.name = result.name || "Blink"
        result.blink = t
      } else {
        result.name = result.name || "Webkit"
        result.webkit = t
      }
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.windowsphone && !result.msedge && (android || result.silk)) {
      result.android = t
    } else if (!result.windowsphone && !result.msedge && iosdevice) {
      result[iosdevice] = t
      result.ios = t
    } else if (mac) {
      result.mac = t
    } else if (xbox) {
      result.xbox = t
    } else if (windows) {
      result.windows = t
    } else if (linux) {
      result.linux = t
    }

    function getWindowsVersion (s) {
      switch (s) {
        case 'NT': return 'NT'
        case 'XP': return 'XP'
        case 'NT 5.0': return '2000'
        case 'NT 5.1': return 'XP'
        case 'NT 5.2': return '2003'
        case 'NT 6.0': return 'Vista'
        case 'NT 6.1': return '7'
        case 'NT 6.2': return '8'
        case 'NT 6.3': return '8.1'
        case 'NT 10.0': return '10'
        default: return undefined
      }
    }
    
    // OS version extraction
    var osVersion = '';
    if (result.windows) {
      osVersion = getWindowsVersion(getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i))
    } else if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (result.mac) {
      osVersion = getFirstMatch(/Mac OS X (\d+([_\.\s]\d+)*)/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = !result.windows && osVersion.split('.')[0];
    if (
         tablet
      || nexusTablet
      || iosdevice == 'ipad'
      || (android && (osMajorVersion == 3 || (osMajorVersion >= 4 && !mobile)))
      || result.silk
    ) {
      result.tablet = t
    } else if (
         mobile
      || iosdevice == 'iphone'
      || iosdevice == 'ipod'
      || android
      || nexusMobile
      || result.blackberry
      || result.webos
      || result.bada
    ) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.yandexbrowser && result.version >= 15) ||
		    (result.vivaldi && result.version >= 1.0) ||
        (result.chrome && result.version >= 20) ||
        (result.samsungBrowser && result.version >= 4) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        || (result.chromium && result.version >= 20)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        || (result.chromium && result.version < 20)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent || '' : '')

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  function getVersionPrecision(version) {
    return version.split(".").length;
  }

  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  function map(arr, iterator) {
    var result = [], i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i = 0; i < arr.length; i++) {
      result.push(iterator(arr[i]));
    }
    return result;
  }

  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions(['1.10.2.1',  '1.8.2.1.90'])    // 1
   *   compareVersions(['1.010.2.1', '1.09.2.1.90']);  // 1
   *   compareVersions(['1.10.2.1',  '1.10.2.1']);     // 0
   *   compareVersions(['1.10.2.1',  '1.0800.2']);     // -1
   *
   * @param  {Array<String>} versions versions to compare
   * @return {Number} comparison result
   */
  function compareVersions(versions) {
    // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
    var precision = Math.max(getVersionPrecision(versions[0]), getVersionPrecision(versions[1]));
    var chunks = map(versions, function (version) {
      var delta = precision - getVersionPrecision(version);

      // 2) "9" -> "9.0" (for precision = 2)
      version = version + new Array(delta + 1).join(".0");

      // 3) "9.0" -> ["000000000"", "000000009"]
      return map(version.split("."), function (chunk) {
        return new Array(20 - chunk.length).join("0") + chunk;
      }).reverse();
    });

    // iterate in reverse order by reversed chunks array
    while (--precision >= 0) {
      // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      else if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === 0) {
          // all version chunks are same
          return 0;
        }
      }
      else {
        return -1;
      }
    }
  }

  /**
   * Check if browser is unsupported
   *
   * @example
   *   bowser.isUnsupportedBrowser({
   *     msie: "10",
   *     firefox: "23",
   *     chrome: "29",
   *     safari: "5.1",
   *     opera: "16",
   *     phantom: "534"
   *   });
   *
   * @param  {Object}  minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function isUnsupportedBrowser(minVersions, strictMode, ua) {
    var _bowser = bowser;

    // make strictMode param optional with ua param usage
    if (typeof strictMode === 'string') {
      ua = strictMode;
      strictMode = void(0);
    }

    if (strictMode === void(0)) {
      strictMode = false;
    }
    if (ua) {
      _bowser = detect(ua);
    }

    var version = "" + _bowser.version;
    for (var browser in minVersions) {
      if (minVersions.hasOwnProperty(browser)) {
        if (_bowser[browser]) {
          if (typeof minVersions[browser] !== 'string') {
            throw new Error('Browser version in the minVersion map should be a string: ' + browser + ': ' + String(minVersions));
          }

          // browser version and min supported version.
          return compareVersions([version, minVersions[browser]]) < 0;
        }
      }
    }

    return strictMode; // not found
  }

  /**
   * Check if browser is supported
   *
   * @param  {Object} minVersions map of minimal version to browser
   * @param  {Boolean} [strictMode = false] flag to return false if browser wasn't found in map
   * @param  {String}  [ua] user agent string
   * @return {Boolean}
   */
  function check(minVersions, strictMode, ua) {
    return !isUnsupportedBrowser(minVersions, strictMode, ua);
  }

  bowser.isUnsupportedBrowser = isUnsupportedBrowser;
  bowser.compareVersions = compareVersions;
  bowser.check = check;

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Popover__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Menu__ = __webpack_require__(1);



let bowser = __webpack_require__(3);

$(window).load(function () {
    //browser compatibility check
    if (!bowser.blink && !bowser.gecko) {
        let $body = $('body');
        $body.empty();
        $body.append('<div class="warning">Пожалуйста, используйте Google Chrome версии 58+ или Firefox версии 53+</div>');
    }

    const constsDom = __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__["a" /* default */].get();
    const constsDomMenu = __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__["a" /* default */].getMenu();
    const constsDomPopover = __WEBPACK_IMPORTED_MODULE_0__ConstsDOM__["a" /* default */].getPopover();

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
        let newVal = $.trim($(this).find('.table-of-contents__item__page').text());

        __WEBPACK_IMPORTED_MODULE_2__Menu__["a" /* GoToPage */].go({currentPage: page.current, pagesLength: page.length, where: Math.abs(parseInt(newVal))});
    });

    //меняем межстрочный интервал
    $('.js-line-height-minus').on('click', function () {
        let $val = $('.js-line-height-val');

        __WEBPACK_IMPORTED_MODULE_2__Menu__["b" /* LineHeight */].set({$val: $val, direction: 'less', $text: $(constsDom.text)});
    });

    $('.js-line-height-plus').on('click', function () {
        let $val = $('.js-line-height-val');

        __WEBPACK_IMPORTED_MODULE_2__Menu__["b" /* LineHeight */].set({$val: $val, direction: 'more', $text: $(constsDom.text)});
    });

    //меняем страницу
    $('.js-page-next').on('click', function () {
        __WEBPACK_IMPORTED_MODULE_2__Menu__["a" /* GoToPage */].go({currentPage: page.current, pagesLength: page.length, where: 'next'});
    });

    $('.js-page-prev').on('click', function () {
        __WEBPACK_IMPORTED_MODULE_2__Menu__["a" /* GoToPage */].go({currentPage: page.current, pagesLength: page.length, where: 'prev'});
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

        __WEBPACK_IMPORTED_MODULE_2__Menu__["a" /* GoToPage */].go({currentPage: page.current, pagesLength: page.length, where: Math.abs(parseInt(newVal))});
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
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map