import getDOMSelectors from './modules/GetDOMSelectors';

export function scrollAutoHideInit() {
    const $textWrapper = $(getDOMSelectors().textWrapper);

    /**
     *
     * there is no native event about scroll stop,
     * so use this "duct tape" for
     */
    let timerForScroll = null;

    $textWrapper.on('scroll', () => {
        if (timerForScroll !== null) {
            clearTimeout(timerForScroll);
        }

        timerForScroll = setTimeout(() => {
            $textWrapper.removeClass('scrollable');
        }, 500);
    });

    let timerForOtherEvents = null;

    $textWrapper.on('wheel gesturestart touchstart keydown', (e) => {
        if (e.type === 'keydown') {
            if (e.which !== 38 && e.which !== 40) {
                return;
            }
        }

        if ($textWrapper[0].offsetHeight >= $textWrapper[0].scrollHeight) {
            return;
        }

        $textWrapper.addClass('scrollable');

        if (timerForOtherEvents !== null) {
            clearTimeout(timerForOtherEvents);
        }

        timerForOtherEvents = setTimeout(() => {
            $textWrapper.removeClass('scrollable');
        }, 500);
    });
}