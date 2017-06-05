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

        let classForRemove = 'line-height-' + $text.attr('data-line-height');

        $text.removeClass(classForRemove).addClass('line-height-' + newVal);
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

        let classForRemove = 'font-size-' + $text.attr('data-font-size');

        $text.removeClass(classForRemove).addClass('font-size-' + newVal);
        $text.attr('data-font-size', newVal);
    }
}