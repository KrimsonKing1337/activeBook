import GetDOMSelectors from './modules/GetDOMSelectors';
import 'jquery-mousewheel';
import 'malihu-custom-scrollbar-plugin-js';

export function mCustomScrollbarInit() {
    const $textWrapper = $(GetDOMSelectors().textWrapper);

    $('.js-scrollable-item').mCustomScrollbar({
        autoHideScrollbar: false,
        theme: 'minimal-dark',
        axis: 'y',
        scrollInertia: 0,
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

                $mCSBContainer.swiperight(() => {
                    $('.js-page-prev').trigger('click');
                });

                $mCSBContainer.swipeleft(() => {
                    $('.js-page-next').trigger('click');
                });
            },
            onScroll() {
                //hide scrollbar on touch devices
            }
        }
    });

    //todo: reset totalInstances (malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js:374)
}