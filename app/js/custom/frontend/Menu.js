/**
 * меняем межстрочный интервал на странице
 */
export class LineHeight {
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

/**
 * переход на страницу
 */
export class GoToPage {
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

/**
 * меняем размер шрифта
 */
export class FontSize {
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