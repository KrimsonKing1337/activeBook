import GetDOMSelectors from './modules/GetDOMSelectors';
import 'jquery-mousewheel';
import 'malihu-custom-scrollbar-plugin';

export function mCustomScrollbarInit () {
    const $textWrapper = $(GetDOMSelectors().textWrapper);

    $textWrapper.mCustomScrollbar({
        autoHideScrollbar: true,
        theme: 'minimal-dark',
        keyboard:{
            enable: true
        },
        advanced: {
            updateOnContentResize: true
        }
    });

    $textWrapper.find('.mCSB_container').attr('tabindex', '-1');

    //todo: reset totalInstances (malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js:374)
}