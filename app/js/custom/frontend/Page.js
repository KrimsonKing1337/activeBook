export default class Page {
    constructor () {

    }

    static getParams() {
        let $pageNumber = $('.js-page-number');

        return {
            current: parseInt($pageNumber.attr('data-page-number')),
            length: parseInt($pageNumber.attr('data-pages-length')),
        }
    }
}