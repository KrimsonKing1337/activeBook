import 'jquery.scrollbar';

/**
 *
 * @param $item {object} jquery
 */
function scrollbarInit($item) {
    return new Promise(((resolve, reject) => {
        $item.scrollbar({
            onInit() {
                resolve();
            }
        });
    }));
}

function getScrollableItems() {
    return $('.js-scrollable-item')
        .filter(function () {
            return $(this).hasClass('template') === false && $(this).closest('.template').length === 0;
        });
}

export async function scrollbarInitAll() {
    const promisesArr = [];

    getScrollableItems().each((i, item) => {
        const $scrollableItemCur = $(item);

        $scrollableItemCur.addClass('scrollbar-macosx');

        promisesArr.push(scrollbarInit($scrollableItemCur));
    });

    await Promise.all(promisesArr);
}

export function scrollbarDestroy() {
    getScrollableItems().removeClass('scrollbar-macosx').scrollbar('destroy');
}

export function showHideScrollbarTouchEventsFix() {
    let timer;

    getScrollableItems().on('touchstart touchmove', function () {
        if (timer) clearTimeout(timer);

        $('.touchend').removeClass('touchend');
        $(this).addClass('touching');
    });

    getScrollableItems().on('touchend', function () {
        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            $('.touching').removeClass('touching');
            $(this).addClass('touchend');
        }, 300);
    });
}