import LocalStorage from './modules/LocalStorage';
import {GoToPage} from './modules/Menu';
import {pageInfo} from './pageInfo';

/**
 *
 * @param goTo {string || number}
 */
function getPageToGo(goTo) {
    if (goTo === 'lastOpenedPage') {
        const lastOpenedPage = LocalStorage.read({key: 'lastOpenedPage'});
        const pageToGo = lastOpenedPage === 'credits' ? null : lastOpenedPage;

        return pageToGo ? pageToGo : 1;
    } else if (goTo === 'main') {
        return 0;
    }
}

export function goToPageBtnInit() {
    const $goToPage = $('.go-to-page');

    if ($goToPage.length === 0) return;

    const pageCurNum = pageInfo.pageCurNum;
    const goTo = $goToPage.attr('data-go-to');
    const pageToGo = getPageToGo(goTo);

    /**
     * init text of start reading button on the main page
     */
    if (pageCurNum === 0) {
        if (pageToGo !== 1) {
            $goToPage.find('a').text('Продолжить читать');
        } else {
            $goToPage.find('a').text('Начать читать');
        }
    }

    $goToPage.one('click', () => {
        setTimeout(() => {
            GoToPage.go({val: pageToGo});
        }, 500);
    });
}