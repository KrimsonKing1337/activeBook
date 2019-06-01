import getDOMSelectors from '../helpers/GetDOMSelectors';
import {FilterEffects} from '../effects/Effects';
import {lastOpenedPageInst} from '../states/lastOpenedPage';
import LocalStorage from '../states/LocalStorage';

const DOMSelectors = getDOMSelectors();

/**
 * меняем межстрочный интервал на странице
 */
export class LineHeight {
    constructor() {

    }

    /**
     *
     * @param $target {object} jquery
     * @param $val {object} jquery
     * @param newVal {number}
     */
    static set({$target, $val, newVal} = {}) {
        LineHeight.apply({$target, $val, newVal});
    }

    /**
     *
     * @param $target {object};
     * @param $val {object} jquery;
     * @param direction {string} less || more;
     */
    static setByDirection({$target, $val, direction} = {}) {
        const currentVal = parseInt($target.attr('data-line-height')) || 100;

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

        LineHeight.apply({$target, $val, newVal});
    }

    /**
     *
     * @param $target {object} jquery;
     * @param $val {object} jquery;
     * @param newVal {number};
     * @private
     */
    static apply({$target, $val, newVal} = {}) {
        $val.text(`${ newVal }%`);
        $target.attr('data-line-height', newVal);
    }
}

/**
 * переход на страницу
 */
export class GoToPage {
    constructor() {

    }

    /**
     *
     * @param val {string || number};
     * @param withDirection {boolean};
     */
    static go({val, withDirection = false} = {}) {
        //todo: uncomment before release
        /*if (withDirection === false) {
            const lastOpenedPage = lastOpenedPageInst.lastOpenedPage;

            if (val > lastOpenedPage && val !== 1) {
                $(window).trigger('changePage', lastOpenedPage);
            } else {
                $(window).trigger('changePage', val);
            }

        } else {
            $(window).trigger('changePage', val);
        }*/

        $(window).trigger('changePage', val);
    }

    /**
     *
     * @param currentPage {string};
     * @param pagesLength {string};
     * @param direction {number || string} next || prev;
     */
    static goWithDirection({direction, currentPage, pagesLength} = {}) {
        let newVal;
        let limit;

        if (direction === 'next') {
            newVal = currentPage + 1;
            limit = currentPage >= pagesLength;
        } else if (direction === 'prev') {
            newVal = currentPage - 1;
            limit = currentPage <= 1;
        } else if (typeof direction === 'number' && isNaN(direction) === false) {
            newVal = direction;

            if (newVal <= 1) {
                newVal = 1;
            } else if (newVal >= pagesLength) {
                newVal = pagesLength;
            }

            limit = newVal === currentPage;
        } else {
            new Error(`Unrecognized param "where" (${ direction }). Only next, prev and number are allowed`);
        }

        if (limit === true) return;

        GoToPage.go({val: newVal, withDirection: true});
    }
}

/**
 * меняем размер шрифта
 */
export class FontSize {
    constructor() {

    }

    /**
     *
     * @param $target {object} jquery
     * @param newVal {number}
     */
    static set({$target, newVal} = {}) {
        FontSize.apply({$target, newVal});
    }

    /**
     *
     * @param $target {object};
     * @param direction {string} less || more;
     */
    static setByDirection({$target, direction} = {}) {
        const currentVal = parseInt($target.attr('data-font-size')) || 100;

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

        FontSize.apply({$target, newVal});
    }

    /**
     *
     * @param $target {object} jquery;
     * @param newVal {number};
     * @private
     */
    static apply({$target, newVal} = {}) {
        $target.attr('data-font-size', newVal);
    }
}

/**
 * меняем положение ползунков громкости
 */
export class VolumeSliders {
    constructor() {

    }

    /**
     *
     * @param sliders {object} instances of sliders
     * @param sliders.global {object}
     * @param sliders.global.inst {object}
     * @param sliders.global.val {number}
     * @param sliders.oneShots {object}
     * @param sliders.oneShots.inst {object}
     * @param sliders.oneShots.val {number}
     * @param sliders.bg {object}
     * @param sliders.bg.inst {object}
     * @param sliders.bg.val {number}
     */
    static set({sliders} = {}) {
        for (const i in sliders) {
            const slider = sliders[i];
            const inst = slider.inst;
            const val = slider.val;

            inst.update({
                from: val
            });
        }
    }
}

export class Theme {
    constructor() {

    }

    /**
     *
     * @param $target {object}
     * @param $themeOption {object}
     * @param val {object}
     */
    static set({$target, $themeOption, val} = {}) {
        $target.attr('data-theme', val);
        Theme.applyThemeToMetaTag(val);

        $themeOption.filter('.active').removeClass('active');
        $themeOption.filter(`[data-theme="${ val }"]`).addClass('active');
    }

  /**
   *
   * @param themeName {string}
   */
  static applyThemeToMetaTag(themeName) {
      const $meta = $('meta[name="theme-color"]');

      const colors = {
        'dark': '#828282',
        'black': '#111',
        'dark-blue': '#728c9a',
        'default': '#f2994a'
      };

      $meta.attr('content', colors[themeName]);
    }
}

export class Vibration {
    constructor() {

    }

    /**
     *
     * @param $target {object}
     * @param $vibrationOption {object}
     * @param val {object}
     */
    static set({$target, $vibrationOption, val} = {}) {
        $vibrationOption.filter('.active').removeClass('active');
        $vibrationOption.filter(`[data-vibration="${ val }"]`).addClass('active');
        $target.attr('data-vibration', val);
    }
}

export class Flashlight {
    constructor() {

    }

    /**
     *
     * @param $target {object}
     * @param $vibrationOption {object}
     * @param val {object}
     */
    static set({$target, $flashlightOption, val} = {}) {
        $flashlightOption.filter('.active').removeClass('active');
        $flashlightOption.filter(`[data-flashlight="${ val }"]`).addClass('active');
        $target.attr('data-flashlight', val);
    }
}

export class Invert {
    constructor() {

    }

    /**
     *
     * @param $invertOption {object}
     * @param val {boolean}
     * @param [writeToLocalStorage] {boolean}
     */
    static set({$invertOption, val, writeToLocalStorage = false} = {}) {
        $invertOption.filter('.active').removeClass('active');
        $invertOption.filter(`[data-invert="${ val }"]`).addClass('active');

        FilterEffects.invert(val, writeToLocalStorage);
    }

    static get() {
        return LocalStorage.write({key: 'filterInvert'});
    }

    static show() {
        $(DOMSelectors.invertToggle).addClass('active');
    }

    static hide() {
        $(DOMSelectors.invertToggle).removeClass('active');
    }
}

export class Bookmarks {
    constructor() {

    }

    /**
     *
     * @param $bookmarkContainer {object}
     * @param $bookmarkTemplate {object}
     * @param bookmarksArr[] {object}
     */
    static set({$bookmarkContainer, $bookmarkTemplate, bookmarksArr} = {}) {
        if (!bookmarksArr) return;

        bookmarksArr.forEach((bookmark) => {
            const date = bookmark.date;
            const page = bookmark.page;

            const $newBookmark = $bookmarkTemplate.clone(true).removeClass('template');

            $newBookmark.find('.js-bookmark-date').text(date);
            $newBookmark.find('.js-bookmark-page').text(page);

            $bookmarkContainer.append($newBookmark);
        });
    }
}
