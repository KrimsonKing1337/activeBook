import GetDOMSelectors from './GetDOMSelectors';
import {pageInfo} from './pageInfo';

export function swipesInit() {
    const DOMSelectors = GetDOMSelectors();
    const $textWrapper = $(DOMSelectors.textWrapper);

    $textWrapper.on('swiperight', () => {
        if (pageInfo.pageCurNum === 0) return;

        $('.js-page-prev').trigger('click');
    });

    $textWrapper.on('swipeleft', () => {
        if (pageInfo.pageCurNum === 0) return;

        $('.js-page-next').trigger('click');
    });
}