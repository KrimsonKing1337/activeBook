import GetDOMSelectors from './modules/GetDOMSelectors';
import 'jquery-mousewheel';
import 'malihu-custom-scrollbar-plugin-js';

export function mCustomScrollbarInit() {
    const $textWrapper = $(GetDOMSelectors().textWrapper);

    $('.js-scrollable-item').mCustomScrollbar({
        autoHideScrollbar: false,
        alwaysShowScrollbar: 0,
        theme: 'minimal-dark',
        axis: 'y',
        scrollInertia: 0,
        documentTouchScroll: false,
        keyboard: {
            enable: true
        },
        advanced: {
            updateOnContentResize: true
        },
        callbacks: {
            onInit() {
                const $mCSBContainer = $textWrapper.find('.mCSB_container');

                $mCSBContainer.attr('tabindex', '-1');

                $mCSBContainer.focus();
            },
            onScroll() {
                //hide scrollbar on touch devices
            }
        }
    });

    const $mCSBContainer = $textWrapper.find('.mCSB_container');

    $mCSBContainer.swiperight(() => {
        $('.js-page-prev').trigger('click');
    });

    $mCSBContainer.swipeleft(() => {
        $('.js-page-next').trigger('click');
    });

    //todo: reset totalInstances (malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js:374)
}