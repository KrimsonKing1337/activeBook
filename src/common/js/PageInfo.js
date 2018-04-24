class PageInfo {
    constructor(pageInfo) {
        this.pageInfo = pageInfo;
    }

    set(pageInfo) {
        this.pageInfo = pageInfo;
    }

    get() {
        return this.pageInfo;
    }
}

export const pageInfo = new PageInfo();