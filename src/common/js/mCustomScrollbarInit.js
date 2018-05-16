import GetDOMSelectors from './modules/GetDOMSelectors';
import 'jquery-mousewheel';
import 'malihu-custom-scrollbar-plugin-js';

export function mCustomScrollbarInit() {
    const DOMSelectors = GetDOMSelectors();
    const $textWrapper = $(DOMSelectors.textWrapper);
    const isTouchDevice = JSON.parse($(DOMSelectors.page).attr('data-touch-device'));

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
            onCreate() {
                if (isTouchDevice === true) {
                    $(this).find('.mCSB_scrollTools').css('opacity', '0');
                }
            },
            onScrollStart() {
                if (isTouchDevice === true) {
                    $(this).find('.mCSB_scrollTools').css('opacity', '1');
                }
            },
            onScroll() {
                if (isTouchDevice === true) {
                    $(this).find('.mCSB_scrollTools').css('opacity', '0');
                }
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