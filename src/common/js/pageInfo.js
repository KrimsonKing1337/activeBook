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
     * @param pageCurNum {number}
     * @param pagesLength {number}
     */
    set({pageCurNum, pagesLength} = {}) {
        //обновляем значение, только если это число (если ничего не было передано - не обновляем)
        if (typeof pageCurNum === "number") {
            this.pageCurNum = pageCurNum;
        }

        //обновляем значение, только если это число (если ничего не было передано - не обновляем)
        if (typeof pagesLength === "number") {
            this.pagesLength = pagesLength;
        }
    }
}

export const pageInfo = new PageInfo();