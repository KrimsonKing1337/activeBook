/**
 * медиатор для информации для текущей странице / всех страницах
 * нужен для того, чтобы не производить заново инициализацию
 * menu. и для одинаковой актуальной информации у всех,
 * singleton
 */
class PageInfo {
    constructor() {
        this.pageCurNum = 0;
        this.pagesLength = 0;
    }

    /**
     *
     * @param pageCurNum {number || string}
     * @param pagesLength {number}
     */
    set({pageCurNum, pagesLength} = {}) {
        if (typeof pageCurNum !== 'undefined') {
            this.pageCurNum = pageCurNum;
        }

        if (typeof pagesLength !== 'undefined') {
            this.pagesLength = pagesLength;
        }
    }
}

export const pageInfo = new PageInfo();