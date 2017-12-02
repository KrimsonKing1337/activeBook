/**
 * меняем межстрочный интервал на странице
 */
export class LineHeight {
    constructor () {

    }

    /**
     *
     * @param params {object}
     * @param params.$text {object} jquery
     * @param params.$val {object} jquery
     * @param params.newVal {number}
     */
    static set (params = {}) {
        const $text = params.$text;
        const $val = params.$val;
        const newVal = params.newVal;

        LineHeight._apply({$text, $val, newVal});
    }

    /**
     *
     * @param params {object};
     * @param params.$text {object};
     * @param params.$val {object} jquery;
     * @param params.direction {string} less || more;
     */
    static setByDirection (params = {}) {
        const $text = params.$text;
        const $val = params.$val;
        const direction = params.direction;

        const currentVal = parseInt($text.attr('data-line-height')) || 100;

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

        LineHeight._apply({$text, $val, newVal});
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
        const $text = params.$text;
        const $val = params.$val;
        const newVal = params.newVal;

        $val.text(`${newVal }%`);
        $text.attr('data-line-height', newVal);
    }
}

/**
 * переход на страницу
 */
export class GoToPage {
    constructor () {

    }

    /**
     *
     * @param params {object};
     * @param params.val {string};
     */
    static go (params = {}) {
        const val = params.val;

        location.href = `/page-${ val }.html`;
    }

    /**
     *
     * @param params {object};
     * @param params.currentPage {string};
     * @param params.pagesLength {string};
     * @param params.direction {number || string} next || prev;
     */
    static goWithDirection (params = {}) {
        const direction = params.direction;
        const currentPage = params.currentPage;
        const pagesLength = params.pagesLength;

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
            new Error(`Unrecognized param "where" (${ direction }). Only next, prev and number is allowed`);
        }

        if (limit === true) return;

        GoToPage.go({val: newVal});
    }
}

/**
 * меняем размер шрифта
 */
export class FontSize {
    constructor () {

    }

    /**
     *
     * @param params {object}
     * @param params.$text {object} jquery
     * @param params.newVal {number}
     */
    static set (params = {}) {
        const $text = params.$text;
        const newVal = params.newVal;

        FontSize._apply({$text, newVal});
    }

    /**
     *
     * @param params {object};
     * @param params.$text {object};
     * @param params.direction {string} less || more;
     */
    static setByDirection (params = {}) {
        const $text = params.$text;
        const direction = params.direction;

        const currentVal = parseInt($text.attr('data-font-size')) || 100;

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

        FontSize._apply({$text, newVal});
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
        const $text = params.$text;
        const newVal = params.newVal;

        $text.attr('data-font-size', newVal);
    }
}

/**
 * меняем положение ползунков громкости
 */
export class VolumeSliders {
    constructor () {

    }

    /**
     *
     * @param params {object}
     * @param params.sliders {object} instances of sliders
     * @param params.sliders.global {object}
     * @param params.sliders.global.inst {object}
     * @param params.sliders.global.val {number}
     * @param params.sliders.hints {object}
     * @param params.sliders.hints.inst {object}
     * @param params.sliders.hints.val {number}
     * @param params.sliders.bg {object}
     * @param params.sliders.bg.inst {object}
     * @param params.sliders.bg.val {number}
     */
    static set(params = {}) {
        const sliders = params.sliders;

        for (const i in sliders) {
            const slider = sliders[i];
            const inst = slider.inst;
            const val = slider.val;

            inst.update({
                from: val
            })
        }
    }
}

export class Theme {
    constructor () {

    }

    /**
     *
     * @param params {object}
     * @param params.$page {object}
     * @param params.$themeOption {object}
     * @param params.val {object}
     */
    static set(params = {}) {
        const $page = params.$page;
        const $themeOption = params.$themeOption;
        const val = params.val;

        $page.attr('data-theme', val);

        $themeOption.filter('.active').removeClass('active');
        $themeOption.filter(`[data-theme="${ val }"]`).addClass('active');
    }
}

export class Vibration {
    constructor () {

    }

    /**
     *
     * @param params {object}
     * @param params.$page {object}
     * @param params.$vibrationOption {object}
     * @param params.val {object}
     */
    static set(params = {}) {
        const $page = params.$page;
        const $vibrationOption = params.$vibrationOption;
        const val = params.val;

        $vibrationOption.filter('.active').removeClass('active');
        $vibrationOption.filter(`[data-vibration="${ val }"]`).addClass('active');
        $page.attr('data-vibration', val);
    }
}

export class Bookmarks {
    constructor () {

    }

    /**
     *
     * @param params {object}
     * @param params.$bookmarkContainer {object}
     * @param params.$bookmarkTemplate {object}
     * @param params.bookmarksArr[] {object}
     */
    static set(params = {}) {
        const $bookmarkContainer = params.$bookmarkContainer;
        const $bookmarkTemplate = params.$bookmarkTemplate;
        const bookmarksArr = params.bookmarksArr;

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