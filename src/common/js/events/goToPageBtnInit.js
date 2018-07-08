import LocalStorage from '../states/LocalStorage';
import {GoToPage} from '../menu/Menu';
import {pageInfo} from '../forAppInit/pageInfo';

/**
 *
 * @param goTo {string || number}
 */
function getPageToGo(goTo) {
    if (goTo === 'pageForResumeReading') {
        const pageForResumeReading = LocalStorage.read({key: 'pageForResumeReading'});
        const pageToGo = pageForResumeReading === 'credits' ? null : pageForResumeReading;

        return pageToGo ? pageToGo : 1;
    } else if (goTo === 'main') {
        return 0;
    }
}

/**
 * go to another page by fake link
 */
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