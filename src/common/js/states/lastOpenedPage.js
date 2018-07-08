import LocalStorage from './LocalStorage';

class LastOpenedPage {
    constructor() {
        this.lastOpenedPage = LocalStorage.read({key: 'lastOpenedPage'}) || 0;
    }

    /**
     *
     * @param pageCurNum {number}
     */
    save(pageCurNum) {
        if (pageCurNum > this.lastOpenedPage) {
            LocalStorage.write({key: 'lastOpenedPage', val: pageCurNum});

            this.lastOpenedPage = pageCurNum;
        }
    }
}

export const lastOpenedPageInst = new LastOpenedPage();