import LocalStorage from './modules/LocalStorage';
import {GoToPage} from './modules/Menu';

export function startReadingBtnInit() {
    const lastOpenedPage = LocalStorage.read({key: 'lastOpenedPage'});
    const $startReading = $('.start-reading');

    if (lastOpenedPage) {
        $startReading.filter('.from-last').addClass('active');
    } else {
        $startReading.filter('.from-begin').addClass('active');
    }

    $startReading.one('click', () => {
        setTimeout(() => {
            GoToPage.go({val: lastOpenedPage ? lastOpenedPage : 1});
        }, 500);
    });
}