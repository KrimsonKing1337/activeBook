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
        let $text = params.$text;
        let $val = params.$val;
        let newVal = params.newVal;

        LineHeight._apply({$text: $text, $val: $val, newVal: newVal});
    }

    /**
     *
     * @param params {object};
     * @param params.$text {object};
     * @param params.$val {object} jquery;
     * @param params.direction {string} less || more;
     */
    static setByDirection (params = {}) {
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
        let val = params.val;

        location.href = '../pages/page_' + val + '.html';
    }

    /**
     *
     * @param params {object};
     * @param params.currentPage {string};
     * @param params.pagesLength {string};
     * @param params.direction {number || string} next || prev;
     */
    static goWithDirection (params = {}) {
        let direction = params.direction;
        let currentPage = params.currentPage;
        let pagesLength = params.pagesLength;

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
            new Error('Unrecognized param "where" (' + direction + '). Only next, prev and number is allowed');
        }

        if (limit === true) return;

        window.flags.changePageAfterLoad = false;

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
        let $text = params.$text;
        let newVal = params.newVal;

        FontSize._apply({$text: $text, newVal: newVal});
    }

    /**
     *
     * @param params {object};
     * @param params.$text {object};
     * @param params.direction {string} less || more;
     */
    static setByDirection (params = {}) {
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
        let sliders = params.sliders;

        for (let i in sliders) {
            let slider = sliders[i];
            let inst = slider.inst;
            let val = slider.val;

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
        let $page = params.$page;
        let $themeOption = params.$themeOption;
        let val = params.val;

        $page.attr('data-theme', val);

        $themeOption.filter('.active').removeClass('active');
        $themeOption.filter('[data-theme="' + val + '"]').addClass('active');
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
        let $page = params.$page;
        let $vibrationOption = params.$vibrationOption;
        let val = params.val;

        $vibrationOption.filter('.active').removeClass('active');
        $vibrationOption.filter('[data-vibration="' + val + '"]').addClass('active');
        $page.attr('data-vibration', val);
    }
}